import { Router } from 'express';
import * as venueHandlers from './venue.handlers';
import { authenticate, requireRole } from '../../middleware/auth.middleware';
import { injectTenant } from '../../middleware/tenant.middleware';

const router = Router();

// Apply authentication and tenant injection to all routes
router.use(authenticate);
router.use(injectTenant);

// Public search (customers can search)
router.get('/search', venueHandlers.searchVenues);

// Venue CRUD operations (owner, manager only)
router.post(
  '/',
  requireRole(['owner', 'manager']),
  venueHandlers.createVenue
);

router.get('/', venueHandlers.listVenues);

router.get('/:id', venueHandlers.getVenue);

router.put(
  '/:id',
  requireRole(['owner', 'manager']),
  venueHandlers.updateVenue
);

router.delete(
  '/:id',
  requireRole(['owner', 'manager']),
  venueHandlers.deleteVenue
);

export default router;
