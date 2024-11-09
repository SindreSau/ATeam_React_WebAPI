// src/types/auth.ts
export interface ErrorResponse {
    error: string;
}

export interface LoginResponse {
    message: string;
    email: string;
    role: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    email: string;
    role: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export type UserRole = "Admin" | "Vendor";

export interface AuthUserInfo {
    email: string;
    role: UserRole;
}