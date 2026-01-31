import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import {
    BookingWithDetails,
    CreateBookingData,
    UpdateBookingStatusData,
    CheckAvailabilityData,
    ApiResponse,
} from '@/lib/types';

// Fetch all bookings (for tenant)
export const useBookings = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: ['bookings', page, limit],
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<{ bookings: BookingWithDetails[]; total: number }>>(
                `/bookings?page=${page}&limit=${limit}`
            );
            return response.data.data!;
        },
    });
};

// Fetch booking by ID
export const useBooking = (id: string) => {
    return useQuery({
        queryKey: ['booking', id],
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<{ booking: BookingWithDetails }>>(
                `/bookings/${id}`
            );
            return response.data.data!.booking;
        },
        enabled: !!id,
    });
};

// Fetch bookings by venue
export const useVenueBookings = (venueId: string, status?: string) => {
    return useQuery({
        queryKey: ['bookings', 'venue', venueId, status],
        queryFn: async () => {
            const url = status
                ? `/bookings/venue/${venueId}?status=${status}`
                : `/bookings/venue/${venueId}`;
            const response = await apiClient.get<ApiResponse<{ bookings: BookingWithDetails[] }>>(url);
            return response.data.data!.bookings;
        },
        enabled: !!venueId,
    });
};

// Fetch user's bookings
export const useMyBookings = (status?: string) => {
    return useQuery({
        queryKey: ['bookings', 'my', status],
        queryFn: async () => {
            const url = status
                ? `/bookings/my-bookings?status=${status}`
                : `/bookings/my-bookings`;
            const response = await apiClient.get<ApiResponse<{ bookings: BookingWithDetails[] }>>(url);
            return response.data.data!.bookings;
        },
    });
};

// Create booking
export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateBookingData) => {
            const response = await apiClient.post<ApiResponse<any>>('/bookings', data);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success('Booking created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to create booking');
        },
    });
};

// Update booking status
export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateBookingStatusData }) => {
            const response = await apiClient.put<ApiResponse<any>>(`/bookings/${id}/status`, data);
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['booking', variables.id] });
            toast.success('Booking status updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update booking status');
        },
    });
};

// Cancel booking
export const useCancelBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await apiClient.delete<ApiResponse<any>>(`/bookings/${id}`);
            return response.data.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['booking', id] });
            toast.success('Booking cancelled');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to cancel booking');
        },
    });
};

// Check availability
export const useCheckAvailability = () => {
    return useMutation({
        mutationFn: async (data: CheckAvailabilityData) => {
            const response = await apiClient.post<ApiResponse<{ available: boolean }>>(
                '/bookings/check-availability',
                data
            );
            return response.data.data!.available;
        },
        onError: (error: any) => {
            console.error('Failed to check availability', error);
        },
    });
};
