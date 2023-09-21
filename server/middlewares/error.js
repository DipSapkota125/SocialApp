import ErrorHandler from "../utils/errorHandler.js";

export const errorListening = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";

  //wrong mongoId error
  if (err.name === "CastError") {
    const message = `Resource not found:${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  //duplicate error
  if (err.code === 11000) {
    const message = `Duplicate : ${Object.keys(err.keyValue)}`;
    err = new ErrorHandler(message, 400);
  }
  //JsonWebTokenError
  if (err.name === "JsonWebTokenError") {
    const message = `Invalid token, try again!`;
    err = new ErrorHandler(message, 400);
  }

  //TokenExpired
  if (err.name === "TokenExpiredError") {
    const message = `Token has been expired!`;
    err = new ErrorHandler(message, 400);
  }

  //Multer Error
  if (err.name === "MulterError") {
    const message = `Error uploading file : ${err.message}`;
    err = new ErrorHandler(message, 400);
  }

  //ENotFound
  if (err.name === "ENOTFOUND") {
    const message = `Connection err: Unable to connect the server@`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
