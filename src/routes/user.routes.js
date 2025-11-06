import { Router } from "express";
import { getUserController, loginController, logoutController, refreshAccessTokenController, registerUserController } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

// The below approach allows us to build chaining of req ex-> .post().get().delete()
// userRouter.route("/register").post(registerUserController )

userRouter.post("/register", registerUserController)
userRouter.post("/login", loginController)
userRouter.post("refresh-token", refreshAccessTokenController)

// Secured Routes
userRouter.post("/logout", verifyJWT, logoutController)
userRouter.get("/getuser", verifyJWT, getUserController)


export default userRouter