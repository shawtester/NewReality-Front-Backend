"use client";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  // 👇 Desktop: 5 pages | Mobile: 3 pages
  const pageWindow =
    typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5;
  const half = Math.floor(pageWindow / 2);

  let startPage = Math.max(1, currentPage - half);
  let endPage = Math.min(totalPages, startPage + pageWindow - 1);

  if (endPage - startPage < pageWindow - 1) {
    startPage = Math.max(1, endPage - pageWindow + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex justify-center mt-10 px-2">
      <div className="flex items-center border rounded-md overflow-hidden text-xs sm:text-sm">
        {/* Previous */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="
            px-2 sm:px-4 py-2
            border-r bg-gray-100
            hover:bg-gray-200
            disabled:opacity-50
          "
        >
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              px-2 sm:px-4 py-2 border-r
              ${
                currentPage === page
                  ? "bg-orange-400 text-white font-semibold"
                  : "bg-white hover:bg-gray-100"
              }
            `}
          >
            {page}
          </button>
        ))}

        {/* Dots */}
        {endPage < totalPages && (
          <span className="px-2 sm:px-4 py-2 border-r bg-white">…</span>
        )}

        {/* Last Page */}
        {endPage < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            className={`
              px-2 sm:px-4 py-2 border-r
              ${
                currentPage === totalPages
                  ? "bg-orange-400 text-white font-semibold"
                  : "bg-white hover:bg-gray-100"
              }
            `}
          >
            {totalPages}
          </button>
        )}

        {/* Next */}
        <button
          onClick={() =>
            onPageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          className="
            px-2 sm:px-4 py-2
            bg-white hover:bg-gray-100
            disabled:opacity-50
          "
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
