import { verifySignature, verifyPayment, capturePayment } from "../controllers/payment.controller.js";
import { Router } from "express";
import { verifyJwt, isStudent } from "../middleware/auth.js";

const router = Router();

//payment routes
router.route("/capture-payment").post(verifyJwt, isStudent, capturePayment);
router.route("/verify-payment").post(verifyJwt, isStudent, verifyPayment);
//called by Razorpay itself, so it carries no user session
router.route("/verify-signature").post(verifySignature);

export default router
