import { CategoryTable } from "../components/category/CategoryTable";
import { useCategoryList } from "../hooks/useCategoryList";

const Categories = () => {
    const { data: { items: categories } = { items: [] } } = useCategoryList();

    return (
        <>
            <h1>Categories</h1>
            <CategoryTable categories={categories ?? []} />
        </>
    );
};
export default Categories;
