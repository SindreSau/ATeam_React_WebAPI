// src/pages/Register.tsx
import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuthContext} from '../contexts/AuthContext';
import Spinner from '../components/common/Spinner';

const Register: React.FC = () => {
    const {register, login} = useAuthContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

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

    const isValidPassword = (password: string) => {
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character');
            return false;
        }

        setPasswordError(null);
        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setEmailError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);

        // Validate all fields
        let isValid = validateEmail(email);

        if (!isValidPassword(password)) {
            isValid = false;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords don't match");
            isValid = false;
        }

        if (!isValid) return;

        setIsSubmitting(true);

        try {
            // First register the user
            await register(email, password);

            // Then immediately log them in with the same credentials
            await login(email, password);

            // Now navigate after successful login
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
            console.error('Registration error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

// Update the JSX to show field-specific errors and make the form wider
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6"> {/* Updated width here */}
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Register</h2>

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
                                            if (e.target.value.length < 6) {
                                                setPasswordError('Password must be at least 6 characters long');
                                            } else {
                                                setPasswordError(null);
                                            }
                                        }}
                                        required
                                        autoComplete="new-password"
                                        disabled={isSubmitting}
                                    />
                                    {passwordError && (
                                        <div className="invalid-feedback">
                                            {passwordError}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (e.target.value !== password) {
                                                setConfirmPasswordError("Passwords don't match");
                                            } else {
                                                setConfirmPasswordError(null);
                                            }
                                        }}
                                        required
                                        autoComplete="new-password"
                                        disabled={isSubmitting}
                                    />
                                    {confirmPasswordError && (
                                        <div className="invalid-feedback">
                                            {confirmPasswordError}
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
                                                <Spinner size="sm"/> Creating Account...
                                            </span>
                                        ) : (
                                            'Register'
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-3">
                                <span>
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-primary text-decoration-none"
                                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                            e.preventDefault();
                                            navigate('/login');
                                        }}
                                    >
                                        Login here
                                    </Link>
                            </span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;