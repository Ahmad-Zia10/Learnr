import { Router } from "express";
import {

    updateDisplayImage,
    updateProfile,
    getEnrolledCourses,
    getUserDetails,
    deleteAccount

} from "../controllers/profile.controller.js";
import { isStudent, verifyJwt } from "../middleware/auth.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

//Profile routes
router.route("/update-profile").patch(verifyJwt, updateProfile)
router.route("/update-display-Image").patch(verifyJwt, upload.fields([{ name: "displayPicture", maxCount: 1 }]), updateDisplayImage)
router.route("/get-enrolled-courses").get(verifyJwt, getEnrolledCourses)
router.route("/get-user-details").get(verifyJwt, getUserDetails)
router.route("/delete-profile").delete(verifyJwt, deleteAccount)

export default router
