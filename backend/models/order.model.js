import mongoose, {Schema} from "mongoose";

//One order per checkout, covering every course in the cart.
const orderSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    },
    courses : [
        {
            type : Schema.Types.ObjectId,
            ref : "Course",
            required : true
        }
    ],
    //amount is stored in paise, exactly as Razorpay reports it
    amount : {
        type : Number,
        required : true
    },
    currency : {
        type : String,
        default : "INR"
    },
    razorpayOrderId : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    razorpayPaymentId : {
        type : String
    },
    status : {
        type : String,
        enum : ["Created", "Paid", "Failed"],
        default : "Created"
    }
},
{timestamps : true});

export const Order = mongoose.model("Order", orderSchema)
