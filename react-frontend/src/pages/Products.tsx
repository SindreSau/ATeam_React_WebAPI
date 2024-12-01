import {useAuthContext} from "../contexts/AuthContext";
import {AdminProductList} from "../components/products/AdminProductList";
import {VendorProductList} from "../components/products/VendorProductList";

const Products = () => {
    const {user} = useAuthContext();

    return (
        <>
            {user?.role === 'Admin' && (
                <AdminProductList/>
            )}
            {user?.role === 'Vendor' && (
                <VendorProductList/>
            )}
        </>
    );
};
export default Products;
