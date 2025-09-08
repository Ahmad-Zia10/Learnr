import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"
import dotenv from "dotenv"

dotenv.config();



cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret : process.env.CLOUDINARY_CLOUD_API_SECRET
})



const uploadToCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type : "auto"
            }
        )
        // console.log("File has been uploaded successfully: ", response.url);
        fs.unlink(localFilePath);
        return response;
    } catch (error) {
        console.log("Cloudinary name api key and api secret : ",process.env.CLOUDINARY_CLOUD_NAME,process.env.CLOUDINARY_CLOUD_API_KEY,process.env.CLOUDINARY_CLOUD_API_SECRET)
        console.error("Cloudinary Upload Error:", error);
        await fs.unlink(localFilePath).catch(console.error);  //deleting file from our servers local storage
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
   try {
     const result = await cloudinary.uploader.destroy(publicId);
     console.log("Deleted From cloudinary")
   } catch (error) {
        console.log("Error while deleting from cloudinary")
        return null;
   }

}

export {uploadToCloudinary, deleteFromCloudinary};