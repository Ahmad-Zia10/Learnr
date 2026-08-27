import mongoose,{Schema} from "mongoose";


const courseProgessSchema = new Schema({

    courseID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true,
    },
    //progress belongs to one student on one course
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    completedVideos: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }
    ]

},
{timestamps : true});

//one progress document per student per course
courseProgessSchema.index({ courseID: 1, userId: 1 }, { unique: true });

export const CourseProgess = mongoose.model("CourseProgress", courseProgessSchema)
