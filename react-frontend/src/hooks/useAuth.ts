// src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, isAuthError } from '../api/auth';
import { AxiosError } from 'axios';

export const useAuth = () => {
    const queryClient = useQueryClient();

    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                console.log('Fetching user info...');
                const response = await authApi.getUserInfo();
                console.log('User info response:', response.data);
                return response.data;
            } catch (error) {
                console.log('Error fetching user info:', error);
                if ((error as AxiosError).response?.status === 401) {
                    return null;
                }
                throw error;
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const loginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const response = await authApi.login(credentials);
            return response.data;
        },
        onError: (error) => {
            if (isAuthError(error)) {
                console.error('Custom Auth Error:', error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });

    const registerMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const response = await authApi.register(credentials);
            return response.data;
        },
        onError: (error) => {
            console.error('Registration Error:', error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await authApi.logout();
        },
        onError: (error) => {
            // Handle specific logout errors here, if needed
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });

    const { data: userInfo, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const response = await authApi.getUserInfo();
                return response.data;
            } catch (error) {
                // Handle 401 Unauthorized directly here if relevant
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
        userQuery,
        loginMutation,
    };
};
