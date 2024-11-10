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
                          }: PageSizeSelectorProps) => (
    <div className="d-flex align-items-center">
        <label className="me-2">Show entries:</label>
        <select
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Select number of entries per page"
        >
            {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
            ))}
        </select>
        <span className="ms-3">
      Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{' '}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
    </span>
    </div>
);

export default PageSizeSelector;