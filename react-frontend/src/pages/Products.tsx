import {useAuthContext} from "../contexts/AuthContext";

const Products = () => {
    const { user, isLoading } = useAuthContext();

    return (
        <div className="">
            <h1 className="">Products</h1>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                // load admin or vendor products based on user.role
                <>
                    {user?.role === 'Admin' && (
                        <div className="">
                            <p className="">You are signed in as an administrator.</p>
                            <span>Render ADMIN component here</span>
                        </div>
                    )}
                    {user?.role === 'Vendor' && (
                        <div className="">
                            <p className="">Welcome back, vendor!</p>
                            <span>Render VENDOR component here</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
export default Products;
