// PageSizeSelector.tsx
import { Select } from './Select';

interface PageSizeSelectorProps {
    currentSize: number;
    selectOptions: number[];  // Changed from 'options' to 'selectOptions'
    onChange: (value: number) => void;
}

/**
 * PageSizeSelector component for selecting the number of items per page.
 * This component is being used in the PaginationController component.
 *
 * @param {number} currentSize - The current selected page size.
 * @param {number[]} selectOptions - The available options for page sizes.
 * @param {function} onChange - Callback function to handle page size change.
 */
export const PageSizeSelector = ({
                                     currentSize,
                                     selectOptions,
                                     onChange
                                 }: PageSizeSelectorProps) => {
    const pageSizeOptions = selectOptions.map(size => ({
        value: size,
        label: size.toString()
    }));

    return (
        <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Items per page:</span>
            <Select
                options={pageSizeOptions}
                value={currentSize}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{ width: 'auto' }}
            />
        </div>
    );
};