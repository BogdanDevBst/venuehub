import { Request, Response, NextFunction } from 'express';
import * as BookingService from './booking.service';
import {
    createBookingSchema,
    updateBookingStatusSchema,
    checkAvailabilitySchema,
} from './booking.validation';
import { BookingStatus } from './booking.types';

// Create booking
export const createBookingHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.userId;

        // Validate request body
        const validatedData = createBookingSchema.parse(req.body);

        const booking = await BookingService.createBooking(userId, {
            venueId: validatedData.venueId,
            startTime: new Date(validatedData.startTime),
            endTime: new Date(validatedData.endTime),
            notes: validatedData.notes,
        });

        res.status(201).json({
            success: true,
            data: { booking },
        });
    } catch (error) {
        next(error);
    }
};

// Get booking by ID
export const getBookingHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const booking = await BookingService.getBookingById(id);

        res.json({
            success: true,
            data: { booking },
        });
    } catch (error) {
        next(error);
    }
};

// Get bookings by venue
export const getVenueBookingsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { venueId } = req.params;
        const { status } = req.query;

        const bookings = await BookingService.getBookingsByVenue(
            venueId,
            status as BookingStatus | undefined
        );

        res.json({
            success: true,
            data: { bookings },
        });
    } catch (error) {
        next(error);
    }
};

// Get user's bookings
export const getMyBookingsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.userId;
        const { status } = req.query;

        const bookings = await BookingService.getBookingsByUser(
            userId,
            status as BookingStatus | undefined
        );

        res.json({
            success: true,
            data: { bookings },
        });
    } catch (error) {
        next(error);
    }
};

// Get all bookings for tenant
export const getAllBookingsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tenantId = req.user!.tenantId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await BookingService.getAllBookings(tenantId, page, limit);

        res.json({
            success: true,
            data: result,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// Update booking status
export const updateBookingStatusHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        // Validate request body
        const validatedData = updateBookingStatusSchema.parse(req.body);

        const booking = await BookingService.updateBookingStatus(
            id,
            validatedData.status
        );

        res.json({
            success: true,
            data: { booking },
        });
    } catch (error) {
        next(error);
    }
};

// Cancel booking
export const cancelBookingHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const booking = await BookingService.cancelBooking(id);

        res.json({
            success: true,
            data: { booking },
        });
    } catch (error) {
        next(error);
    }
};

// Check availability
export const checkAvailabilityHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate request body
        const validatedData = checkAvailabilitySchema.parse(req.body);

        const isAvailable = await BookingService.checkAvailability(
            validatedData.venueId,
            new Date(validatedData.startTime),
            new Date(validatedData.endTime)
        );

        res.json({
            success: true,
            data: { available: isAvailable },
        });
    } catch (error) {
        next(error);
    }
};
