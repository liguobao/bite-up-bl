import type { FC } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | 'ellipsis';

const buildPages = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: PageItem[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push('ellipsis');
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);
  return pages;
};

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  const pages = buildPages(currentPage, totalPages);

  return (
    <nav
      className="pagination"
      role="navigation"
      aria-label={`分页，共 ${totalPages} 页`}
    >
      <button
        type="button"
        className="pagination__control"
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="上一页"
      >
        上一页
      </button>
      <div className="pagination__pages">
        {pages.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="pagination__ellipsis" aria-hidden="true">
                …
              </span>
            );
          }

          const isCurrent = item === currentPage;
          return (
            <button
              key={item}
              type="button"
              className={`pagination__page${isCurrent ? ' pagination__page--current' : ''}`}
              onClick={() => handleChange(item)}
              aria-current={isCurrent ? 'page' : undefined}
              aria-label={`第 ${item} 页`}
            >
              {item}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="pagination__control"
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="下一页"
      >
        下一页
      </button>
    </nav>
  );
};

export default Pagination;
