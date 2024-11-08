import { useState, useEffect } from 'react';

interface User {
    id: string;
    role: string;
    email: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
}

export const useAuth = (): AuthState => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        isLoading: true
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/user', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const userData = await response.json();
                    setAuthState({
                        isAuthenticated: true,
                        user: userData,
                        isLoading: false
                    });
                } else {
                    setAuthState({
                        isAuthenticated: false,
                        user: null,
                        isLoading: false
                    });
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    isLoading: false
                });
            }
        };

        checkAuth();
    }, []);

    return authState;
};