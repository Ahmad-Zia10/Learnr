import { instance } from "../config/razorpay.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import mailSender from "../utils/mailSender.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import mongoose from "mongoose";
import apiResponse from "../utils/apiResponse.js";

const capturePayment = asyncHandler( async (req,res) => {
    //get details
    const courseId = req.body;
    const userId = req.user._id
    //validate courseId
    if(!courseId) {
        throw new apiError(401, "Course Id is required")
    }
    //validate course Details
    let courseDetails;
    try {
        courseDetails = await Course.findById(courseId);
    } catch (error) {
        console.log("Course does not exist",error.message)
        throw new apiError(401, "Course does not exist")
    }
    //check if user is already enrolled
    if(courseDetails.studentsEnrolled.some(id => id.equals(userId))) {
        return res
        .status(200)
        .json(new apiResponse(200, "Student is already enrolled"));
    }

    //create an order
    const amount = courseDetails.price;
    const currency = "INR"

    const options = {
        amount : amount*100,
        currency,
        receipt : Math.random(Date.now()).toString(),
        notes : {
            courseId,
            userId
        }
    }

    try {
        const paymentResponse = await instance.orders.create(options);
        console.log("Payment Response :",paymentResponse);
        //return response 
        const response = {
            courseName : courseDetails.courseName,
            courseDescription : courseDetails.courseDescription,
            thumbnail : courseDetails.thumbnail,
            order_id : paymentResponse.id,
            currency : paymentResponse.currency,
            amount : paymentResponse.amount
        }
        return res
        .status(200)
        .json(new apiResponse(200, response, "Order Created successfully for this course."))
    } catch (error) {
        
    }
})

const verifySignature = asyncHandler( async (req,res) => {
    const webhookSecret = "123456";

    const signature = req.headers("x-razorpay-signature");

    const shasum = crypto.createHmac("sha256",webhookSecret)
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    //validate signature
    if((signature !== digest)) {
        throw new apiError(400, "Invalid Payment Request")
    }

    //once payment is validated , now update course and user
    const {courseId, userId} = req.body.payload.payment.entity.notice

    try {
        const enrolledCourse = Course.findOneAndUpdate(
            {_id : courseId},
            {
                $push : {
                    studentsEnrolled : userId
                }
            },
            {new:true}
        )

        console.log("Student Enrolled in Course:", enrolledCourse);
    } catch (error) {
        console.log("Course not Found ", error.message);
        throw new apiError(400, "Course not Found")
    }

    try {
        const enrolledStudent = await User.findByIdAndUpdate(
            {_id : userId},
            {
                $push : {
                    courses : courseId
                }
            }
        )

        console.log("Course Added to users course list",enrolledStudent);
        

    } catch (error) {
        console.log("Student could not be found",enrolledStudent);
        throw new apiError(400, "User not found")
    }

    //send confirmation mail

    const emailResponse = await mailSender(
                            enrolledStudent.email,
                            "Congratulations from codehelp",
                            "Student Onboard. Let's hustle!"
    )

    return res
    .status(200)
    .json(new apiResponse(
        200,
        "Signature verified and course added"
    ))


})

export {
    capturePayment,
    verifySignature
}