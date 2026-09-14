import express from "express"
import cors from "cors"
import { errorHandler } from "./middleware/error.middleware.js";
import apiError from "./utils/apiError.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
dotenv.config();

const app = express();

//In development the Vite proxy makes every request same-origin, so this is
//inert. In production the frontend is served from its own domain and every
//call is cross-origin, so without this the whole API is unreachable.
//
//CORS_ORIGIN accepts a comma-separated list, because staging and production
//frontends often both need to reach the same API.
const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin : (origin, callback) => {
        //server-to-server callers (Razorpay webhooks, health checks, curl) send
        //no Origin header at all and must not be blocked
        if(!origin) return callback(null, true);

        if(allowedOrigins.includes(origin)) return callback(null, true);

        //Refused as a client error by the error middleware, which is what a
        //request from an unapproved origin is.
        return callback(new apiError(403, `Origin ${origin} is not allowed by CORS`));
    },
    //the refresh token travels as an httpOnly cookie
    credentials : true
}))

//common middleware
app.use(express.json({limit:"16kb"}));//Allows your server to understand JSON data sent in requests (like from APIs or frontend).The limit:"16kb" just means request body size cannot be larger than 16kb.
app.use(express.urlencoded({extended : true, limit:"16kb"}));//Allows your server to understand form data (like data from HTML forms).extended:true means it can handle nested objects too, not just simple key-value pairs.
app.use(express.static("public"));//Makes everything inside the public folder available to the browser (like images, CSS, JS files).
app.use(cookieParser());//Lets your server read and write cookies easily (tiny bits of data stored in the browser).

//importing routes
import courseRoutes from "./routes/course.routes.js"
import userRoutes from "./routes/user.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import profileRoutes from "./routes/profile.routes.js"
import contactRoutes from "./routes/contact.routes.js"

//routes
app.get('/', (req,res) => {
    res.status(200).json({ status: "ok", message: "StudyNotion API is running" })
})
app.use("/api/v1/users",userRoutes)// "/home → renders a webpage./api/users → returns JSON with user data."Means these are API endpoints
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/courses",courseRoutes)
app.use("/api/v1/payment",paymentRoutes)
app.use("/api/v1/reach",contactRoutes)

//error
app.use(errorHandler)

export {app}

