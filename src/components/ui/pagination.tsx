type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

function getPageNumbers(current: number, total: number): Array<number | null> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: Array<number | null> = [1];

  if (current > 4) {
    pages.push(null);
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (current < total - 3) {
    pages.push(null);
  }

  pages.push(total);

  return pages;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(page, 1), safeTotal);
  const pages = getPageNumbers(safePage, safeTotal);

  return (
    <nav className="pagination" aria-label="페이지네이션">
      <button
        type="button"
        className="pagination__button"
        disabled={safePage === 1}
        onClick={() => onChange(safePage - 1)}
      >
        이전
      </button>

      {pages.map((item, index) =>
        item === null ? (
          <span key={`ellipsis-${index}`} className="pagination__ellipsis" aria-hidden="true">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`pagination__button${safePage === item ? " is-active" : ""}`}
            aria-current={safePage === item ? "page" : undefined}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className="pagination__button"
        disabled={safePage === safeTotal}
        onClick={() => onChange(safePage + 1)}
      >
        다음
      </button>
    </nav>
  );
}
