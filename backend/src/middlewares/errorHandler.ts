import { Request, Response, NextFunction } from "express";

// Custom Error Interface (optional)
interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log('ERR',err); 
  console.log('ERR MESSAGE',err.message); // 🔹 error message
  console.log('ERR code',err.statusCode);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "ERROR",
    message,
  });
};

export default errorHandler;
