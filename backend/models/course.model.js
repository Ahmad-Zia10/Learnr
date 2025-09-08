import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    courseName : {
        type : String,
        trim : true,
        required : true
    },
    courseDescription : {
        type : String,
        required : true

    },
    instructor : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    whatYouWillLearn : {
        type : String,
        required : true
    },
    courseContent : [
        {
            type : Schema.Types.ObjectId,
            ref : "Section"
        }
    ],
    ratingAndReviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "RatingAndReviews"
        }
    ],
    price : {
        type : Number
    },
    thumbnail : {
        type : String
    },
    category : {
        type : String
    },
    category : {
        type : Schema.Types.ObjectId,
        ref : "Category"
    },
    instructions : {
        type : String,
    },
    status : {
        type : String,
        enum : ["Draft","Published"]
    },
    studentsEnrolled : [
        {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    ]
});

export const Course = mongoose.model("Course", courseSchema)