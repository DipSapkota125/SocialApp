import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { tryCatchAsyncError } from "./tryCatchAsyncError.js";

//authenticated user
export const isAuthenticated = tryCatchAsyncError(async (req, res, next) => {
  let { token } = req.cookies;
  token = token ? token : req?.headers?.authorization;
  token = token?.replace("Bearer ", "");

  if (!token) return next(new ErrorHandler("please login first", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedData.id);
  if (!user) return next(new ErrorHandler("user doesn't exist!", 404));

  req.user = user;

  next();
});

//for admin
export const isAuthAdmin = tryCatchAsyncError(async (req, res, next) => {
  if (!req.user)
    return next(
      new ErrorHandler("you must be authenticate to access this resource", 401)
    );

  if (req.user.role !== "admin")
    return next(
      new ErrorHandler(
        `${req.user.role} is not authorize to access this resource!`,
        403
      )
    );
  next();
});
