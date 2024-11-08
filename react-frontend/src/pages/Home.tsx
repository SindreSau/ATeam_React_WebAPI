import {Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";

const Home = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="container mx-auto mt-10">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-4xl font-bold mb-6">Welcome to Food App</h1>

            {isAuthenticated ? (
                <>
                    {user?.role === 'Admin' && (
                        <div className="mb-4">
                            <p className="mb-2">You are signed in as an administrator.</p>
                            <Link
                                to="/admin/dashboard"
                                className="btn btn-primary"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    )}
                    {user?.role === 'Vendor' && (
                        <div className="mb-4">
                            <p className="mb-2">Welcome back, vendor!</p>
                            <Link
                                to="/vendor/products"
                                className="btn btn-primary"
                            >
                                Manage Your Products
                            </Link>
                        </div>
                    )}
                </>
            ) : (
                <div className="mb-4">
                    <p className="mb-2">Please sign in to access the application.</p>
                    <Link
                        to="/login"
                        className="btn btn-primary"
                    >
                        Sign In
                    </Link>
                </div>
            )}

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
