import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Calculate page range to display
  const getPageRange = () => {
    const range = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Always include first and last page
      // Show pages around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      range.push(1);

      // Add ellipsis if there's a gap
      if (startPage > 2) {
        range.push(null);
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }

      // Add ellipsis if there's a gap
      if (endPage < totalPages - 1) {
        range.push(null);
      }

      range.push(totalPages);
    }

    return range;
  };

  // Create page buttons
  const pageRange = getPageRange();

  return (
    <div className="flex items-center justify-center mt-6 space-x-1">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        aria-label="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pageRange.map((page, index) =>
        page === null ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        aria-label="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
}
