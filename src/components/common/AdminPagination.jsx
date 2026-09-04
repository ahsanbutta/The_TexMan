import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminPagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 15,
  onPageChange
}) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display with smart windowing
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 bg-white/50 rounded-2xl border border-gray-100/80">
      {/* Items Range Info */}
      <div className="text-xs text-gray-500 font-semibold">
        Showing <span className="text-[#090C11] font-bold">{startItem}</span> to{' '}
        <span className="text-[#090C11] font-bold">{endItem}</span> of{' '}
        <span className="text-[#090C11] font-bold">{totalItems}</span> results
      </div>

      {/* Page Navigation Buttons */}
      <div className="flex items-center space-x-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-gray-100 bg-white text-gray-500 hover:text-[#090C11] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          title="Previous Page"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numeric Page Buttons */}
        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 text-xs font-bold text-gray-400 select-none">
                ...
              </span>
            );
          }
          const isActive = currentPage === page;
          return (
            <button
              key={`page-${page}`}
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-[34px] h-[34px] text-xs font-black rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-brandGreen text-white shadow-md shadow-brandGreen/25'
                  : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50 hover:text-[#090C11]'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-gray-100 bg-white text-gray-500 hover:text-[#090C11] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          title="Next Page"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
