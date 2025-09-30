"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BasePagination({ total, page, limit }: { total: number; page: number; limit: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 10)));

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/");
  };

  const pages = useMemo(() => {
    const maxButtons = 7;
    const result: (number | "ellipsis")[] = [];
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
      return result;
    }
    const windowSize = 2;
    const start = Math.max(2, page - windowSize);
    const end = Math.min(totalPages - 1, page + windowSize);
    result.push(1);
    if (start > 2) result.push("ellipsis");
    for (let i = start; i <= end; i++) result.push(i);
    if (end < totalPages - 1) result.push("ellipsis");
    result.push(totalPages);
    return result;
  }, [page, totalPages]);

  return (
    <div className="join">
      <button className="join-item btn" disabled={page <= 1} onClick={() => goToPage(1)}>
        «
      </button>
      {pages.map((p, idx) =>
        p === "ellipsis" ? (
          <button key={`e${idx}`} className="join-item btn btn-disabled">…</button>
        ) : (
          <button
            key={p}
            className={`join-item btn ${p === page ? "btn-active" : ""}`}
            onClick={() => goToPage(p as number)}
          >
            {p}
          </button>
        )
      )}
      <button className="join-item btn" disabled={page >= totalPages} onClick={() => goToPage(totalPages)}>
        »
      </button>
    </div>
  );
}
