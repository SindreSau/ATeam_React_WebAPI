// src/services/authApi.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from '../lib/axios';
import { LoginRequest, RegisterRequest, User } from '../types/auth';

export const authApi = {
    login: async (credentials: LoginRequest) => {
        const { data } = await axiosClient.post<{ token: string }>('/login', credentials);
        localStorage.setItem('token', data.token);
        return data;
    },

    register: async (registerData: RegisterRequest) => {
        const { data } = await axiosClient.post('/register', registerData);
        return data;
    },

    logout: async () => {
        const { data } = await axiosClient.post('/logout');
        localStorage.removeItem('token');
        return data;
    },

    getCurrentUser: async () => {
        const { data } = await axiosClient.get<User>('/manage/info');
        return data;
    },
};

// React Query hooks
export const useLogin = () => {
    return useMutation({
        mutationFn: authApi.login,
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: authApi.register,
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: authApi.logout,
    });
};

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: authApi.getCurrentUser,
        retry: false,
        enabled: !!localStorage.getItem('token'), // Only run if token exists
    });
};