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
            ref : "RatingAndReview"
        }
    ],
    price : {
        type : Number
    },
    thumbnail : {
        type : String
    },
    category : {
        type : Schema.Types.ObjectId,
        ref : "Category"
    },
    //free-form tags shown on the course information form
    tag : {
        type : [String],
        default : []
    },
    instructions : {
        type : [String],
        default : []
    },
    status : {
        type : String,
        enum : ["Draft","Published"],
        default : "Draft"
    },
    studentsEnrolled : [
        {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    ]
},
//the course detail page prints the creation date, and the catalog's "New" tab
//sorts on it
{timestamps : true});

export const Course = mongoose.model("Course", courseSchema)