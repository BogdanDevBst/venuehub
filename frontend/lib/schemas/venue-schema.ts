import { z } from 'zod';

// Address schema
export const addressSchema = z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    postcode: z.string().min(1, 'Postcode is required'),
    country: z.string().min(1, 'Country is required'),
    coordinates: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional(),
});

// Venue creation schema
export const createVenueSchema = z.object({
    name: z.string().min(1, 'Venue name is required').max(200, 'Name is too long'),
    description: z.string().optional(),
    address: addressSchema,
    capacity: z
        .number({
            required_error: 'Capacity is required',
            invalid_type_error: 'Capacity must be a number',
        })
        .int('Capacity must be a whole number')
        .positive('Capacity must be greater than 0')
        .max(100000, 'Capacity seems unrealistic'),
    pricePerHour: z
        .number({
            required_error: 'Price per hour is required',
            invalid_type_error: 'Price must be a number',
        })
        .positive('Price must be greater than 0')
        .max(1000000, 'Price seems unrealistic'),
    amenities: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
});

// Venue update schema (all fields optional except what's being updated)
export const updateVenueSchema = createVenueSchema.partial().extend({
    isActive: z.boolean().optional(),
});

// Type exports
export type CreateVenueFormData = z.infer<typeof createVenueSchema>;
export type UpdateVenueFormData = z.infer<typeof updateVenueSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
