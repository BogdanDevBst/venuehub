import { Router } from 'express';
import * as venueHandlers from './venue.handlers';
import { authenticate, requireRole } from '../../middleware/auth.middleware';
import { injectTenant } from '../../middleware/tenant.middleware';
import { requireOwnership } from '../../middleware/ownership.middleware';

const router = Router();

// Apply authentication and tenant injection to all routes
router.use(authenticate);
router.use(injectTenant);

// Public search (customers can search)
router.get('/search', venueHandlers.searchVenues);

// Venue CRUD operations
// Create - all authenticated users can create venues
router.post(
    '/',
    requireRole(['owner', 'manager', 'customer']),
    venueHandlers.createVenue
);

router.get('/', venueHandlers.listVenues);

router.get('/:id', venueHandlers.getVenue);

// Update - owners/managers can update any, customers only their own
router.put(
    '/:id',
    requireRole(['owner', 'manager', 'customer']),
    requireOwnership('venue'),
    venueHandlers.updateVenue
);

// Delete - owners/managers can delete any, customers only their own
router.delete(
    '/:id',
    requireRole(['owner', 'manager', 'customer']),
    requireOwnership('venue'),
    venueHandlers.deleteVenue
);

export default router;
