// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import React from "react";
import Spinner from "./Spinner";
import {UserRole} from "../types/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuthContext();

    // Show loading state while checking authentication
    if (isLoading) {
        return <Spinner fullPage />;
    }

    // Redirect if we're sure there's no user (after loading)
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Check roles if specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as UserRole)) {
        console.warn(`User role ${user.role} is not allowed to access this route.`);
        return <Navigate to="/unauthorized" />;
    }

    return <>{children}</>;
};