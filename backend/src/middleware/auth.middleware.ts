import { Request, Response, NextFunction } from 'express';
import * as authService from '../modules/auth/auth.service';
import { AuthenticationError, AuthorizationError } from '../utils/errors';

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
            throw new AuthenticationError('No token provided');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new AuthenticationError('Invalid token format');
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
            throw new AuthenticationError('Authentication required');
        }

        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            throw new AuthorizationError('Insufficient permissions');
        }

        next();
    };
};
