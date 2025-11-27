import { Request, Response, NextFunction } from 'express';
import { query } from '../database/client';
import { createAuthorizationError, createNotFoundError } from '../utils/errors';

/**
 * Middleware to verify ownership of a resource
 * - Owners and managers can access all resources in their tenant
 * - Customers can only access resources they created
 */
export const requireOwnership = (resourceType: 'venue') => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) {
                throw createAuthorizationError('Authentication required');
            }

            const userId = req.user.userId;
            const userRole = req.user.role;
            const resourceId = req.params.id;
            const tenantId = req.tenantId;

            // Owners and managers have access to all resources in their tenant
            if (userRole === 'owner' || userRole === 'manager') {
                return next();
            }

            // For customers, verify they own the resource
            if (resourceType === 'venue') {
                const result = await query(
                    `SELECT created_by FROM venues 
           WHERE id = $1 AND tenant_id = $2`,
                    [resourceId, tenantId]
                );

                if (result.rows.length === 0) {
                    throw createNotFoundError('Venue not found');
                }

                const venue = result.rows[0];

                // Check if the customer created this venue
                if (venue.created_by !== userId) {
                    throw createAuthorizationError('You do not have permission to modify this venue');
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
