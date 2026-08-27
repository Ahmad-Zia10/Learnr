import { Course } from "../models/course.model.js";
import { CourseProgess } from "../models/courseProgess.model.js";
import { SubSection } from "../models/subSection.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

//A student may only track progress on a course they are enrolled in.
const assertEnrolled = async (courseId, userId) => {
    const course = await Course.findById(courseId).select("studentsEnrolled courseContent");

    if(!course) {
        throw new apiError(404, "Course not found")
    }

    if(!course.studentsEnrolled.some((id) => id.equals(userId))) {
        throw new apiError(403, "You are not enrolled in this course")
    }

    return course;
}

//Mark one lecture as watched.
const markLectureComplete = asyncHandler(async (req,res) => {
    const { courseId, subSectionId } = req.body;
    const userId = req.user._id;

    if(!(courseId && subSectionId)) {
        throw new apiError(400, "Course id and sub section id are required")
    }

    await assertEnrolled(courseId, userId);

    const lecture = await SubSection.findById(subSectionId);

    if(!lecture) {
        throw new apiError(404, "Lecture not found")
    }

    //upsert so the first completed lecture creates the progress document,
    //and $addToSet keeps a repeated click from duplicating the entry
    const progress = await CourseProgess.findOneAndUpdate(
        { courseID : courseId, userId },
        { $addToSet : { completedVideos : subSectionId } },
        { new : true, upsert : true, setDefaultsOnInsert : true }
    );

    return res
    .status(200)
    .json(new apiResponse(200, progress, "Lecture marked as completed"))
})

//Undo a completed lecture.
const markLectureIncomplete = asyncHandler(async (req,res) => {
    const { courseId, subSectionId } = req.body;
    const userId = req.user._id;

    if(!(courseId && subSectionId)) {
        throw new apiError(400, "Course id and sub section id are required")
    }

    await assertEnrolled(courseId, userId);

    const progress = await CourseProgess.findOneAndUpdate(
        { courseID : courseId, userId },
        { $pull : { completedVideos : subSectionId } },
        { new : true }
    );

    if(!progress) {
        throw new apiError(404, "No progress recorded for this course")
    }

    return res
    .status(200)
    .json(new apiResponse(200, progress, "Lecture marked as incomplete"))
})

//Mark every lecture of a course as watched, for the dashboard shortcut.
const markCourseComplete = asyncHandler(async (req,res) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    if(!courseId) {
        throw new apiError(400, "Course id is required")
    }

    const course = await assertEnrolled(courseId, userId);

    //collect every lecture across the course's sections
    const populated = await Course.findById(course._id).populate({
        path : "courseContent",
        populate : { path : "subSection", select : "_id" }
    });

    const allLectureIds = (populated.courseContent ?? []).flatMap(
        (section) => (section.subSection ?? []).map((lecture) => lecture._id)
    );

    const progress = await CourseProgess.findOneAndUpdate(
        { courseID : courseId, userId },
        { $set : { completedVideos : allLectureIds } },
        { new : true, upsert : true, setDefaultsOnInsert : true }
    );

    return res
    .status(200)
    .json(new apiResponse(200, progress, "Course marked as completed"))
})

//Progress for a single course, used by the course viewer.
const getCourseProgress = asyncHandler(async (req,res) => {
    const courseId = req.query.courseId;
    const userId = req.user._id;

    if(!courseId) {
        throw new apiError(400, "Course id is required")
    }

    await assertEnrolled(courseId, userId);

    const progress = await CourseProgess.findOne({ courseID : courseId, userId });

    return res
    .status(200)
    .json(new apiResponse(
        200,
        { completedVideos : progress?.completedVideos ?? [] },
        "Course progress fetched successfully"
    ))
})

export {
    markLectureComplete,
    markLectureIncomplete,
    markCourseComplete,
    getCourseProgress
}
