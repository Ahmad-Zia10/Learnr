import { Category } from "../../models/category.model.js";
import { Course } from "../../models/course.model.js";
import { Section } from "../../models/section.model.js";
import { SubSection } from "../../models/subSection.model.js";
import { User } from "../../models/user.model.js";
import { CATEGORIES, COURSES, VIDEOS } from "../data/catalog.js";

//Lecture lengths look arbitrary but must be stable between runs, so the
//accordion's totals do not change every time the seed is run. A small
//deterministic hash of the title gives variety without randomness.
const durationFor = (title, index) => {
    const hash = [...title].reduce((total, char) => total + char.charCodeAt(0), 0);
    const seconds = 210 + ((hash + index * 37) % 900);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

//Rotate through the clips so consecutive lectures never show the same footage.
let videoCursor = 0;
const nextVideo = () => VIDEOS[videoCursor++ % VIDEOS.length];

//A lecture description reads under the video in the course viewer.
const describe = (title, courseName) =>
    `${title} - part of ${courseName}. Watch this lecture, then try the exercise linked in the resources before moving on.`;

const run = async ({ instructors }) => {
    //--- categories ---------------------------------------------------------
    const categories = {};

    for (const entry of CATEGORIES) {
        categories[entry.key] = await Category.create({
            name : entry.name,
            description : entry.description,
            courses : []
        });
    }

    //--- courses ------------------------------------------------------------
    const courses = {};
    let lectureCount = 0;
    let sectionCount = 0;

    for (const entry of COURSES) {
        const category = categories[entry.category];
        const instructor = instructors[entry.instructor];

        if(!category) throw new Error(`course "${entry.courseName}" names unknown category "${entry.category}"`);
        if(!instructor) throw new Error(`course "${entry.courseName}" names unknown instructor "${entry.instructor}"`);

        //build the content tree first, so the course is never saved pointing at
        //sections that do not exist yet
        const sectionIds = [];

        for (const sectionSpec of entry.sections) {
            const lectureIds = [];

            for (const [index, title] of sectionSpec.lectures.entries()) {
                const lecture = await SubSection.create({
                    title,
                    description : describe(title, entry.courseName),
                    timeDuration : durationFor(title, index),
                    video : nextVideo(),
                    //seeded lectures have no Cloudinary asset behind them, so
                    //there is no public id to delete
                    videoId : ""
                });

                lectureIds.push(lecture._id);
                lectureCount++;
            }

            const section = await Section.create({
                sectionName : sectionSpec.name,
                subSection : lectureIds
            });

            sectionIds.push(section._id);
            sectionCount++;
        }

        const course = await Course.create({
            courseName : entry.courseName,
            courseDescription : entry.courseDescription,
            instructor : instructor._id,
            whatYouWillLearn : entry.whatYouWillLearn,
            courseContent : sectionIds,
            ratingAndReviews : [],
            price : entry.price,
            thumbnail : entry.thumbnail,
            category : category._id,
            tag : entry.tag,
            instructions : entry.instructions,
            //most courses are live; a couple stay drafted so the instructor
            //dashboard has both states to show
            status : entry.status === "Draft" ? "Draft" : "Published",
            studentsEnrolled : []
        });

        courses[entry.key] = course;

        //both halves of the course<->category relation, or the course becomes
        //invisible to the catalog
        await Category.findByIdAndUpdate(category._id, {
            $addToSet : { courses : course._id }
        });

        //and the instructor's own list, which My Courses reads
        await User.findByIdAndUpdate(instructor._id, {
            $addToSet : { courses : course._id }
        });
    }

    const published = Object.values(courses).filter((course) => course.status === "Published").length;

    console.log(`  ${Object.keys(categories).length} categories`);
    console.log(`  ${Object.keys(courses).length} courses (${published} published, ${Object.keys(courses).length - published} draft)`);
    console.log(`  ${sectionCount} sections, ${lectureCount} lectures`);

    return { categories, courses };
}

export default { title : "Catalog", run };
