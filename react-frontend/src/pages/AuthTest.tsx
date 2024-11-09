// src/pages/AuthTest.tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthForm {
    email: string;
    password: string;
}

interface LocationState {
    from?: Location;
}

const AuthTest = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login, logout, register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<AuthForm>({
        email: '',
        password: ''
    });

    // Get the page they tried to visit originally
    const from = (location.state as LocationState)?.from?.pathname || '/products';

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError(null);
    };

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await login(form);
            // Navigate to the page they tried to visit or products page
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await register(form);
            navigate('/products');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await logout();
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to logout');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Authentication Test</h4>
                </div>
                <div className="card-body">
                    {/* Current User Info */}
                    <div className="mb-4">
                        <h5>Current User:</h5>
                        <pre className="bg-light p-3 rounded">
              {user ? JSON.stringify(user, null, 2) : 'Not logged in'}
            </pre>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Auth Form */}
                    <div className="mb-4">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleFormChange}
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleFormChange}
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2">
                        <button
                            onClick={handleLogin}
                            className="btn btn-primary"
                            disabled={isLoading || !form.email || !form.password}
                        >
                            Login
                        </button>
                        <button
                            onClick={handleRegister}
                            className="btn btn-secondary"
                            disabled={isLoading || !form.email || !form.password}
                        >
                            Register
                        </button>
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="btn btn-danger"
                                disabled={isLoading}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Test Account Information */}
            <div className="card mt-4">
                <div className="card-header">
                    <h5 className="card-title">Test Accounts</h5>
                </div>
                <div className="card-body">
                    <div className="mb-2">
                        <strong>Admin Account:</strong>
                        <br />
                        Email: admin@example.com
                        <br />
                        Password: Admin123!
                    </div>
                    <div>
                        <strong>Vendor Account:</strong>
                        <br />
                        Email: vendor@example.com
                        <br />
                        Password: Vendor123!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthTest;