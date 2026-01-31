import { z } from 'zod';
import { BookingStatus } from './booking.types';

// Create booking validation
export const createBookingSchema = z.object({
    venueId: z.string().uuid('Invalid venue ID'),
    startTime: z.string().datetime('Invalid start time format'),
    endTime: z.string().datetime('Invalid end time format'),
    notes: z.string().max(1000, 'Notes too long').optional(),
}).refine(
    (data) => {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        return end > start;
    },
    {
        message: 'End time must be after start time',
        path: ['endTime'],
    }
).refine(
    (data) => {
        const start = new Date(data.startTime);
        const now = new Date();
        return start > now;
    },
    {
        message: 'Start time must be in the future',
        path: ['startTime'],
    }
).refine(
    (data) => {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return durationHours >= 1 && durationHours <= 24;
    },
    {
        message: 'Booking duration must be between 1 and 24 hours',
        path: ['endTime'],
    }
);

// Update booking status validation
export const updateBookingStatusSchema = z.object({
    status: z.nativeEnum(BookingStatus, {
        errorMap: () => ({ message: 'Invalid booking status' }),
    }),
});

// Check availability validation
export const checkAvailabilitySchema = z.object({
    venueId: z.string().uuid('Invalid venue ID'),
    startTime: z.string().datetime('Invalid start time format'),
    endTime: z.string().datetime('Invalid end time format'),
});
