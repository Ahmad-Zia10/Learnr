import { verifySignature, verifyPayment, capturePayment } from "../controllers/payment.controller.js";
import { Router } from "express";
import express from "express";
import { verifyJwt, isStudent } from "../middleware/auth.js";
import { getPurchaseHistory } from "../controllers/order.controller.js";

const router = Router();

//Razorpay signs the exact bytes it sent. Re-serialising the parsed body with
//JSON.stringify does not reproduce them - key order and spacing differ - so the
//HMAC would never match and every genuine webhook would be rejected. This route
//therefore needs the raw buffer, which means its own parser ahead of the JSON
//one in app.js.
const rawBody = express.raw({ type : "application/json", limit : "1mb" });

//payment routes
router.route("/capture-payment").post(verifyJwt, isStudent, capturePayment);
router.route("/verify-payment").post(verifyJwt, isStudent, verifyPayment);
//called by Razorpay itself, so it carries no user session
router.route("/verify-signature").post(rawBody, verifySignature);

router.route("/purchase-history").get(verifyJwt, isStudent, getPurchaseHistory);

export default router
