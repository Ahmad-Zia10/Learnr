import { Course } from "../../models/course.model.js";
import { CourseProgess } from "../../models/courseProgess.model.js";
import { Order } from "../../models/order.model.js";
import { Section } from "../../models/section.model.js";
import { User } from "../../models/user.model.js";
import { ORDER_PLAN, PROGRESS_PLAN } from "../data/orders.js";

const dayMs = 24 * 60 * 60 * 1000;

//Razorpay ids are clearly marked as seeded so they can never be mistaken for
//real gateway records if anyone goes looking in the database.
const seededId = (prefix, index) => `${prefix}_seed_${String(index).padStart(4, "0")}`;

//Every lecture of a course, in the order a student would watch them.
const lecturesInOrder = async (course) => {
    const sections = await Section.find({ _id : { $in : course.courseContent } });

    //Section.find does not preserve the order of the ids it was given, and the
    //viewer plays them in courseContent order, so restore that here
    const byId = new Map(sections.map((section) => [String(section._id), section]));

    return course.courseContent.flatMap(
        (sectionId) => byId.get(String(sectionId))?.subSection ?? []
    );
}

const run = async ({ courses, students }) => {
    let orderCount = 0;
    let paidCount = 0;
    let failedCount = 0;
    let amountTotal = 0;

    for (const [index, plan] of ORDER_PLAN.entries()) {
        const student = students[plan.student];

        if(!student) {
            throw new Error(`order plan names unknown student "${plan.student}"`);
        }

        const ordered = plan.courses.map((key) => {
            const course = courses[key];
            if(!course) {
                throw new Error(`order for "${plan.student}" names unknown course "${key}"`);
            }
            return course;
        });

        //the amount is derived from the course prices, exactly as capturePayment
        //computes it, so history can never disagree with the catalog
        const amountInPaise = ordered.reduce((total, course) => total + course.price, 0) * 100;
        const status = plan.status ?? "Paid";
        const placedAt = new Date(Date.now() - plan.daysAgo * dayMs);

        const order = await Order.create({
            user : student._id,
            courses : ordered.map((course) => course._id),
            amount : amountInPaise,
            currency : "INR",
            razorpayOrderId : seededId("order", index),
            razorpayPaymentId : status === "Paid" ? seededId("pay", index) : undefined,
            status,
            createdAt : placedAt,
            updatedAt : placedAt
        });

        //Only a paid order grants access. The failed one is left dangling on
        //purpose: it proves the platform does not enrol on a failed payment.
        if(status === "Paid") {
            for (const course of ordered) {
                await Course.findByIdAndUpdate(course._id, {
                    $addToSet : { studentsEnrolled : student._id }
                });
                await User.findByIdAndUpdate(student._id, {
                    $addToSet : { courses : course._id }
                });
            }
            paidCount++;
            amountTotal += amountInPaise;
        } else {
            failedCount++;
        }

        //Mongoose overwrites createdAt on insert, so set the backdate directly
        await Order.collection.updateOne(
            { _id : order._id },
            { $set : { createdAt : placedAt, updatedAt : placedAt } }
        );

        orderCount++;
    }

    //--- progress -----------------------------------------------------------
    let progressCount = 0;
    let lecturesWatched = 0;

    for (const plan of PROGRESS_PLAN) {
        const student = students[plan.student];
        const course = courses[plan.course];

        if(!student) throw new Error(`progress plan names unknown student "${plan.student}"`);
        if(!course)  throw new Error(`progress plan names unknown course "${plan.course}"`);

        const lectures = await lecturesInOrder(course);
        const watched = lectures.slice(0, Math.round(lectures.length * plan.fraction));

        await CourseProgess.findOneAndUpdate(
            { courseID : course._id, userId : student._id },
            { $set : { completedVideos : watched } },
            { upsert : true, new : true, setDefaultsOnInsert : true }
        );

        progressCount++;
        lecturesWatched += watched.length;
    }

    console.log(`  ${orderCount} orders (${paidCount} paid, ${failedCount} failed)`);
    console.log(`  Rs. ${(amountTotal / 100).toLocaleString("en-IN")} in paid orders`);
    console.log(`  ${progressCount} progress records, ${lecturesWatched} lectures watched`);

    return {};
}

export default { title : "Orders and progress", run };
