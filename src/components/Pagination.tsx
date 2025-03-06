import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const navigate = useNavigate();

  const goToPage = (page: number) => {
    navigate(`?page=${page}`);
  };

  const getPaginationItems = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  return (
    <div className="flex space-x-2 mt-10 justify-center">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 w-10 h-10 flex justify-center items-center bg-[#f3f3f3] rounded-full disabled:opacity-50 hover:bg-[#000]/20"
      >
        <ChevronLeft />
      </button>

      {getPaginationItems().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => goToPage(page)}
            className={`p-3 w-10 h-10 flex justify-center items-center rounded-full ${
              page === currentPage
                ? "bg-[#000] text-[#fff]"
                : "bg-[#f3f3f3] text-[#000] hover:bg-[#000]/20"
            }`}
          >
            {page}
          </button>
        ) : (
          <span
            key={index}
            className="p-3 w-10 h-10 flex justify-center items-center text-[#000]"
          >
            ...
          </span>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-3 h-10 w-10 flex justify-center items-center bg-[#f3f3f3] rounded-full disabled:opacity-50 hover:bg-[#000]/20"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
