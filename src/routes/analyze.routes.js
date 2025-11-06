import { Router } from "express";
import analyzeController from "../controllers/analyze.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const analyzeRouter = Router();

analyzeRouter.post("/analyze", verifyJWT, analyzeController);

export default analyzeRouter;
