import { Request, Response, NextFunction } from 'express';

export const injectTenant = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    if (req.user?.tenantId) {
        req.tenantId = req.user.tenantId;
    }
    next();
};
