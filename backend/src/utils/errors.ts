export interface AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    isAppError: boolean;
}

export const createAppError = (
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
): AppError => {
    const error = new Error(message) as AppError;
    error.statusCode = statusCode;
    error.isOperational = isOperational;
    error.isAppError = true;
    Error.captureStackTrace(error, createAppError);
    return error;
};

export const createValidationError = (message: string): AppError => {
    return createAppError(message, 400);
};

export const createAuthenticationError = (message: string = 'Authentication failed'): AppError => {
    return createAppError(message, 401);
};

export const createAuthorizationError = (message: string = 'Insufficient permissions'): AppError => {
    return createAppError(message, 403);
};

export const createNotFoundError = (message: string = 'Resource not found'): AppError => {
    return createAppError(message, 404);
};

export const createConflictError = (message: string = 'Resource conflict'): AppError => {
    return createAppError(message, 409);
};
