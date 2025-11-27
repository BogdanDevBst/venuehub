import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { createValidationError } from '../utils/errors';

export const validateRequest = (schema: ZodSchema) => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessage = error.errors
                    .map((err) => `${err.path.join('.')}: ${err.message}`)
                    .join(', ');
                next(createValidationError(errorMessage));
            } else {
                next(error);
            }
        }
    };
};
