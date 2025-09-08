import mongoose,{Schema} from "mongoose";


const courseProgessSchema = new Schema({
    
    courseID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    completedVideos: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }
    ]

});

export const CourseProgess = mongoose.model("CourseProgess", courseProgessSchema)