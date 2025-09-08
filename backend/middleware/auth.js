//auth

import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const verifyJwt = asyncHandler(async (req, __, next) => {

        const token = req.cookies.accessToken || req.body.accessToken || req.header("Authorization")?.replace("Bearer ","");

        if(!token) {
            throw new apiError(401, "Unauthorized");
        }


        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decodedToken._id).select("-password -refreshToken");

            if(!user) {
                throw new apiError(402, "Unauthorized");
            }

            req.user = user;

            next();
        } catch (error) {
            throw new apiError(401, error?.message || "Invalid Access Token");
        }

})

//isStudent
const isStudent = asyncHandler( async (req, res, next) => {
    const role = req.user.accountType;

    if(role !== "Student"){
        return new apiError(403, "This is a protected route for Students only.");
    }
    next();
})

//isInstructor
const isInstructor = asyncHandler( async (req, res, next) => {
    const role = req.user.accountType;

    if(role !== "Instructor"){
        return new apiError(403, "This is a protected route for Instructor only.");
    }
    next();
})

//isAdmin
const isAdmin = asyncHandler( async (req, res, next) => {
    const role = req.user.accountType;

    if(role !== "Admin"){
        return new apiError(403, "This is a protected route for Admin only.");
    }
    next();
})


export {
    verifyJwt,
    isStudent,
    isAdmin,
    isInstructor
}