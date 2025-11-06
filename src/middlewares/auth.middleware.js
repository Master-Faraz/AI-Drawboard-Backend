import jwt from "jsonwebtoken"
import asyncHandler from "../utils/AsyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js "
  
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Getting token from cookies or header for mobile devices
        const token = await req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        // Verifying the token
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //  Getting the user , Decoded token has _id because when we are generating token we pass _id to it check user.model
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        // creating and adding user to our request 
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
}) 