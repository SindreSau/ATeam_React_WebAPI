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
    const [wasSubmitted, setWasSubmitted] = useState(false);

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
        setWasSubmitted(true);
        setError(null);

        // Validate all fields
        const isEmailValid = validateEmail(email);
        const isPasswordValid = isValidPassword(password);
        let isConfirmPasswordValid = true;

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords don't match");
            isConfirmPasswordValid = false;
        } else {
            setConfirmPasswordError(null);
        }

        if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        setIsSubmitting(true);

        try {
            await register(email, password);
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
            console.error('Registration error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Register</h2>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text">@</span>
                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className={`form-control ${wasSubmitted && emailError ? 'is-invalid' : ''}`}
                                                id="email"
                                                placeholder='email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                autoComplete="email"
                                                disabled={isSubmitting}
                                            />
                                            <label htmlFor='email'>Email address</label>
                                        </div>
                                    </div>
                                    {wasSubmitted && emailError && (
                                        <div className="invalid-feedback d-block">
                                            {emailError}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <div className="form-floating">
                                        <input
                                            type="password"
                                            className={`form-control ${wasSubmitted && passwordError ? 'is-invalid' : ''}`}
                                            id="password"
                                            placeholder='password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete="new-password"
                                            disabled={isSubmitting}
                                        />
                                        <label htmlFor='password'>Password</label>
                                    </div>
                                    {wasSubmitted && passwordError && (
                                        <div className="invalid-feedback d-block">
                                            {passwordError}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <div className="form-floating">
                                        <input
                                            type="password"
                                            className={`form-control ${wasSubmitted && confirmPasswordError ? 'is-invalid' : ''}`}
                                            id="confirmPassword"
                                            placeholder='password'
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            autoComplete="new-password"
                                            disabled={isSubmitting}
                                        />
                                        <label htmlFor="confirmPassword">Confirm password</label>
                                    </div>
                                    {wasSubmitted && confirmPasswordError && (
                                        <div className="invalid-feedback d-block">
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
                                <span>Already have an account? </span>
                                <Link to="/login">Login here</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;