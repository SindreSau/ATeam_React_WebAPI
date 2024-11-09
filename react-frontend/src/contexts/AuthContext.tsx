// src/contexts/AuthContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth'; // Import your existing hook
import { AuthUserInfo, LoginResponse, RegisterResponse } from '../types/auth';

interface AuthContextType {
    user: AuthUserInfo | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<RegisterResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const {
        user,
        isLoading,
        login: authLogin,
        logout: authLogout,
        register: authRegister
    } = useAuth();

    const login = async (email: string, password: string) => {
        return authLogin({ email, password });
    };

    const register = async (email: string, password: string) => {
        return authRegister({ email, password });
    };

    const value: AuthContextType = {
        user: user || null,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout: authLogout,
        register
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Rename to avoid conflict with your existing useAuth
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};