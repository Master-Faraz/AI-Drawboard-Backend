import { GoogleGenerativeAI } from "@google/generative-ai";
import { Prompt } from "../constants.js";
import ApiError from "../utils/ApiError.js";

const analyzeImage = async (imagePath, context = "No context provided by the user") => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct the prompt
        const prompt = `${Prompt} \n And here is the context of the image provided by the user: ${context}.`;


        let base64Image;

        if (imagePath.startsWith("data:image")) {
            // The image is already base64 encoded
            base64Image = imagePath.split(",")[1]; // Remove the "data:image/jpeg;base64," part
        } else {
            // Read the image file and convert it to base64
            const imageBuffer = fs.readFileSync(imagePath);
            base64Image = imageBuffer.toString("base64");
        }

        // Send request to Gemini
        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg",
                },
            },
            prompt,
        ]);

        if (!result?.response) {
            throw new ApiError(500, "No response received from the AI model");
        }

        // Extract and clean up response text
        let rawResponse = result.response.text().trim();
        let answers = [];

        try {
            rawResponse = rawResponse.replace(/^```json/, "").replace(/```$/, "").trim();
            answers = JSON.parse(rawResponse);
        } catch (error) {
            throw new ApiError(500, "Error parsing AI response");
        }

        return answers;
    } catch (error) {
        throw new ApiError(500, `Error analyzing image: ${error.message}`);
    }
};

export default analyzeImage;
