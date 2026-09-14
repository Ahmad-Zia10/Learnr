import { app } from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT || 4000;

//Without these the server starts and then fails one request at a time, which is
//far harder to diagnose than refusing to boot. Checked at startup so a bad
//deploy fails immediately and visibly.
const REQUIRED_ENV = [
    "MONGODB_URL",
    "ACCESS_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRY",
    "REFRESH_TOKEN_SECRET",
    "REFRESH_TOKEN_EXPIRY",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_CLOUD_API_KEY",
    "CLOUDINARY_CLOUD_API_SECRET",
    "RAZORPAY_KEY",
    "RAZORPAY_SECRET",
    "MAIL_HOST",
    "MAIL_USER",
    "MAIL_PASS"
];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

if(missing.length) {
    console.error(`Missing required environment variable(s): ${missing.join(", ")}`);
    process.exit(1);
}

//Cross-origin requests are rejected without this, so in production it is not
//optional - but it is only a warning, since a same-origin deployment is valid.
if(process.env.NODE_ENV === "production" && !process.env.CORS_ORIGIN) {
    console.warn("CORS_ORIGIN is not set: browser requests from another origin will be blocked.");
}

//The webhook is the fallback that fulfils an order when the browser never
//returns from the payment page. Checkout still works without it.
if(process.env.NODE_ENV === "production" && !process.env.RAZORPAY_WEBHOOK_SECRET) {
    console.warn("RAZORPAY_WEBHOOK_SECRET is not set: payment webhooks will be rejected.");
}

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port : ${PORT}`)
    })
})
.catch((err) => {
    console.log("Mongo DB connecction error",err);
    process.exit(1);
})
