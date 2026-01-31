import { z } from 'zod';

export const createBookingSchema = z.object({
    venueId: z.string().min(1, 'Venue is required'),
    startTime: z.date({
        required_error: 'Start time is required',
        invalid_type_error: 'Invalid start time',
    }),
    endTime: z.date({
        required_error: 'End time is required',
        invalid_type_error: 'Invalid end time',
    }),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
}).refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
}).refine((data) => data.startTime > new Date(), {
    message: 'Start time must be in the future',
    path: ['startTime'],
});

export type CreateBookingFormData = z.infer<typeof createBookingSchema>;
