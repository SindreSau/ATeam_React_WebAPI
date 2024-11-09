// src/components/Home.tsx

import {Link} from "react-router-dom";
import {useAuthContext} from "../contexts/AuthContext";
import React from "react";
import Spinner from "../components/Spinner";

const Home = () => {
    const { user, isLoading } = useAuthContext();

    if (isLoading) {
        return <Spinner fullPage />;
    }

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-4xl font-bold mb-6">Welcome to Food App</h1>

            {!user ?
                <div className="mb-4">
                    <p className="mb-2">Please sign in to access the application.</p>
                    <Link to="/login" className="btn btn-primary">
                        Sign In
                    </Link>
                </div>
                : (
                    <>
                        {user.role === 'Admin' &&
                            <div className="mb-4">
                                <p className="mb-2">You are signed in as an administrator.</p>
                            </div>
                        }
                        {user.role === 'Vendor' &&
                            <div className="mb-4">
                                <p className="mb-2">Welcome, vendor!</p>
                            </div>
                        }
                        <Link to="/products" className="btn btn-primary">
                            Manage Products
                        </Link>
                    </>
                )
            }

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">About Our Platform</h2>
                <p className="mb-4">
                    Our food management platform helps vendors manage their products and administrators
                    oversee the entire catalog. Features include:
                </p>
                <ul className="list-disc pl-5">
                    <li className="mb-2">For Vendors:</li>
                    <ul className="list-disc pl-5">
                        <li className="mb-2">Add and Manage Products</li>
                        <li className="mb-2">See if you qualify for Nøkkelhullet</li>
                        <li className="mb-2">Nutritional information tracking</li>
                    </ul>
                    <li className="mb-2">For Admins:</li>
                    <ul className="list-disc pl-5">
                        <li className="mb-2">Administrative oversight and category management</li>
                        <li className="mb-2">Nutritional information tracking</li>
                    </ul>
                </ul>
            </div>
        </div>
    );
};

export default Home;