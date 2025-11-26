import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../api-client';
import { useAuthStore } from '../auth-store';
import { LoginCredentials, RegisterData, AuthResponse, User, ApiResponse } from '../types';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data.data!;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken);
      router.push('/dashboard');
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.post<ApiResponse<{ user: User }>>('/auth/register', data);
      return response.data.data!;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });
};

export const useProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/profile');
      return response.data.data!.user;
    },
    enabled: isAuthenticated,
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  return () => {
    clearAuth();
    router.push('/login');
  };
};
