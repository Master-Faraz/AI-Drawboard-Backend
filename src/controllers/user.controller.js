import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken";

// Creating options so that only server can access the token
const options = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
}

const logoutOptions = {
    httpOnly: true,
    secure: true,
}

const generateAccessAndRefreshToken = async (uid) => {
    try {
        // getting user
        const user = await User.findById(uid)

        // generating access and refresh token
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // Setting the refresh token in user and update the db 
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        // returning the access and refresh token
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const refreshAccessTokenController = asyncHandler(async (req, res) => {
    // Getting the refresh token from cookies in browser and in body from mobile
    const incommingRefreshToken = await req.cookies.refreshToken || req.body.refreshToken

    if (!incommingRefreshToken) {
        throw new ApiError(401, "Unauthorized user")
    }

    try {
        // Verify refresh token
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        // Getting the user  from db
        const user = await User.findById(decodedToken?._id)

        if (!user) { throw new ApiError(401, "Invalid Refresh Token") }

        // checking if both refresh token is same or not 
        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is Either Expired or Used")
        }

        // If everything is good then we generate the new access and refresh token and save it

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Token Refreshed Successfully"))
    } catch (error) {
        throw new ApiError(500, `Error while refreshing Tokens :: ${error?.message || ""}`)
    }

})

const registerUserController = asyncHandler(async (req, res) => {

    // Extracting user details  
    const { username, email, password } = req.body

    // Validation 
    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Checking if user already exist or not 
    const existedUser = await User.findOne({ email })

    if (existedUser) {
        // const err = new ApiError(409, "Email already exists")
        // res.status(409).json(err)

        throw new ApiError(409, "Email already exists")
    }

    // Creating user in  DB

    const user = await User.create({ username, email, password })

    //    Checking if user is created or not and we dont want password and refresh token
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) throw new ApiError(500, "Something went wrong while creating the user")

    // Sending Response

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User Registered Successfully")
    )
})

const loginController = asyncHandler(async (req, res) => {
    // Extracting user details
    const { email, password } = req.body

    // Validation 
    if (!email) {
        throw new ApiError(400, "Email is required")
    }
    if (!password) {
        throw new ApiError(400, "Password is required")
    }

    // check if user exists or not 

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User doesn't exists")
    }

    const isPasswordValid = await user.isPasswordVerified(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Credentials")
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    // Getting the updated user after refresh token is added w/o pass and refToken
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    // Here we are accessing cookies using Cookie-Parser middleware in app.js
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged in successfully "
        ))

})

const logoutController = asyncHandler(async (req, res) => {
    // As we are using VerifyJWT middleware in the routes where we inject user in req so we can access it here
    // Now we can remove Refresh token from server so that we can logout
    await User.findByIdAndUpdate(
        req?.user._id,
        {
            // MongoDb operator to set the refresh token to undefined
            $set: { refreshToken: undefined }
        },
        {
            // In response we get the updated value of it
            new: true
        }
    )

    // Clearing the tokens from cookies 
    return res
        .status(200)
        .clearCookie("accessToken", logoutOptions)
        .clearCookie("refreshToken", logoutOptions)
        .json(new ApiResponse(
            200,
            {},
            "User Logged out successfully "
        ))
})

const getUserController = asyncHandler(async (req, res) => {
    //  extracting the token
    const token = await req.cookies.accessToken || req.body.accessToken

    if (!token) {
        throw new ApiError(401, "Unauthorized user")
    }

    try {
        // Verify the access token
        const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


        // Getting the user  from db
        const user = await User.findById(verifiedToken?._id).select("-password -refreshToken -createdAt -updatedAt -__v")

        if (!user) { throw new ApiError(401, "Invalid Access Token") }


        res.status(200).json(
            new ApiResponse(200, { user }, "User fetched successfully")
        );


    } catch (error) {
        throw new ApiError(401, `Invalid or expired access token: ${error.message}`);

    }

})

export { registerUserController, loginController, logoutController, refreshAccessTokenController, getUserController }