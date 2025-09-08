import { verifySignature, capturePayment } from "../controllers/payment.controller.js";
import { Router } from "express";
import { verifyJwt, isStudent } from "../middleware/auth.js";

const router = Router();

//payment routes
router.route("/capture-payment").post(verifyJwt, isStudent, capturePayment);
router.route("/verify-signature").post(verifySignature);

export default router