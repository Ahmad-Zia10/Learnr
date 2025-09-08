import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";

import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


//create section
const createSection = asyncHandler(async (req,res) => {
    const {sectionName : name, courseId} = req.body;

    if(!name || !courseId) {
        throw new apiError(401, "Section name is required");
    }

    const newSection = await Section.create({
        sectionName : name,
        subSection : []
    })

    if(!newSection) {
        throw new apiError(501, "Section could not be created")
    }
    //update course db with new section id

    const course = await Course.findByIdAndUpdate(
            {_id : courseId},
            {
                $push : {
                    courseContent : newSection._id
                }
            },
            {new:true}
        ).populate({
            path : "courseContent",
            populate : {
                path : "subSection"
            }
        })

    if(!course) {
        throw new apiError(401, "Course not found.")
    }

    return res
    .status(200)
    .json(new apiResponse(200, course, "Section created successfully"));

    
})

//update section
const updateSection = asyncHandler(async (req, res) => {
    const {sectionName, sectionId} = req.body;

    if(!sectionName && !sectionId) {
        throw new apiError(401, "Section name required. ")
    };

    const section = await Section.findByIdAndUpdate(
        {_id : sectionId},
        {
            sectionName
        },
        {new:true}
    );

    if(!section) {
        throw new apiError(402, "Failed to update section")
    }

    return res
    .status(200)
    .json(new apiResponse(200, section, "Section updated successfully"));
})

//delete section 

const deleteSection = asyncHandler(async (req,res) =>{
    const {courseId, sectionId} = req.params;

  const courseObjectId = new mongoose.Types.ObjectId(courseId);
  const sectionObjectId = new mongoose.Types.ObjectId(sectionId);

    // TODO : do we need to delete section id from course -courseContent?
    await Course.findByIdAndUpdate(
    courseObjectId, 
    { $pull: { courseContent: sectionObjectId } },
    { new: true }
  );

    await Section.findByIdAndDelete(sectionObjectId);
    return res
    .status(200)
    .json(new apiResponse(200, "Section deleted Succesfully."))
})


export {
    createSection,
    updateSection,
    deleteSection
}