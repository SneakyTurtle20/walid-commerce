"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import BasePagination from "../components/BasePagination";
import BaseCard from "../components/BaseCard";
import { fetchProducts } from "../query/api";
import { Product } from "../types/product";
import BaseSkeleton from "src/components/BaseSkeleton";

export default function Products({
  searchTerm = "",
  categorySlug,
}: {
  searchTerm?: string;
  categorySlug?: string;
}) {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy") ?? "";
  const order = searchParams.get("order") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10) || 1;
  const limit = 10;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "products",
      searchTerm,
      categorySlug ?? "",
      sortBy,
      order,
      page,
      limit,
    ],
    queryFn: () =>
      fetchProducts(
        searchTerm,
        categorySlug,
        sortBy || undefined,
        (order as "asc" | "desc") || undefined,
        page,
        limit
      ),
  });

  if (isLoading) return <BaseSkeleton />;
  if (isError) return <div>Error: {error?.message}</div>;

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p: Product) => (
          <BaseCard key={p.id} product={p} />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <BasePagination total={total} page={page} limit={limit} />
      </div>
    </>
  );
}
