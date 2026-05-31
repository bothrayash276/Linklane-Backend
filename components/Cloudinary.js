import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv'
dotenv.config()

export default async function imgToURL(imgURL) {
    cloudinary.config({
        'cloud_name' : process.env.CLOUDINARY_CLOUD_NAME,
        'api_key' : process.env.CLOUDINARY_API_KEY,
        'api_secret' : process.env.CLOUDINARY_API_SECRET
    })

    const response = await cloudinary.uploader.upload(imgURL)
    const result = await response.json()

    return result.secure_url

}