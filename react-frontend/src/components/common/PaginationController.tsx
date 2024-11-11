import {PageSizeSelector} from "./PageSizeSelector";
import {memo} from "react";


interface PaginationProps {
    /** Current active page number */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Number of items to display per page */
    pageSize: number;
    /** Total number of items across all pages */
    totalItems: number;
    /** Callback when page number changes */
    onPageChange: (page: number) => void;
    /** Callback when page size changes */
    onPageSizeChange: (pageSize: number) => void;
    /** Available options for items per page */
    pageSizeOptions?: number[];
    /** Maximum number of page buttons to show */
    maxVisiblePages?: number;
}

/**
 * PaginationController component for handling pagination controls.
 * This component takes use of the other component: PageSizeSelector.
 *
 * @param {number} currentPage - Current active page number.
 * @param {number} totalPages - Total number of pages.
 * @param {number} pageSize - Number of items to display per page.
 * @param {number} totalItems - Total number of items across all pages.
 * @param {function} onPageChange - Callback when page number changes.
 * @param {function} onPageSizeChange - Callback when page size changes.
 * @param {number[]} [pageSizeOptions=[2, 6, 9, 12]] - Available options for items per page.
 * @param {number} [maxVisiblePages=5] - Maximum number of page buttons to show.
 */
const PaginationController = memo(({
                                  currentPage,
                                  totalPages,
                                  pageSize,
                                  onPageChange,
                                  onPageSizeChange,
                                  pageSizeOptions = [2, 6, 9, 12],
                                  maxVisiblePages = 5,
                              }: PaginationProps) => {
    const getPageNumbers = (): (number | string)[] => {
        const range: (number | string)[] = [];
        const ellipsis = '...';

        if (totalPages <= maxVisiblePages) {
            return Array.from({length: totalPages}, (_, i) => i + 1);
        }

        // Always show first page
        range.push(1);

        // Calculate middle range
        const leftBound = Math.max(2, currentPage - 1);
        const rightBound = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis if needed on left side
        if (leftBound > 2) range.push(ellipsis);

        // Add middle pages
        for (let i = leftBound; i <= rightBound; i++) {
            range.push(i);
        }

        // Add ellipsis if needed on right side
        if (rightBound < totalPages - 1) range.push(ellipsis);

        // Always show last page
        range.push(totalPages);

        return range;
    };

    const renderPageButton = (
        page: number | string,
        index: number,
        isActive = false,
        isDisabled = false,
        label?: string
    ) => (
        <li key={index} className={`page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
            <button
                className="page-link"
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={isDisabled}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
            >
                {page}
            </button>
        </li>
    );

    return (
        <div className="d-flex justify-content-between align-items-center mt-4">
            <PageSizeSelector
                currentSize={pageSize}
                selectOptions={pageSizeOptions}
                onChange={onPageSizeChange}
            />

            <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                    {/* First Page */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            aria-label="Go to first page"
                        >
                            <i className="fas fa-angle-double-left" aria-hidden="true"></i>
                        </button>
                    </li>

                    {/* Previous Page */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Go to previous page"
                        >
                            <i className="fas fa-angle-left" aria-hidden="true"></i>
                        </button>
                    </li>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) =>
                        renderPageButton(
                            page,
                            index,
                            page === currentPage,
                            page === '...',
                            typeof page === 'number' ? `Go to page ${page}` : undefined
                        )
                    )}

                    {/* Next Page */}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Go to next page"
                        >
                            <i className="fas fa-angle-right" aria-hidden="true"></i>
                        </button>
                    </li>

                    {/* Last Page */}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            aria-label="Go to last page"
                        >
                            <i className="fas fa-angle-double-right" aria-hidden="true"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
});

PaginationController.displayName = 'PaginationController';

export default PaginationController;