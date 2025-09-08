import mongoose, { Schema } from "mongoose";
import { Course } from "../models/course.model.js";
import { RatingAndReview } from "../models/ratingAndReview.model.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";


const createRatingAndReview = asyncHandler( async (req,res) => {x
    //get details
    const {courseId, review, rating} = req.body;

    const user = req.user
    //validate 
    if(!(courseId && review && rating)) {
        throw new apiError(400, "All fields are required")
    }

    //check if user is enrolled in that course
    const isEnrolled = await Course.aggregate([
        {
            $match : {
                _id : courseId,
                studentsEnrolled : new Schema.Types.ObjectId(user._id)
            }
        }
    ])

    if(!isEnrolled) {
        throw new apiError(403,"Student should first enroll to rate this course!")
    }

    //check if user already reviewed the course
    const hasReviewed = await RatingAndReview.findOne({
                                                user:user._id,
                                                course:courseId,
                                            });

    if(hasReviewed) {
        throw new apiError(409,"User also already reviewd this course")
    }

    //create Rating and Review
    const createdRating = await RatingAndReview.create({
        rating,
        review,
        user : user._id,
        course : courseId
    })

    if(!createdRating) {
        throw new apiError(500, "Rating could not be created")
    }

    const updateCourse = await Course.findByIdAndUpdate(
        {_id : courseId},
        {
            $push : {
                ratingAndReviews : createdRating._id
            }
        },
        {new : true});

    return res
    .status(200)
    .json(new apiResponse(
        201,
        createdRating,
        "Rating Done successfully"
    ))
})

const getAverageRating = asyncHandler(async (req,res) => {
    //get details
    const {courseId} = req.body;

    if(!courseId) {
        throw new apiError(400,"Course Id is required");
    }

    //get average rating
    const result = await RatingAndReview.aggregate([
        {
            $match : {
                course : new Schema.Types.ObjectId(courseId)
            }
        },
        {
            $group : {
                _id : null,
                averageRating : {
                    $avg : "$rating"
                }
            }
        }
    ]);

    if(result.lenght === 0){
        console.log("No ratings found for this course");
    }

    return res
    .status(200)
    .json(new apiResponse(
        201,
        {averageRating : result?.[0].averageRating},
        "Average Rating fetched successfully"
    ))
})

const getAllRatings = asyncHandler(async (req,res) => {
    
    const allRatings = await RatingAndReview.find({})
    .populate(
        {
            path : "user",
            select : "firstName lastName image email"
        },
        {
            path : "course",
            select : "courseName"   
        }
    );

    if(allRatings?.length === 0){
        console.log("No ratings found")
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        {allRatings},
        "All Ratings and Reviews Fethced succesfully"
    ))
})

export {
    createRatingAndReview,
    getAllRatings,
    getAverageRating,
}