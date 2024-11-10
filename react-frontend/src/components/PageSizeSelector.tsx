interface PageSizeSelectorProps {
    pageSize: number;
    totalItems: number;
    currentPage: number;
    pageSizeOptions: number[];
    onPageSizeChange: (pageSize: number) => void;
}

const PageSizeSelector = ({
                              pageSize,
                              totalItems,
                              currentPage,
                              pageSizeOptions,
                              onPageSizeChange,
                          }: PageSizeSelectorProps) => {
    const start = Math.min((currentPage - 1) * pageSize + 1, totalItems);
    const end = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="d-flex align-items-center">
            <select
                className="form-select form-select-sm w-auto me-3"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                aria-label="Items per page"
            >
                {pageSizeOptions.map(size => (
                    <option key={size} value={size}>{size} per page</option>
                ))}
            </select>
            <span className="text-secondary">
                {start}-{end} of {totalItems}
            </span>
        </div>
    );
};

export default PageSizeSelector;