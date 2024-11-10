import {useAuthContext} from "../contexts/AuthContext";
import {AdminProductList} from "../components/AdminProductList";

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
                            <AdminProductList />
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
