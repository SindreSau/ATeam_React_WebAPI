// src/types/auth.ts
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    userId: string;
    email: string;
}

export interface User {
    id: string;
    email: string;
    role?: string;
}