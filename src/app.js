import express from "express";
import analyzeRouter from "./routes/analyze.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

const app = express()

// Implemanting cors configuration
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000", // Change this to match your frontend URL
        credentials: true, // Allow cookies
    })
);

// We are accepting json data and setting limit 
app.use(express.json({ limit: '50mb' }))

// We are setting the cookie parser for accessing or setting the browser cookies
app.use(cookieParser())

// Routes
app.use("/api/users", userRouter)

app.use("/api", analyzeRouter)

export default app
