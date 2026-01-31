import { query } from '../../database/client';
import { createValidationError, createNotFoundError } from '../../utils/errors';
import {
    Booking,
    BookingStatus,
    PaymentStatus,
    CreateBookingData,
    BookingWithDetails,
} from './booking.types';

// Calculate total amount based on venue price and duration
export const calculateTotalAmount = async (
    venueId: string,
    startTime: Date,
    endTime: Date
): Promise<number> => {
    // Get venue price per hour
    const venueResult = await query(
        'SELECT price_per_hour FROM venues WHERE id = $1',
        [venueId]
    );

    if (venueResult.rows.length === 0) {
        throw createNotFoundError('Venue not found');
    }

    const pricePerHour = parseFloat(venueResult.rows[0].price_per_hour);
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    return pricePerHour * durationHours;
};

// Check if venue is available for the given time slot
export const checkAvailability = async (
    venueId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
): Promise<boolean> => {
    let queryText = `
    SELECT id FROM bookings
    WHERE venue_id = $1
      AND status != $2
      AND tsrange(start_time, end_time) && tsrange($3, $4)
  `;
    const queryParams: any[] = [venueId, BookingStatus.CANCELLED, startTime, endTime];

    // Exclude a specific booking (for updates)
    if (excludeBookingId) {
        queryText += ' AND id != $5';
        queryParams.push(excludeBookingId);
    }

    const result = await query(queryText, queryParams);
    return result.rows.length === 0;
};

// Create a new booking
export const createBooking = async (
    customerId: string,
    data: CreateBookingData
): Promise<Booking> => {
    const { venueId, startTime, endTime, notes } = data;

    // Check if venue exists and is active
    const venueResult = await query(
        'SELECT id, is_active FROM venues WHERE id = $1',
        [venueId]
    );

    if (venueResult.rows.length === 0) {
        throw createNotFoundError('Venue not found');
    }

    if (!venueResult.rows[0].is_active) {
        throw createValidationError('Venue is not available for booking');
    }

    // Check availability
    const isAvailable = await checkAvailability(venueId, startTime, endTime);
    if (!isAvailable) {
        throw createValidationError(
            'This time slot is not available. Please choose a different time.'
        );
    }

    // Calculate total amount
    const totalAmount = await calculateTotalAmount(venueId, startTime, endTime);

    // Create booking
    const result = await query(
        `INSERT INTO bookings (
      venue_id, customer_id, start_time, end_time,
      status, total_amount, payment_status, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
        [
            venueId,
            customerId,
            startTime,
            endTime,
            BookingStatus.PENDING,
            totalAmount,
            PaymentStatus.PENDING,
            notes || null,
        ]
    );

    return result.rows[0];
};

// Get booking by ID with details
export const getBookingById = async (bookingId: string): Promise<BookingWithDetails> => {
    const result = await query(
        `SELECT 
      b.*,
      v.name as venue_name,
      v.address as venue_address,
      u.first_name as customer_first_name,
      u.last_name as customer_last_name,
      u.email as customer_email
    FROM bookings b
    JOIN venues v ON b.venue_id = v.id
    JOIN users u ON b.customer_id = u.id
    WHERE b.id = $1`,
        [bookingId]
    );

    if (result.rows.length === 0) {
        throw createNotFoundError('Booking not found');
    }

    return result.rows[0];
};

// Get bookings by venue
export const getBookingsByVenue = async (
    venueId: string,
    status?: BookingStatus
): Promise<BookingWithDetails[]> => {
    let queryText = `
    SELECT 
      b.*,
      v.name as venue_name,
      v.address as venue_address,
      u.first_name as customer_first_name,
      u.last_name as customer_last_name,
      u.email as customer_email
    FROM bookings b
    JOIN venues v ON b.venue_id = v.id
    JOIN users u ON b.customer_id = u.id
    WHERE b.venue_id = $1
  `;
    const queryParams: any[] = [venueId];

    if (status) {
        queryText += ' AND b.status = $2';
        queryParams.push(status);
    }

    queryText += ' ORDER BY b.start_time DESC';

    const result = await query(queryText, queryParams);
    return result.rows;
};

// Get bookings by user
export const getBookingsByUser = async (
    userId: string,
    status?: BookingStatus
): Promise<BookingWithDetails[]> => {
    let queryText = `
    SELECT 
      b.*,
      v.name as venue_name,
      v.address as venue_address,
      u.first_name as customer_first_name,
      u.last_name as customer_last_name,
      u.email as customer_email
    FROM bookings b
    JOIN venues v ON b.venue_id = v.id
    JOIN users u ON b.customer_id = u.id
    WHERE b.customer_id = $1
  `;
    const queryParams: any[] = [userId];

    if (status) {
        queryText += ' AND b.status = $2';
        queryParams.push(status);
    }

    queryText += ' ORDER BY b.start_time DESC';

    const result = await query(queryText, queryParams);
    return result.rows;
};

// Update booking status
export const updateBookingStatus = async (
    bookingId: string,
    status: BookingStatus
): Promise<Booking> => {
    // Get current booking
    const currentBooking = await query(
        'SELECT * FROM bookings WHERE id = $1',
        [bookingId]
    );

    if (currentBooking.rows.length === 0) {
        throw createNotFoundError('Booking not found');
    }

    const booking = currentBooking.rows[0];

    // Validate status transition
    if (booking.status === BookingStatus.CANCELLED) {
        throw createValidationError('Cannot update a cancelled booking');
    }

    if (booking.status === BookingStatus.COMPLETED) {
        throw createValidationError('Cannot update a completed booking');
    }

    // Update status
    const result = await query(
        'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, bookingId]
    );

    return result.rows[0];
};

// Cancel booking
export const cancelBooking = async (bookingId: string): Promise<Booking> => {
    return updateBookingStatus(bookingId, BookingStatus.CANCELLED);
};

// Get all bookings for a tenant
export const getAllBookings = async (
    tenantId: string,
    page: number = 1,
    limit: number = 20
): Promise<{ bookings: BookingWithDetails[]; total: number }> => {
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await query(
        `SELECT COUNT(*) FROM bookings b
     JOIN venues v ON b.venue_id = v.id
     WHERE v.tenant_id = $1`,
        [tenantId]
    );
    const total = parseInt(countResult.rows[0].count);

    // Get bookings
    const result = await query(
        `SELECT 
      b.*,
      v.name as venue_name,
      v.address as venue_address,
      u.first_name as customer_first_name,
      u.last_name as customer_last_name,
      u.email as customer_email
    FROM bookings b
    JOIN venues v ON b.venue_id = v.id
    JOIN users u ON b.customer_id = u.id
    WHERE v.tenant_id = $1
    ORDER BY b.start_time DESC
    LIMIT $2 OFFSET $3`,
        [tenantId, limit, offset]
    );

    return {
        bookings: result.rows,
        total,
    };
};
