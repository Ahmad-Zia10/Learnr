import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

import { Category } from "../models/category.model.js";
import { Course } from "../models/course.model.js";
import { CourseProgess } from "../models/courseProgess.model.js";
import { Order } from "../models/order.model.js";
import { Profile } from "../models/profile.model.js";
import { RatingAndReview } from "../models/ratingAndReview.model.js";
import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";
import { User } from "../models/user.model.js";

//Every collection the seed owns. OTPs are left alone: they expire on their own
//and wiping them mid-signup would break a verification someone is part-way
//through.
const SEEDED_MODELS = [
    { name : "orders", model : Order },
    { name : "course progress", model : CourseProgess },
    { name : "reviews", model : RatingAndReview },
    { name : "lectures", model : SubSection },
    { name : "sections", model : Section },
    { name : "courses", model : Course },
    { name : "categories", model : Category },
    { name : "profiles", model : Profile },
    { name : "users", model : User }
];

const connect = async () => {
    if(!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL is not set. Check backend/.env")
    }

    await mongoose.connect(`${process.env.MONGODB_URL}${DB_NAME}`);
    return mongoose.connection;
}

const disconnect = () => mongoose.disconnect();

//Report what is about to be destroyed before destroying it, so a seed run
//against the wrong database is obvious rather than silent.
const countAll = async () => {
    const counts = [];

    for (const { name, model } of SEEDED_MODELS) {
        counts.push({ name, count : await model.countDocuments() });
    }

    return counts;
}

//Drops every document the seed owns. Deliberately unconditional: the project
//treats the database as disposable demo data, so there is nothing to preserve.
const wipe = async () => {
    for (const { model } of SEEDED_MODELS) {
        await model.deleteMany({});
    }
}

export { connect, disconnect, countAll, wipe, SEEDED_MODELS };
