import { Course } from "../models/course.model.js";
import { CourseProgess } from "../models/courseProgess.model.js";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";


//update Profile
const updateProfile = asyncHandler(async (req,res) => {
    //extract details
    const {gender  ,dateOfBirth, about , contactNumber} = req.body;
    
    //find user from req.usr as user is already logged In
    const user = req.user;

    if(!user) {
        throw new apiError(400, "User not valid")
    }
    //checking which the details are to be updated
    const updateProfileDetails = {}

    if(gender) updateProfileDetails.gender = gender
    if(dateOfBirth) updateProfileDetails.dateOfBirth = dateOfBirth
    if(contactNumber) updateProfileDetails.contactNumber = contactNumber
    if(about) updateProfileDetails.about = about

    //updating profile schema. We will find profile id inside user.additionalDetails
    const updatedProfile = await Profile.findByIdAndUpdate(
        {_id : user.additionalDetails},
        updateProfileDetails,
        {new:true}
    );

    if(!updatedProfile) {
        throw new apiError(500, "Could not update Profile")
    }

    user.additionalDetails = updatedProfile._id
    await user.save({validateBeforeSave : false});

    return res
    .status(200)
    .json(new apiResponse(200, updatedProfile, "Profile updated Successfully"))

    
})

//deleteAccount
const deleteAccount = asyncHandler(async (req, res) => {
    //get user 
    const user = req.user;
     if(!user) {
        throw new apiError(400, "User not valid")
    }
    //delete profile
    try {
        await Profile.findByIdAndDelete({_id : user.additionalDetails});
    } catch (error) {
         console.error("Error deleting profile:", error);
        throw new apiError(500, "Profile could not be deleted");
    }

    //un-enroll user from all enrolled courses
    //fetch all courses having this users id in studentEnrolled

    try {
        const unenrollUser = await Course.updateMany(
            {studentsEnrolled : user._id},
            {
                $pull : {
                    studentsEnrolled : user._id
                }
            }
        )
        console.log("Unerolled student succesfully", unenrollUser);

    } catch (error) {
        console.log("User could not be unenrolled from courses",error.message);
        throw new apiError(500, "Failed to uneroll user from the courses")
    }

    //delete course progress
    try {
        await CourseProgess.deleteMany({ userId : user._id });
    } catch (error) {
        console.log("Course progress could not be deleted", error.message);
        throw new apiError(500, "Failed to delete course progress")
    }
    

    //delete user 
    try {
        await User.findByIdAndDelete({_id : user._id});
    } catch (error) {
         console.error("Error deleting Accoutn:", error);
        throw new apiError(500, "User could not be deleted")
    }
    
    return res
    .status(200)
    .json(new apiResponse(200, "Account deleted succesfully!"))
})

//get all user details 
const getUserDetails = asyncHandler(async (req, res) => {
    const user = req.user;

    if(!user) {
        throw new apiError(400, "User could not be fetched")
    }

    const userDetails = await User.findById({_id : user._id}).populate("additionalDetails").select("-password -refreshToken");

    if(!userDetails) {
        throw new apiError(500,"user details could not be fetched")
    }

    return res
    .status(200)
    .json(new apiResponse(200, userDetails, "User details fetched succesfully"));

})

const getEnrolledCourses = asyncHandler(async (req,res) => {

    const userId = req.user?._id;

    if(!userId) {
        throw new apiError(401, "Unathouraized Request")
    }

    //courseContent is needed to count the lectures each course contains
    const userDetails = await User.findById({_id : userId}).populate({
        path : "courses",
        populate : {
            path : "courseContent",
            populate : { path : "subSection", select : "_id timeDuration" }
        }
    });

    if(!userDetails) {
        throw new apiError(400, "User does not exists")
    }

    const courseEnrolled = userDetails.courses ?? [];

    //one lookup for every course, rather than one query per course
    const progressDocs = await CourseProgess.find({
        userId,
        courseID : { $in : courseEnrolled.map((course) => course._id) }
    });

    const completedByCourse = new Map(
        progressDocs.map((doc) => [String(doc.courseID), doc.completedVideos.length])
    );

    const coursesWithProgress = courseEnrolled.map((course) => {
        const totalLectures = (course.courseContent ?? []).reduce(
            (total, section) => total + (section.subSection?.length ?? 0),
            0
        );

        const completed = completedByCourse.get(String(course._id)) ?? 0;

        //a course with no lectures yet is 0% rather than a division by zero
        const progressPercentage = totalLectures
            ? Math.round((completed / totalLectures) * 100)
            : 0;

        return {
            ...course.toObject(),
            totalLectures,
            completedLectures : completed,
            progressPercentage
        };
    });

    return res
    .status(200)
    .json(new apiResponse(
        200,
        coursesWithProgress,
        "Courses enrolled fetched successfully"
    ))

})

const updateDisplayImage  = asyncHandler(async (req,res) => {

    const imagePath = req.files?.displayPicture?.[0].path;

    console.log("req.files is",req.files);
    console.log("req.files.displayPicture is",req.files?.displayPicture);
    
    const user = req.user

    if(!imagePath) {
        throw new apiError(400, "Image is required")
    }

    console.log("imagePath", imagePath);

    const uploadedImage = await uploadToCloudinary(imagePath);

    if(!uploadedImage) {
        throw new apiError(500, "Image could not be uploaded to cloudinary")
    }

    const updatedProfile = await User.findByIdAndUpdate(
        {_id : user._id},
        {
            image : uploadedImage.secure_url
        },
        {new : true}
    )

    return res
    .status(200)
    .json(new apiResponse(
        200,
        updatedProfile,
        "Profile Picture updated successfully"
    ))

})

export {
    updateProfile,
    deleteAccount,
    getUserDetails,
    getEnrolledCourses,
    updateDisplayImage
}