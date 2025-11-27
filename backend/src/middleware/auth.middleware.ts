import { Request, Response, NextFunction } from 'express';
import * as authService from '../modules/auth/auth.service';
import { createAuthenticationError, createAuthorizationError } from '../utils/errors';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                tenantId: string;
                role: string;
            };
            tenantId?: string;
        }
    }
}

export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw createAuthenticationError('No token provided');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw createAuthenticationError('Invalid token format');
        }

        const decoded = authService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};

export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw createAuthenticationError('Authentication required');
        }

        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            throw createAuthorizationError('Insufficient permissions');
        }

        next();
    };
};
