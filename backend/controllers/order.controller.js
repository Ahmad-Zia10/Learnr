import { Order } from "../models/order.model.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

//Every paid order belonging to the signed-in student, newest first.
const getPurchaseHistory = asyncHandler( async (req,res) => {
    const orders = await Order.find({ user : req.user._id, status : "Paid" })
        .populate({
            path : "courses",
            select : "courseName thumbnail price instructor",
            populate : {
                path : "instructor",
                select : "firstName lastName"
            }
        })
        .sort({ createdAt : -1 });

    return res
    .status(200)
    .json(new apiResponse(200, orders, "Purchase history fetched successfully."))
})

export {
    getPurchaseHistory
}
