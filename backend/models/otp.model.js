import mongoose, {mongo, Schema} from "mongoose";
import mailSender from "../utils/mailSender.js";
import otpTemplate from "../mail/templates/emailVerificationTemplate.js";

const otpSchema = new Schema({
    email : {
        type : String,
        required : true,
        trim : true
    },
    otp : {
        type : Number,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 10*60//Mongoose sets a TTL (Time To Live) index in MongoDB behind the scenes. MongoDB’s background process checks this index and deletes expired documents.
    }
})

const sendingVerificationEmail = async (email, otp) => {
    try {
        const emailResponse = await mailSender(email, "Verification Email from StudyNotion", otpTemplate(otp));
        console.log("Email sent Successfully", emailResponse);
    } catch (error) {
        console.log("Error while sending verification Email",error.message);
        throw error;
    }
}

otpSchema.pre("save", async function (next) {
    await sendingVerificationEmail(this.email, this.otp);
    next();
})


export const OTP = mongoose.model("OTP", otpSchema)