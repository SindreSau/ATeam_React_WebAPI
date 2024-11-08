import React, {useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NokkelhullLogo from './NokkelhullLogo';

interface NavItem {
    path: string;
    title: string;
    roleRequired?: string[];
    className?: string;
}

const navLinks: NavItem[] = [
    {
        path: '/',
        title: 'Home',
        className: 'mx-4'
    },
    {
        path: '/admin',
        title: 'Products',
        roleRequired: ['Admin']
    },
    {
        path: '/vendor',
        title: 'Products',
        roleRequired: ['Vendor']
    }
];

const authLinks: NavItem[] = [
    {
        path: '/account',
        title: 'Account'
    },
    {
        path: '/logout',
        title: 'Logout'
    }
];

const guestLinks: NavItem[] = [
    {
        path: '/register',
        title: 'Register'
    },
    {
        path: '/login',
        title: 'Login'
    }
];

const NavBar: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [theme, setTheme] = useState<'light' | 'dark'>(
        localStorage.getItem('theme') as 'light' | 'dark' || 'light'
    );

    // Initialize theme on component mount
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

    const renderNavLink = (item: NavItem) => {
        if (item.roleRequired && (!user?.role || !item.roleRequired.includes(user.role))) {
            return null;
        }

        return (
            <li className="nav-item" key={item.path}>
                <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                        `nav-link${isActive ? ' active' : ''}${item.className ? ` ${item.className}` : ''}`
                    }
                >
                    {item.title}
                </NavLink>
            </li>
        );
    };

    return (
        <header>
            <nav className="navbar navbar-expand-sm border-bottom py-2">
                <div className="container-md container-fluid">
                    <NavLink to="/" className="navbar-brand d-flex align-items-center">
                        <NokkelhullLogo />
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
                            {navLinks.map(renderNavLink)}
                        </ul>

                        <div className="nav-item mx-2">
                            <button className="btn px-2" onClick={toggleTheme}>
                                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} theme-icon-transition`} />
                            </button>
                        </div>

                        <ul className="navbar-nav">
                            {isAuthenticated ? (
                                <>
                                    {authLinks.map(renderNavLink)}
                                    <li className="nav-item">
                                        <button
                                            onClick={() => {/* Add logout handler */}}
                                            className="nav-link btn btn-link"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {guestLinks.map(renderNavLink)}
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;