import { Category } from "../models/category.model.js";
import { Course } from "../models/course.model.js";
import { CourseProgess } from "../models/courseProgess.model.js";
import { Order } from "../models/order.model.js";
import { Profile } from "../models/profile.model.js";
import { RatingAndReview } from "../models/ratingAndReview.model.js";
import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";
import { User } from "../models/user.model.js";

const id = (value) => String(value?._id ?? value);

//Checks the invariants the schema itself cannot enforce. Every relation below
//is stored on both documents, so either side can drift out of step with the
//other - which is how a course goes invisible or a lecture becomes unreachable.
const verify = async () => {
    const problems = [];
    const fail = (message) => problems.push(message);

    const [courses, sections, subSections, categories, users, profiles, reviews, orders, progress] =
        await Promise.all([
            Course.find({}).lean(),
            Section.find({}).lean(),
            SubSection.find({}).lean(),
            Category.find({}).lean(),
            //password is normally hidden from queries; the hash check needs it
            User.find({}).select("+password").lean(),
            Profile.find({}).lean(),
            RatingAndReview.find({}).lean(),
            Order.find({}).lean(),
            CourseProgess.find({}).lean()
        ]);

    const sectionIds = new Set(sections.map(id));
    const subSectionIds = new Set(subSections.map(id));
    const courseIds = new Set(courses.map(id));
    const userIds = new Set(users.map(id));
    const categoryIds = new Set(categories.map(id));

    //--- courses -----------------------------------------------------------
    for (const course of courses) {
        const label = course.courseName;

        //the dangling-section bug: an id that survives its document
        for (const sectionId of course.courseContent ?? []) {
            if(!sectionIds.has(id(sectionId))) {
                fail(`course "${label}" references missing section ${id(sectionId)}`);
            }
        }

        if(!course.status) {
            fail(`course "${label}" has no status, so it is neither Draft nor Published`);
        }

        if(!categoryIds.has(id(course.category))) {
            fail(`course "${label}" references missing category ${id(course.category)}`);
        } else {
            //both halves of the course<->category relation must agree
            const category = categories.find((entry) => id(entry) === id(course.category));
            if(!(category.courses ?? []).map(id).includes(id(course))) {
                fail(`course "${label}" is not listed in category "${category.name}"`);
            }
        }

        if(!userIds.has(id(course.instructor))) {
            fail(`course "${label}" references missing instructor ${id(course.instructor)}`);
        }

        //both halves of the enrolment relation
        for (const studentId of course.studentsEnrolled ?? []) {
            const student = users.find((entry) => id(entry) === id(studentId));
            if(!student) {
                fail(`course "${label}" enrols missing user ${id(studentId)}`);
                continue;
            }
            if(!(student.courses ?? []).map(id).includes(id(course))) {
                fail(`"${student.firstName} ${student.lastName}" is enrolled in "${label}" but the course is missing from their list`);
            }
        }

        for (const reviewId of course.ratingAndReviews ?? []) {
            if(!reviews.some((review) => id(review) === id(reviewId))) {
                fail(`course "${label}" references missing review ${id(reviewId)}`);
            }
        }
    }

    //--- categories --------------------------------------------------------
    for (const category of categories) {
        for (const courseId of category.courses ?? []) {
            if(!courseIds.has(id(courseId))) {
                fail(`category "${category.name}" references missing course ${id(courseId)}`);
            }
        }
    }

    //--- sections and lectures ---------------------------------------------
    const sectionsOnCourses = new Set(courses.flatMap((course) => (course.courseContent ?? []).map(id)));
    for (const section of sections) {
        if(!sectionsOnCourses.has(id(section))) {
            fail(`section "${section.sectionName}" belongs to no course`);
        }

        for (const subId of section.subSection ?? []) {
            if(!subSectionIds.has(id(subId))) {
                fail(`section "${section.sectionName}" references missing lecture ${id(subId)}`);
            }
        }
    }

    //the orphaned-lecture bug: a lecture no section points at is unreachable
    const lecturesOnSections = new Set(sections.flatMap((section) => (section.subSection ?? []).map(id)));
    for (const lecture of subSections) {
        if(!lecturesOnSections.has(id(lecture))) {
            fail(`lecture "${lecture.title}" is orphaned - no section references it`);
        }
        if(!lecture.video) {
            fail(`lecture "${lecture.title}" has no video URL`);
        }
    }

    //--- users -------------------------------------------------------------
    const emails = new Set();

    for (const user of users) {
        const label = `${user.firstName} ${user.lastName}`;

        if(!user.additionalDetails) {
            fail(`user "${label}" has no profile, which My Profile requires`);
        } else if(!profiles.some((profile) => id(profile) === id(user.additionalDetails))) {
            fail(`user "${label}" points at a profile that does not exist`);
        }

        //a bulk insert skips the hashing hook, producing an account that looks
        //fine here and can never log in
        if(!/^\$2[aby]\$/.test(user.password ?? "")) {
            fail(`user "${label}" has an unhashed password and cannot log in`);
        }

        //login looks users up by email, so a duplicate makes one unreachable
        if(emails.has(user.email)) {
            fail(`email "${user.email}" is used by more than one account`);
        }
        emails.add(user.email);

        if(user.accountType === "Instructor" && !user.approved) {
            fail(`instructor "${label}" is not approved and cannot publish`);
        }

        for (const courseId of user.courses ?? []) {
            const course = courses.find((entry) => id(entry) === id(courseId));
            if(!course) {
                fail(`user "${label}" references missing course ${id(courseId)}`);
                continue;
            }

            //an instructor's courses are authored, not enrolled, so only
            //students need to appear in studentsEnrolled
            if(user.accountType === "Student" &&
               !(course.studentsEnrolled ?? []).map(id).includes(id(user))) {
                fail(`"${label}" lists "${course.courseName}" but is missing from its students`);
            }
        }
    }

    //--- reviews -----------------------------------------------------------
    //the API allows one review per student per course, so seeded data that
    //breaks that rule could never have been produced through the app
    const reviewPairs = new Set();

    for (const review of reviews) {
        const course = courses.find((entry) => id(entry) === id(review.course));

        if(!course) {
            fail(`a review references missing course ${id(review.course)}`);
            continue;
        }

        if(!(course.ratingAndReviews ?? []).map(id).includes(id(review))) {
            fail(`a review of "${course.courseName}" is missing from the course's own list`);
        }

        //a review from someone who never bought the course reads as fake
        if(!(course.studentsEnrolled ?? []).map(id).includes(id(review.user))) {
            fail(`"${course.courseName}" has a review from a student who is not enrolled`);
        }

        const pair = `${id(review.user)}:${id(review.course)}`;
        if(reviewPairs.has(pair)) {
            fail(`"${course.courseName}" has more than one review from the same student`);
        }
        reviewPairs.add(pair);

        if(review.rating < 1 || review.rating > 5) {
            fail(`a review of "${course.courseName}" has an out-of-range rating ${review.rating}`);
        }
    }

    //--- progress ----------------------------------------------------------
    for (const doc of progress) {
        const course = courses.find((entry) => id(entry) === id(doc.courseID));

        if(!course) {
            fail(`progress references missing course ${id(doc.courseID)}`);
            continue;
        }

        //progress on a course the student never bought would show up on a
        //dashboard they cannot open
        if(!(course.studentsEnrolled ?? []).map(id).includes(id(doc.userId))) {
            fail(`progress exists on "${course.courseName}" for a student who is not enrolled`);
        }

        const lecturesInCourse = new Set(
            sections
                .filter((section) => (course.courseContent ?? []).map(id).includes(id(section)))
                .flatMap((section) => (section.subSection ?? []).map(id))
        );

        for (const watched of doc.completedVideos ?? []) {
            if(!lecturesInCourse.has(id(watched))) {
                fail(`progress on "${course.courseName}" marks a lecture that is not in the course`);
            }
        }
    }

    //--- orders ------------------------------------------------------------
    for (const order of orders) {
        if(!userIds.has(id(order.user))) {
            fail(`order ${order.razorpayOrderId} references missing user`);
        }

        for (const courseId of order.courses ?? []) {
            if(!courseIds.has(id(courseId))) {
                fail(`order ${order.razorpayOrderId} references missing course ${id(courseId)}`);
            }
        }

        //the amount is in paise and must match what the courses actually cost
        const expected = (order.courses ?? []).reduce((total, courseId) => {
            const course = courses.find((entry) => id(entry) === id(courseId));
            return total + (course?.price ?? 0);
        }, 0) * 100;

        if(order.status === "Paid" && order.amount !== expected) {
            fail(`order ${order.razorpayOrderId} charges ${order.amount} but its courses cost ${expected} paise`);
        }

        //a failed order must never have granted access
        if(order.status === "Failed") {
            for (const courseId of order.courses ?? []) {
                const course = courses.find((entry) => id(entry) === id(courseId));
                if((course?.studentsEnrolled ?? []).map(id).includes(id(order.user))) {
                    fail(`failed order ${order.razorpayOrderId} still granted access to "${course.courseName}"`);
                }
            }
        }
    }

    return problems;
}

export default verify;
