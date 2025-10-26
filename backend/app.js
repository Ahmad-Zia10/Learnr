import express from "express"
import cors from "cors"
import { errorHandler } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
dotenv.config();

const app = express();

// app.use(cors({
//     origin : process.env.CORS_ORIGIN,//requests coming only from CORS_ORIGIN are going to be entertained.
//     credentials : true
// }))

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

//routes
app.get('/', (req,res) => {

})
app.use("/api/v1/users",userRoutes)// "/home → renders a webpage./api/users → returns JSON with user data."Means these are API endpoints
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/courses",courseRoutes)
app.use("/api/v1/payment",paymentRoutes)

//error
app.use(errorHandler)

export {app}

