import { Category } from "../models/category.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const createCategory = asyncHandler(async (req,res) => {
    //get details
    const {name, description} = req.body;

    //validate details
    if(!(name && description)) {
        throw new apiError(401, "All fields are required!")
    }

    try {
        const categoryDetails = await Category.create({
            name,
            description,
            courses : []
        })

        return res
        .status(200)
        .json(new apiResponse(
            200,
            categoryDetails,
            "Category created successfully"
        ))

    } catch (error) {
        console.log("Category could not be created", error.message);
        throw new apiError(500, "Category could not be created.")
    }



})

const showAllCategories = asyncHandler( async (req,res) => {
    const allcategories = await Category.find()

    return res
    .status(200)
    .json(new apiResponse(
        200,
        allcategories,
        "All Categories fetched successfully"
    ))
})

const categoryPageDetails = asyncHandler(async (req,res) => {
    //GET requests carry no body, so the id arrives as a query param
    const categoryId = req.query.categoryId || req.body?.categoryId;

    //validate 
    if(!categoryId) {
        throw new apiError(400, "Category Id is required")
    }
    //check if category exists
    const selectedCategory = await Category.findById({_id : categoryId}).populate("courses")
    
    if(!selectedCategory) {
        throw new apiError(400, "Category not found")
    }

    //check if there are any courses with this category
    if(selectedCategory.courses.length === 0){
        return res
        .status(200)
        .json(new apiResponse(
            200,
            { selectedCourses : [], differentCourses : [], mostSellingCourses : [] },
            "No courses found with this category"
        ))
    }

    //get selected courses
    const selectedCourses = selectedCategory.courses;

    //get courses for other categories
    const otherCategories = await Category.find(
        {
            _id : {
                $ne : categoryId
            }
        }
    ).populate("courses")

    let differentCourses = otherCategories.map((element) => {
            return element.courses;
    }).flat(1);

    if(differentCourses.length === 0) {
        console.log("No other categories found");
    }
    

    //get best selling courses 
    const allCategories = await Category.find().populate("courses");
    const allCourses = allCategories.flatMap((element) => {
            return element.courses;
    })
    //get top 10 most selling courses. Popularity is the enrolment count the
    //platform already tracks - there is no separate "sold" counter to keep in step.
    let mostSellingCourses = allCourses
        .sort((a,b) => (b.studentsEnrolled?.length ?? 0) - (a.studentsEnrolled?.length ?? 0))
        .slice(0,10)

    //This endpoint is public, so replace the roster of enrolled student ids
    //with the only part of it a visitor needs: how many there are.
    const withEnrolmentCount = (course) => {
        const plain = course.toObject ? course.toObject() : { ...course };
        plain.studentsEnrolledCount = course.studentsEnrolled?.length ?? 0;
        delete plain.studentsEnrolled;
        return plain;
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        {
            selectedCourses : selectedCourses.map(withEnrolmentCount),
            differentCourses : differentCourses.map(withEnrolmentCount),
            mostSellingCourses : mostSellingCourses.map(withEnrolmentCount),
        },
        "Category page details fetched successfully"
    ))
})


export {
    createCategory,
    showAllCategories,
    categoryPageDetails 
}