import {useAuthContext} from "../contexts/AuthContext";
import {AdminProductList} from "../components/AdminProductList";
import Spinner from "../components/Spinner";
import {VendorProductList} from "../components/VendorProductList";

const Products = () => {
    const {user, isLoading} = useAuthContext();

    return (
        <>
            {isLoading ? (
                <Spinner size={"md"} fullPage={true}/>
            ) : (
                // load admin or vendor products based on user.role
                <>
                    {user?.role === 'Admin' && (
                        <AdminProductList/>
                    )}
                    {user?.role === 'Vendor' && (
                        <VendorProductList />
                    )}
                </>
            )}
        </>
    );
};
export default Products;
