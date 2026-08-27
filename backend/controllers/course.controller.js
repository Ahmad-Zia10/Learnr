import { Category } from "../models/category.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { CourseProgess } from "../models/courseProgess.model.js";


//createCourse
const createCourse = asyncHandler(async (req, res) => {
    //extract details
    const {courseName:title, courseDescription : description, price, category, whatYouWillLearn : benefits} = req.body

    //extract files
    const thumbnail = req.files?.thumbnailImage?.[0].path;

    //validation
    if(!(title && description && price && category && benefits && thumbnail)) {
        throw new apiError(401, "All fields are required")
    }

    //Getting the instructor
    const instructorId = req.user._id;

    const instructor = await User.findById(instructorId);

    if(!instructor) {
        throw new apiError(401, "User does not exist!")
    }

    //check given tags are valid or not. 
    const categoryDetails = await Category.findById(category);

    if(!categoryDetails) {
        throw new apiError(401, "Tags not found")
    }

    //upload to cloudinary 
    let thumbnailImage;

    try {
        thumbnailImage = await uploadToCloudinary(thumbnail);
    } catch (error) {
        throw new apiError(500, "Failed to upload thumbnail Image")
    }

    //create entry for new course
    const newCourse = await Course.create({
        courseName : title,
        courseDescription : description,
        instructor : instructor._id,
        whatYouWillLearn : benefits,
        price,
        category : categoryDetails._id,
        thumbnail : thumbnailImage.secure_url
    })

    //add new course to user schema of instructor
    const updatedUser = await User.findByIdAndUpdate(
        {_id : instructor._id},
        {
            $push : {
                courses : newCourse._id
            }
        },
        {new : true}
    )

    if(!updatedUser) {
        throw new apiError(500, "user Schema could not be updated")
    }

    //update tag schema
    const updatedcategory = await Category.findByIdAndUpdate(
        {_id : categoryDetails._id},
        {
            $push : {
                courses : newCourse._id 
            }
        }
    )

    if(!updatedcategory) {
        throw new apiError(500, "Category schema could not be updated")
    }

    console.log("Updated User" ,updatedUser)
    console.log("Updated User" ,updatedcategory)

    return res
    .status(200)
    .json(new apiResponse(200, newCourse, "Course created successfully."))

})

//get all courses
const getAllCourses = asyncHandler(async (req, res) => {    
    const allCourses = await Course.find().select("-studentsEnrolled")

    return res
    .status(200)
    .json(new apiResponse(200, allCourses, "All Courses fetched succesfully"));
})

//get specific course by course Id
const getCourse = asyncHandler( async (req,res) => {
    //GET requests carry no body, so the id arrives as a query param
    const courseId = req.query.courseId || req.body?.courseId;

    //validate
    if(!courseId){
        throw new apiError(400, "Course Id is required")
    }

    const courseDetails = await Course.findById({_id:courseId}).select("-studentsEnrolled").populate([
            {
                path : "instructor",
                populate : {
                    path : "additionalDetails"
                }
            },
            {
                path : "courseContent",
                //this endpoint is public, so never expose the video URLs here
                populate : {
                    path : "subSection",
                    select : "-video -videoId"
                }
            },
            {
                path : "ratingAndReviews"
            },
            {
                path : "category"
            }
        ])

    if(!courseDetails) {
        throw new apiError(400, "Course not Found");
    }   

    console.log("Course Details fetched successfully", courseDetails)

    return res
    .status(200)
    .json(new apiResponse(
        200,
        courseDetails,
        "Course Details fetched successfully."
    ))

})

//Full course content, including video URLs. Only for a student who owns the
//course (or the instructor who wrote it).
const getFullCourseDetails = asyncHandler( async (req,res) => {
    const courseId = req.query.courseId || req.body?.courseId;
    const userId = req.user._id;

    if(!courseId){
        throw new apiError(400, "Course Id is required")
    }

    const course = await Course.findById(courseId).populate([
        {
            path : "instructor",
            populate : { path : "additionalDetails" }
        },
        {
            path : "courseContent",
            populate : { path : "subSection" }
        },
        {
            path : "category"
        }
    ])

    if(!course) {
        throw new apiError(404, "Course not Found");
    }

    const isEnrolled = course.studentsEnrolled.some((id) => id.equals(userId));
    const isInstructor = course.instructor?._id?.equals(userId);

    if(!isEnrolled && !isInstructor) {
        throw new apiError(403, "Enrol in this course to watch its lectures")
    }

    const progress = await CourseProgess.findOne({ courseID : courseId, userId });

    const courseData = course.toObject();
    delete courseData.studentsEnrolled;

    return res
    .status(200)
    .json(new apiResponse(
        200,
        {
            course : courseData,
            completedVideos : progress?.completedVideos ?? []
        },
        "Course content fetched successfully."
    ))
})

export {
    createCourse,
    getAllCourses,
    getCourse,
    getFullCourseDetails
}