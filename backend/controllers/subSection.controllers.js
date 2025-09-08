import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";

//create Subsection
const createSubSection = asyncHandler(async (req, res) => {
    //extract details from req body
    console.log("Inside handler function");
    const {title, description, sectionId, timeDuration} = req.body;


    // const sectionId = req.params; This is more appropriate

    //validate
    if(!(title && description && sectionId && timeDuration)) {
        throw new apiError(400, "All fields are required");
    }
    //extract video path from request file
    const videoPath = req.files?.lectureVideo?.[0].path;
    //validate file
    if(!videoPath) {
        throw new apiError(400, "upload Lecture Video")
    }

    //upload to cloudinary
    let videoURL;

    const uploadedVideo = await uploadToCloudinary(videoPath);
    if(!uploadedVideo) {
        throw new apiError(401, "Failed to upload to cloudinary");
    }

    videoURL = uploadedVideo.secure_url;
    let videoId = uploadedVideo.public_id;


    //create document of subSection
    const newSubSection = await SubSection.create({
        title,
        description,
        timeDuration ,
        video : videoURL,
        videoId
    })

    if(!newSubSection) {
        throw new apiError(500, "Failed to create subSection");
    }
    
    //update subSection in Section docs
    const updateSection = await Section.findByIdAndUpdate(
        {_id : sectionId},
        {
            $push : {
                subSection : newSubSection._id
            }
        },
        {new : true}
    ).populate("subSection");   

    console.log("Section with populated subSection :" ,updateSection)

    return res
    .status(200)
    .json(new apiResponse(200,newSubSection,"Sub Section created successfully"));
    
})

//update SubSection
const updateSubSection = asyncHandler(async (req,res) => {
    //extract details
    const {title, description, subSectionId, timeDuration} = req.body;
    
    if(!subSectionId) {
        throw new apiError(400, "Sub Section id required");
    }

    //check if a new video is uploaded;
    const newVideoPath = req.files?.lectureVideo?.[0].path;
    
    //get current SubSection
    const  subSection = await SubSection.findById(subSectionId);

    if(!subSection) {
        throw new apiError(400, "SubSection with current Id does not exist!")
    }
    
    let newVideo;
    if(newVideoPath) {
    //first delete old video
    try {
        await deleteFromCloudinary(subSection.videoId);
    } catch (error) {
        console.log("Failed to delete old video", error.message)
        throw new apiError(500,"Failed to delete existing video")
    }

    //upload new video
    try {
        newVideo = await uploadToCloudinary(newVideoPath);
    } catch (error) {
        console.log("Failed to upload updated Lecture to cloudinary", error.message);
        throw new apiError(500,"Failed to upload new lecture tp cloudinary");
    }
    }
    
    console.log("new video file ", newVideo);
    
    //check which fields have to be updated
    
    if(title) subSection.title = title;
    if(description) subSection.description = description;
    if(newVideo) subSection.timeDuration = timeDuration;
    if(newVideo) subSection.video = newVideo.secure_url;
    if(newVideo) subSection.videoId = newVideo.public_id;

    await subSection.save();

    return res
    .status(200)
    .json(new apiResponse(200, updateSubSection,"Sub Section Updated successfully"));


})

//delete subSection
const deleteSubSection = asyncHandler( async (req, res) => {
    const {subSectionId} = req.body;

    if(!subSectionId) {
        throw new apiError(400, "Sub Section Id is required");
    }

    try {
         await SubSection.deleteOne({_id : subSectionId});
    } catch (error) {
        console.log("Failed to delete subSection");
        throw new apiError(500, "Sub Section could not be deleted")
    }

    return res
    .status(200)
    .json(new apiResponse(200,"Sub Section Deleted successfully"))

})

export {
    createSubSection,
    updateSubSection,
    deleteSubSection
}