import analyzeImage from "../utils/imageAnalyzer.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const analyzeController = asyncHandler(async (req, res) => {
    const { imagePath, context } = await req.body;

    // Validate input
    if (!imagePath) {
        throw new ApiError(400, "Image path is required");
    }

    // Perform image analysis
    const result = await analyzeImage(imagePath, context);

    // If result is empty, handle it as an error
    if (!result) {
        throw new ApiError(500, "Failed to analyze the image");
    }

    // Return success response
    return res.status(200).json(new ApiResponse(200, { result }, "Image analyzed successfully"));
});

export default analyzeController;
