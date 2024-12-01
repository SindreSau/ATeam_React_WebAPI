// ProductSort.tsx
import { Select } from '../common/Select';

interface ProductSortProps {
    value: string;
    onChange: (value: string) => void;
}

export function ProductSort({ value, onChange }: ProductSortProps) {
    const sortOptions = [
        { value: 'createdat', label: 'Sort by Date (Asc)' },
        { value: 'createdat_desc', label: 'Sort by Date (Desc)' },
        { value: 'category', label: 'Sort by Category (Asc)' },
        { value: 'category_desc', label: 'Sort by Category (Desc)' },
        { value: 'productname', label: 'Sort by Name (Asc)' },
        { value: 'productname_desc', label: 'Sort by Name (Desc)' },
    ];

    return (
        <Select
            options={sortOptions}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}