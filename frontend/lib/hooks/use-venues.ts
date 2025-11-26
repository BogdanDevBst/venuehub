import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api-client';
import { Venue, CreateVenueData, UpdateVenueData, VenueFilters, ApiResponse } from '../types';
import { toast } from 'sonner';

export const useVenues = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['venues', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{
        venues: Venue[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>>(`/venues?page=${page}&limit=${limit}`);
      return response.data.data!;
    },
  });
};

export const useVenue = (id: string) => {
  return useQuery({
    queryKey: ['venue', id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{ venue: Venue }>>(`/venues/${id}`);
      return response.data.data!.venue;
    },
    enabled: !!id,
  });
};

export const useSearchVenues = (filters: VenueFilters) => {
  const params = new URLSearchParams();
  
  if (filters.city) params.append('city', filters.city);
  if (filters.capacity_min) params.append('capacity_min', filters.capacity_min.toString());
  if (filters.capacity_max) params.append('capacity_max', filters.capacity_max.toString());
  if (filters.price_max) params.append('price_max', filters.price_max.toString());
  if (filters.amenities?.length) params.append('amenities', filters.amenities.join(','));
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  return useQuery({
    queryKey: ['venues', 'search', filters],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{
        venues: Venue[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>>(`/venues/search?${params.toString()}`);
      return response.data.data!;
    },
  });
};

export const useCreateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVenueData) => {
      const response = await apiClient.post<ApiResponse<{ venue: Venue }>>('/venues', data);
      return response.data.data!.venue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      toast.success('Venue created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create venue');
    },
  });
};

export const useUpdateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateVenueData }) => {
      const response = await apiClient.put<ApiResponse<{ venue: Venue }>>(`/venues/${id}`, data);
      return response.data.data!.venue;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      queryClient.invalidateQueries({ queryKey: ['venue', variables.id] });
      toast.success('Venue updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update venue');
    },
  });
};

export const useDeleteVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/venues/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      toast.success('Venue deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete venue');
    },
  });
};
