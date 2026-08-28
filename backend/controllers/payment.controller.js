import { instance } from "../config/razorpay.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { Order } from "../models/order.model.js";
import mailSender from "../utils/mailSender.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import crypto from "crypto";
import apiResponse from "../utils/apiResponse.js";
import courseEnrollmentEmail from "../mail/templates/courseEnrollmentEmail.js";

//Enrol a user into every course of a paid order. Written to be idempotent so
//the verify endpoint and the webhook can both call it without double-enrolling.
const fulfilOrder = async (order) => {
    const userId = order.user;

    for (const courseId of order.courses) {
        //$addToSet (not $push) means a repeated call cannot duplicate the entry
        await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { studentsEnrolled: userId } }
        );

        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { courses: courseId } }
        );
    }
}

//Send one confirmation email per purchased course.
const sendEnrollmentEmails = async (order) => {
    const student = await User.findById(order.user);
    if (!student) return;

    const courses = await Course.find({ _id: { $in: order.courses } });

    for (const course of courses) {
        try {
            await mailSender(
                student.email,
                `Successfully enrolled in ${course.courseName}`,
                courseEnrollmentEmail(course.courseName, `${student.firstName} ${student.lastName}`)
            );
        } catch (error) {
            //a failed email must never fail the payment
            console.log("Could not send enrollment email", error.message);
        }
    }
}

//Create ONE Razorpay order covering the whole cart.
const capturePayment = asyncHandler( async (req,res) => {
    const { courseIds } = req.body;
    const userId = req.user._id;

    if(!Array.isArray(courseIds) || courseIds.length === 0) {
        throw new apiError(400, "At least one course is required")
    }

    const courses = await Course.find({ _id : { $in : courseIds } });

    if(courses.length !== courseIds.length) {
        throw new apiError(404, "One or more courses could not be found")
    }

    //Reject the whole order if the student already owns any of these courses.
    const alreadyEnrolled = courses.filter((course) =>
        course.studentsEnrolled.some((id) => id.equals(userId))
    );

    if(alreadyEnrolled.length) {
        throw new apiError(
            409,
            `Already enrolled in: ${alreadyEnrolled.map((c) => c.courseName).join(", ")}`
        )
    }

    //The total is derived from the database, never from the client, so a
    //tampered request cannot change what the student is charged.
    const amountInPaise = courses.reduce((total, course) => total + course.price, 0) * 100;

    if(amountInPaise <= 0) {
        throw new apiError(400, "Order total must be greater than zero")
    }

    let paymentResponse;
    try {
        paymentResponse = await instance.orders.create({
            amount : amountInPaise,
            currency : "INR",
            receipt : crypto.randomUUID(),
        });
    } catch (error) {
        console.log("Could not create Razorpay order", error.message);
        throw new apiError(500, "Could not create payment order")
    }

    //Record what was ordered so verification does not have to trust the client.
    await Order.create({
        user : userId,
        courses : courseIds,
        amount : amountInPaise,
        currency : paymentResponse.currency,
        razorpayOrderId : paymentResponse.id,
        status : "Created"
    });

    return res
    .status(200)
    .json(new apiResponse(200, {
        order_id : paymentResponse.id,
        currency : paymentResponse.currency,
        amount : paymentResponse.amount
    }, "Order created successfully."))
})

//Called by the frontend once the Razorpay widget reports success.
const verifyPayment = asyncHandler( async (req,res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if(!(razorpay_order_id && razorpay_payment_id && razorpay_signature)) {
        throw new apiError(400, "Incomplete payment details")
    }

    //Razorpay signs "<order_id>|<payment_id>" with the key secret.
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    const signatureIsValid =
        expectedSignature.length === razorpay_signature.length &&
        crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(razorpay_signature)
        );

    if(!signatureIsValid) {
        throw new apiError(400, "Payment could not be verified")
    }

    const order = await Order.findOne({ razorpayOrderId : razorpay_order_id });

    if(!order) {
        throw new apiError(404, "Order not found")
    }

    //The order belongs to whoever created it, not to whoever calls this.
    if(!order.user.equals(req.user._id)) {
        throw new apiError(403, "This order belongs to another user")
    }

    //Already fulfilled by an earlier call or the webhook: nothing left to do.
    if(order.status === "Paid") {
        return res
        .status(200)
        .json(new apiResponse(200, { orderId : order._id }, "Payment already verified"))
    }

    order.status = "Paid";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await fulfilOrder(order);
    await sendEnrollmentEmails(order);

    return res
    .status(200)
    .json(new apiResponse(200, { orderId : order._id }, "Payment verified and courses unlocked"))
})

//Server-to-server safety net: enrols the student even if the browser dropped
//out before the verify call landed.
const verifySignature = asyncHandler( async (req,res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if(!webhookSecret) {
        throw new apiError(500, "Webhook secret is not configured")
    }

    const signature = req.headers["x-razorpay-signature"];

    if(!signature) {
        throw new apiError(400, "Missing webhook signature")
    }

    const digest = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

    const signatureIsValid =
        digest.length === signature.length &&
        crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));

    if(!signatureIsValid) {
        throw new apiError(400, "Invalid Payment Request")
    }

    const entity = req.body?.payload?.payment?.entity;
    const razorpayOrderId = entity?.order_id;

    if(!razorpayOrderId) {
        throw new apiError(400, "Webhook payload is missing an order id")
    }

    const order = await Order.findOne({ razorpayOrderId });

    if(!order) {
        throw new apiError(404, "Order not found")
    }

    //Idempotent: the verify endpoint may already have fulfilled this order.
    if(order.status === "Paid") {
        return res
        .status(200)
        .json(new apiResponse(200, null, "Order already fulfilled"))
    }

    order.status = "Paid";
    order.razorpayPaymentId = entity?.id;
    await order.save();

    await fulfilOrder(order);
    await sendEnrollmentEmails(order);

    return res
    .status(200)
    .json(new apiResponse(200, null, "Signature verified and courses unlocked"))
})

export {
    capturePayment,
    verifyPayment,
    verifySignature
}
