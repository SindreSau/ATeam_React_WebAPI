// src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { AxiosError } from 'axios';

const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
        console.error('Error:', error.response?.data || error.message);
    } else {
        console.error('Unexpected error:', error);
    }
};

export const useAuth = () => {
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const response = await authApi.login(credentials);
            // Add a small delay to ensure cookie is properly set
            await new Promise(resolve => setTimeout(resolve, 100));
            return response.data;
        },
        onSuccess: async () => {
            // Force a refetch instead of just invalidating
            await queryClient.resetQueries({ queryKey: ['user'] });
            await queryClient.fetchQuery({ queryKey: ['user'] });
        },
        onError: handleError,
    });

    const registerMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const response = await authApi.register(credentials);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: handleError,
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await authApi.logout();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: handleError,
    });

    const { data: userInfo, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const response = await authApi.getUserInfo();
                return response.data;
            } catch (error) {
                if ((error as AxiosError).response?.status === 401) {
                    return null; // or trigger a logout if needed
                }
                throw error; // Let axios interceptor handle other cases
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes - how long to use cached data before refetching
        gcTime: 1000 * 60 * 30,   // 30 minutes - how long to keep unused data in cache
    });

    return {
        user: userInfo,
        isLoading,
        isError,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
    };
};