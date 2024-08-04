import { Router } from "express";
import TouristUser from "../model/userModel.js";
import { GenerateResult,BookTrip,GetDetails,handlePopularDest,handleRegister,handleLogin,handleAuth, HandlePackage } from "../controller/userContoller.js";

const userRouter = Router();


userRouter.route("/login").post(handleLogin);

userRouter.route("/register").post(handleRegister)

userRouter.route("/auth").get(handleAuth);

userRouter.route("/result").get(GenerateResult);
userRouter.route("/popular").get(handlePopularDest);

userRouter.route("/single/:id").get(GetDetails);

userRouter.route("/booktrip").post(BookTrip);
userRouter.route("/package").get(HandlePackage);
export default userRouter;