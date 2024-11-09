// src/api/auth.ts
import api from './axios';
import { AxiosResponse } from 'axios';
import { LoginResponse, RegisterResponse, AuthUserInfo, LoginRequest, RegisterRequest } from '../types/auth';

export const authApi = {
    login: (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> =>
        api.post('/Account/login', data),

    register: (data: RegisterRequest): Promise<AxiosResponse<RegisterResponse>> =>
        api.post('/Account/register', data),

    logout: (): Promise<AxiosResponse<void>> =>
        api.post('/Account/logout'),

    getUserInfo: (): Promise<AxiosResponse<AuthUserInfo>> =>
        api.get('/Account/info'),
};

// Add type guard for error responses
export const isAuthError = (error: any): error is Error => {
    return error instanceof Error;
};