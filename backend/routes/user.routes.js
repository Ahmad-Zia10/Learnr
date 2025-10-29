import { Router } from "express";
import {verifyJwt} from "../middleware/auth.js"
import { upload } from "../middleware/multer.middleware.js";

import {
    loginUser,
    signUp,
    sendOTP,
    changePassword 
} 
from "../controllers/auth.controller.js";

const router = Router();

//user routes
router.route("/signup").post(signUp);//passes the function as a reference to Express so it can call it later when a request arrives. Whenever a user hits this api endpoint, express automatically calls signup with (req,res,next) parameters.
router.route("/login").post(loginUser);
router.route("/sendOTP").post(sendOTP);


//secure routes
router.route("changePassword").post(verifyJwt,changePassword);

//reset password
import { resetPasswordToken, resetPassword } from "../controllers/resetPassword.controller.js"

router.route("/reset-password-token").post(resetPasswordToken);
router.route("/reset-password").post(resetPassword);

export default router



