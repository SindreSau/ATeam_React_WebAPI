// src/pages/Login.tsx
import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuthContext} from '../contexts/AuthContext';
import Spinner from '../components/common/Spinner';

const Login: React.FC = () => {
    const {login} = useAuthContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Field-specific errors
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError(null);
        return true;
    };

    const validatePassword = (password: string) => {
        if (!password) {
            setPasswordError('Password is required');
            return false;
        }
        setPasswordError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setEmailError(null);
        setPasswordError(null);

        // Validate all fields
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            // Handle specific error messages from the server if available
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6"> {/* Made wider to match register form */}
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Login</h2>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                        id="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            validateEmail(e.target.value);
                                        }}
                                        required
                                        autoComplete="email"
                                        disabled={isSubmitting}
                                    />
                                    {emailError && (
                                        <div className="invalid-feedback">
                                            {emailError}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                        id="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            validatePassword(e.target.value);
                                        }}
                                        required
                                        autoComplete="current-password"
                                        disabled={isSubmitting}
                                    />
                                    {passwordError && (
                                        <div className="invalid-feedback">
                                            {passwordError}
                                        </div>
                                    )}
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span>
                                                <Spinner size="sm"/> Logging in...
                                            </span>
                                        ) : (
                                            'Login'
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-3">
                                <span>Don't have an account? </span>
                                <Link to="/register">Register</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;