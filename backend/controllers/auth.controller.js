import otpGenerator  from "otp-generator";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import mailSender from "../utils/mailSender.js";
import { OTP } from "../models/otp.model.js";
import apiResponse from "../utils/apiResponse.js";
import { Profile } from "../models/profile.model.js";
import passwordUpdated from "../mail/templates/passwordUpdate.js";
import jwt from "jsonwebtoken"



//Generate refresh and access tokens
const generateAccessAndRefreshTokens = async (userId) => {

    try {
        const user = await User.findById(userId);

        if(!user) {
            throw new apiError(401, "User could not be fetched from database");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});

        return {accessToken, refreshToken};
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating access and refresh tokens");
    }
    

}

//send OTP
const sendOTP = asyncHandler(async (req,res) => {
    const {email} = req.body;

    if(!email) {
        throw new apiError(400, "Incomplete Credentials");
    }

    //check if user already exists
    const existingUser = await User.findOne({email});

    if(existingUser) {
        throw new apiError(409, "User with email already exists") //the server cannot fulfill request because it would break uniqueness, state consistency, or a business rule. used when : Booking a seat in a cinema that’s already taken.
    }

    //generate OTP

    let otp = otpGenerator.generate(6,{
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    })

    //check unique otp or not 

    let result = await OTP.findOne({otp});

    while(result) {
        otp = otpGenerator.generate(6,{
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });
        result = await OTP.findOne({otp});
    }

    //entry of otp into database
    try {
        const otpBody = await OTP.create({
            email,
            otp,
        });

        return res
        .status(200)
        .json(new apiResponse(200, { email }, "OTP sent successfully"));
    } catch (error) {
        //the document is saved by a hook that also sends the verification
        //email, so distinguish the two rather than always blaming the database
        console.log("Could not issue OTP:", error.message);

        if(error.code === "EAUTH" || error.code === "ECONNECTION" || error.responseCode) {
            throw new apiError(502, "Could not send the verification email. Please try again shortly.")
        }

        throw new apiError(500, "Something went wrong while creating OTP document inside database")
    }
})

//regenerate access Token 
const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.body.refreshToken || req.cookies.refreshToken

    if(!incomingRefreshToken) {
        throw new apiError(401,"User not authorized");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if(!user) {
            throw new apiError(401,"Invalid Refresh Token")
        }

        if(user?.refreshToken !== incomingRefreshToken) {
            throw new apiError(401,"Invalid Refresh Token")
        }

        const options = {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production"
        }

        const {accessToken, refreshToken : newRefreshToken} = await generateAccessAndRefreshTokens(user._id);

        return res
        .status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(new apiResponse(
            200,
            {
                accessToken,
                refreshToken : newRefreshToken
            },
            "Access Token refreshed successfully"
        ))
        
    } catch (error) {
        console.log("Could not refresh Access Token", error.message);
        throw new apiError(500,"Access token could not be refreshed")
    }
})

//signup
const signUp = asyncHandler(async (req,res)=> {
    
    //extract user details from request body

    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    } = req.body;

    //validate all fields
    if([firstName,lastName,email,password,confirmPassword,otp].some((field)=> String(field).trim() == "")) {
        throw new apiError(400, "Incomplete credentials.")
    };

    //check password and confirm password is same or not

    if(password !== confirmPassword) {
        throw new apiError(401, "Password and Confirm Password do not match");
    }

    //checking user already exists or not
    const existingUser = await User.findOne({email});

    if(existingUser) {
        throw new apiError(409, "User already exists!");
    }

    //find the most recent otp stored for the user
    const response = await OTP.find({email}).sort({createdAt : -1}).limit(1);

    if(response.length === 0) {
        throw new apiError(400, "Otp is not valid");
    }
    else if(otp != response[0].otp) {
        throw new apiError(400, "Otp is not valid");
    }

    //OTP is found correctly and mathced correctly.
    //Now create entry of user in database.

    //But first create profile details of user. Initially when user registers, the profile details will be empty

    const approved = accountType !== "Instructor";

    const profileDetails = await Profile.create({
        gender : null,
        dateOfBirth : null,
        about : null,
        contactNumber
    })

    try {
        const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        approved,
        accountType,
        additionalDetails : profileDetails?._id,
        image : `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`
    })

    const createdUser = await User.findById(user._id).select("-password -additionalDetails");

     return res
    .status(200)
    .json(new apiResponse(201, createdUser, "User Registered Successfully"))

    } catch (error) {

      //clean up the orphaned profile created above
      await Profile.findByIdAndDelete(profileDetails?._id).catch(() => {});

      console.log("Error while creating database document of user",error.message);
      throw new apiError(500, "User could not be created in database");

    }
})

//login
const loginUser = asyncHandler(async (req,res) => {
    //extract details from request body
    const {email, password} = req.body;
    //check if details are missing
    if(!(email&&password)) {
        throw new apiError(400, "Incmplete Credentials");
    }
    //validate user
    const user = await User.findOne({email});

    if(!user) {
        throw new apiError(404, "User with this email does not exist");
    }
    //if user exists, then proceed to password validation
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new apiError(401, "Password Incorrect");
    
    }

    //Generate access and refresh tokens
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
    if(!loggedInUser) {
        throw new apiError(500, "User could not be logged In");
    }

    const options = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production"
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(
        200,
        {user : loggedInUser, accessToken, refreshToken},
        "User logged in succesfully"
    ));


})

//changePassword
const changePassword = asyncHandler(async (req,res) => {
    //extract details
    const {oldPassword,newPassword, confirmNewPassword} = req.body;

    if(!(oldPassword && newPassword && confirmNewPassword)) {
        throw new apiError(401, "All fields are required");
    }

    //re-fetch with password field (req.user is stripped of password by verifyJwt)
    const user = await User.findById(req.user._id);

    if(!user) {
        throw new apiError(404, "User not found");
    }

    //validate old password
    if(!(await user.isPasswordCorrect(oldPassword))){
        throw new apiError(400, "Password is incorrect!")
    }

    //validate new Password
    if(newPassword != confirmNewPassword) {
        throw new apiError(401, "New password and confirm password should be same!");
    }

    //updating new password in database
    user.password = newPassword;
    await user.save({validateBeforeSave : false});

    //sending affirmation email
    try {
        await mailSender(
            user.email,
            "Study Notion Confirmation Mail: Password Updated Successfully",
            passwordUpdated(user.email, `${user.firstName} ${user.lastName}`)
        );
    } catch (error) {
        //the password has already been changed at this point, so a failed
        //courtesy email must not be reported to the user as a failure
        console.log("Could not send password confirmation email", error.message)
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        "Password Changed Successfully."
    ))

    
})




export {
    sendOTP,
    signUp,
    loginUser,
    changePassword,
    refreshAccessToken
}