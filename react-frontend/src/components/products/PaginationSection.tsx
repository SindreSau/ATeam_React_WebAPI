// src/components/products/PaginationSection.tsx
import { memo } from 'react';
import PaginationController from '../common/PaginationController';

interface PaginationSectionProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    pageSizeOptions: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export const PaginationSection = memo(function PaginationSection({
                                                                     currentPage,
                                                                     totalPages,
                                                                     pageSize,
                                                                     totalCount,
                                                                     pageSizeOptions,
                                                                     onPageChange,
                                                                     onPageSizeChange
                                                                 }: PaginationSectionProps) {
    return (
        <div className="d-flex justify-content-between align-items-center mt-4">
            <PaginationController
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalCount}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                pageSizeOptions={pageSizeOptions}
            />
            <div className="text-muted">
                Total items: {totalCount}
            </div>
        </div>
    );
});