import { Course } from "../../models/course.model.js";
import { RatingAndReview } from "../../models/ratingAndReview.model.js";
import { User } from "../../models/user.model.js";
import { REVIEWS } from "../data/reviews.js";

//A review from someone who never bought the course is exactly what the API
//refuses to create, so the seed must not fabricate one either. Enrolling the
//reviewer here also gives the catalog realistic enrolment counts, which is what
//the "Most popular" sort reads.
const enrol = async (course, student) => {
    //$addToSet on both sides, matching what fulfilOrder does, so re-running
    //cannot double-enrol anyone
    await Course.findByIdAndUpdate(course._id, {
        $addToSet : { studentsEnrolled : student._id }
    });
    await User.findByIdAndUpdate(student._id, {
        $addToSet : { courses : course._id }
    });
}

const run = async ({ courses, students }) => {
    let reviewCount = 0;
    let enrolmentCount = 0;
    let ratingTotal = 0;

    for (const [courseKey, entries] of Object.entries(REVIEWS)) {
        const course = courses[courseKey];

        if(!course) {
            throw new Error(`reviews reference unknown course "${courseKey}"`);
        }

        for (const entry of entries) {
            const student = students[entry.student];

            if(!student) {
                throw new Error(`review of "${courseKey}" names unknown student "${entry.student}"`);
            }

            await enrol(course, student);
            enrolmentCount++;

            const created = await RatingAndReview.create({
                rating : entry.rating,
                review : entry.review,
                user : student._id,
                course : course._id
            });

            //the course keeps its own list, which is what CourseCard averages
            await Course.findByIdAndUpdate(course._id, {
                $addToSet : { ratingAndReviews : created._id }
            });

            reviewCount++;
            ratingTotal += entry.rating;
        }
    }

    const average = reviewCount ? (ratingTotal / reviewCount).toFixed(2) : "0";
    const reviewed = Object.keys(REVIEWS).length;

    console.log(`  ${reviewCount} reviews across ${reviewed} courses (average ${average})`);
    console.log(`  ${enrolmentCount} enrolments created by reviewers`);

    return {};
}

export default { title : "Reviews", run };
