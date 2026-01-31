import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import * as BookingHandlers from './booking.handlers';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create booking
router.post('/', BookingHandlers.createBookingHandler);

// Get all bookings for tenant
router.get('/', BookingHandlers.getAllBookingsHandler);

// Get user's bookings
router.get('/my-bookings', BookingHandlers.getMyBookingsHandler);

// Check availability
router.post('/check-availability', BookingHandlers.checkAvailabilityHandler);

// Get booking by ID
router.get('/:id', BookingHandlers.getBookingHandler);

// Get bookings by venue
router.get('/venue/:venueId', BookingHandlers.getVenueBookingsHandler);

// Update booking status
router.put('/:id/status', BookingHandlers.updateBookingStatusHandler);

// Cancel booking
router.delete('/:id', BookingHandlers.cancelBookingHandler);

export default router;
