import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
    verifyJwt,
    isAdmin,
    isInstructor,
    isStudent
} 
from "../middleware/auth.js";


//Importing Courses handler functions
import {
    createCourse,
    getAllCourses,
    getCourse
} 
from "../controllers/course.controller.js";

const router = Router();

//courses routes
router.route("/get-all-courses").get(getAllCourses);
router.route("/get-course").get(getCourse);

//secure course routes
router.route("/create-course").post(verifyJwt, isInstructor, upload.fields([{ name: "thumbnailImage", maxCount: 1 }]), createCourse);


//Import Category Handler functions
import {
    createCategory,
    showAllCategories,
    categoryPageDetails
}
from "../controllers/category.controller.js"

//Category Routes
router.route("/create-category").post(verifyJwt, isAdmin, createCategory);
router.route("/show-all-categories").get(showAllCategories);
router.route("/category-page-details").get(categoryPageDetails);

//import Section Hnadler Functions
import {
    createSection,
    updateSection,
    deleteSection
} 
from "../controllers/section.controller.js"

//Section Routes
router.route("/create-section").post(verifyJwt, isInstructor, createSection);
router.route("/update-section").patch(verifyJwt, isInstructor, updateSection);
router.route("/delete-section/:courseId/:sectionId").delete(verifyJwt, isInstructor, deleteSection);

//import subSection Handler functions
import {
    createSubSection,
    updateSubSection,
    deleteSubSection
}
from "../controllers/subSection.controllers.js";

//Sub Section Routes
router.route("/create-subSection").post(verifyJwt, isInstructor, upload.fields([{ name: "lectureVideo", maxCount: 1 }]), createSubSection);
router.route("/update-subSection").patch(verifyJwt, isInstructor, upload.fields([{ name: "lectureVideo", maxCount: 1 }]), updateSubSection);
router.route("/delete-subSection").post(verifyJwt, isInstructor, deleteSubSection);


//import rating and reviews handler functions
import { 
    createRatingAndReview,
    getAllRatings,
    getAverageRating
} from "../controllers/ratingAndReview.controller.js";

//rating and reviews route
router.route("/create-rating-and-review").post(verifyJwt, isStudent, createRatingAndReview)
router.route("/get-average-rating").get(getAverageRating)
router.route("/get-reviews").get(getAllRatings);

export default router





