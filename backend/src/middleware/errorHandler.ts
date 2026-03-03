import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.js';

type HttpError = Error & {
  statusCode?: number;
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  console.error(`Error on ${req.method} ${req.path}:`, error);

  if (res.headersSent) {
    return next(error);
  }

  const httpError = error as HttpError;
  const statusCode = httpError.statusCode ?? 500;
  const message = httpError.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
