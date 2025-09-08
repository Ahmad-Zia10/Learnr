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
    // try {
    //     const updateCourseProgress = await CourseProgess.updateMany()
    // } catch (error) {
        
    // }
    

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

    const userDetails = await User.findById({_id : userId}).populate("courses");

    if(!userDetails) {
        throw new apiError(400, "User does not exists")
    }

    const courseEnrolled = userDetails.courses;

    if(!courseEnrolled) {
        throw new apiError(404, "Courses Enrolled not found")
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        courseEnrolled,
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