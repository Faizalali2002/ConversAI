import ErrorResponse from "../utils/errorResponse.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose Cast Error
  if (err.name === "CastError") {
    error = new ErrorResponse("Resource Not Found", 404);
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    error = new ErrorResponse("Duplicate field value entered", 400);
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errorHandler;
