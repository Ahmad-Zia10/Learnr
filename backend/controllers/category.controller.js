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
    //get details
    const {categoryId} = req.body;

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

    if(differentCourses.lenght === 0) {
        console.log("No other categories found");
    }
    

    //get best selling courses 
    const allCategories = await Category.find().populate("courses");
    const allCourses = allCategories.flatMap((element) => {
            return element.courses;
    })
    //get top 10 most selling courses
    let mostSellingCourses = allCourses.sort((a,b) => b.sold -a.sold).splice(0,10)

    return res
    .status(200)
    .json(new apiResponse(
        200,
        selectedCourses,
        differentCourses,
        mostSellingCourses,
    ))
})


export {
    createCategory,
    showAllCategories,
    categoryPageDetails 
}