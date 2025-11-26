import { Response } from 'express';

export const sendSuccessResponse = (
  res: Response,
  data: any = null,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = (
  res: Response,
  error: string,
  statusCode: number = 400
): void => {
  res.status(statusCode).json({
    success: false,
    error,
  });
};
