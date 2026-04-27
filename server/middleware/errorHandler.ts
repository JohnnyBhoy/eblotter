import type { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.stack);
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack })
  });
};
