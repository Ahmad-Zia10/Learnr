import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import crypto from "crypto"
import mailSender from "../utils/mailSender.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


 
//reset password token
 const resetPasswordToken = asyncHandler(async (req, res) => {
    //get email from request body
    //check validity of user
    //generate token for user 
    //update user by adding token and expiryTime
    //create url
    //send mail containing the url 
    //return response

    const {email} = req.body;

    if(!email) {
        throw new apiError(402, "Email is required")
    }

    const user = await User.findOne({email});

    if(!user) {
        throw new apiError(401, "User woth given email does not exist!")
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.token = token;
    user.resetPasswordExpiresAt = Date.now() + 5*60*1000;//expires in 5mins from the current time.
    await user.save({validateBeforeSave : false});


    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
        email,
        "Password Reset Link",
        `Click here to reset the password ${url}`
    );

    return res
    .status(200)
    .json(new apiResponse(200, "Password Reset link sent to email."));
 })

//reset password
const resetPassword = asyncHandler(async (req,res) => {
    //fetch data from request body
    //validate
    //get user details from db using token
    //token time check
    //hash pwd
    //password update
    //return response

    const {newPassword, confirmPassword, token} = req.body;  //token is put into request body by frontend.We provide url of reset password, inside url there was "token" as parameter.

    if(!(newPassword && confirmPassword)) {
        throw new apiError(401, "Passwords are required")
    }

    if(newPassword !== confirmPassword) {
        throw new apiError(401, "New and confirm Passwords must be same")
    }

    const user = await User.findOne({token});

    if(!user) {
        throw new apiError(401, "User could not be fetched from Database.")
    }

    if(user.resetPasswordExpiresAt < Date.now()) {
        throw new apiError(402, "Reset password link has expired.")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new apiResponse(
        200, "Password has been updated Successfully!!"
    ))    
})

export {
    resetPassword,
    resetPasswordToken
}