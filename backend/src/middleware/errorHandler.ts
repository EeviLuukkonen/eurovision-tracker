import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.js';

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
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
};
