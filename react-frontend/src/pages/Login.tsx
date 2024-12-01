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
    const [wasSubmitted, setWasSubmitted] = useState(false);

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
        setWasSubmitted(true);
        setError(null);

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
                <div className="col-md-8 col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Login</h2>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}
                                  noValidate> {/* Added noValidate to handle our own validation */}
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
                                            <label htmlFor="email">Email address</label>
                                        </div>
                                    </div>
                                    {wasSubmitted && emailError && (
                                        <div
                                            className="invalid-feedback d-block"> {/* Added d-block to force display */}
                                            {emailError}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <div className="form-floating">
                                        <input
                                            type="password"
                                            className={`form-control ${wasSubmitted && passwordError ? 'is-invalid' : ''}`}
                                            id="password"
                                            placeholder='password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete="current-password"
                                            disabled={isSubmitting}
                                        />
                                        <label htmlFor="password">Password</label>
                                    </div>
                                    {wasSubmitted && passwordError && (
                                        <div
                                            className="invalid-feedback d-block"> {/* Added d-block to force display */}
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