import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import config from '../config';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Log error
    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });

    // Default error
    let statusCode = 500;
    let message = 'Internal server error';

    // Handle known errors
    // We check for isAppError property since we are using factory functions now
    if ((err as any).isAppError) {
        statusCode = (err as any).statusCode;
        message = err.message;
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
};

// Handle 404 routes
export const notFoundHandler = (
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
};
