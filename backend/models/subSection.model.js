import mongoose, {Schema} from "mongoose";


const subSectionSchema = new Schema({
    
    title : {
        type : String,
        requires : true
    },
    description : {
        type : String,
        required : true
    },
    timeDuration : {
        type : String
    },
    video: {
        type : String
    },
    videoId : {
        type : String
    }
    
});

export const SubSection = mongoose.model("SubSection", subSectionSchema);