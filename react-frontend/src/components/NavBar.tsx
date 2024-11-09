// src/components/NavBar.tsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import Spinner from "./Spinner";

const Navbar: React.FC = () => {
    const { isAuthenticated, user, isLoading, logout } = useAuthContext();
    const navigate = useNavigate();
    const [theme, setTheme] = useState<'light' | 'dark'>(
        localStorage.getItem('theme') as 'light' | 'dark' || 'light'
    );

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        setTheme(savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login'); // Redirect to login after logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header>
            <nav className="navbar navbar-expand-sm border-bottom py-2">
                <div className="container-md container-fluid">
                    <NavLink to="/" className="navbar-brand d-flex align-items-center">
                        <img
                            src="/assets/images/nokkellhulllogo.svg"
                            alt="Nøkkelhollet"
                            className="me-2"
                            style={{ height: '40px', width: 'auto' }}
                        />
                    </NavLink>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <NavLink to="/" className={({ isActive }) =>
                                    `nav-link mx-4${isActive ? ' active' : ''}`
                                }>
                                    Home
                                </NavLink>
                            </li>
                            {/* Add protected navigation items */}
                            {isAuthenticated && (
                                <li className="nav-item">
                                    <NavLink
                                        to="/products"
                                        className={({ isActive }) =>
                                            `nav-link mx-4${isActive ? ' active' : ''}`
                                        }
                                    >
                                        Products
                                    </NavLink>
                                </li>
                            )}
                        </ul>

                        <div className="nav-item mx-2">
                            <button className="btn px-2" onClick={toggleTheme}>
                                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} theme-icon-transition`} />
                            </button>
                        </div>

                        <ul className="navbar-nav">
                            {isLoading ? (
                                <li className="nav-item">
                                    <Spinner size="sm"/>
                                </li>
                            ) : isAuthenticated ? (
                                <>
                                    <li className="nav-item">
                                    <span className="nav-link">
                                        Welcome, {user?.email}
                                    </span>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            onClick={handleLogout}
                                            className="btn btn-link nav-link"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/register" className="nav-link">
                                            Register
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/login" className="nav-link">
                                            Login
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
);
};

export default Navbar;