import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { sendSuccessResponse } from '../../utils/response';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.registerUser(req.body);
    sendSuccessResponse(res, { user }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.loginUser(req.body);
    sendSuccessResponse(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.getUserById(req.user!.userId);
    sendSuccessResponse(res, { user });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    sendSuccessResponse(res, result, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};
