"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import BaseCard from "../components/BaseCard";
import { fetchProducts } from "../query/api";
import { Product } from "../types/product";

export default function Products({ searchTerm = "", categorySlug }: { searchTerm?: string; categorySlug?: string }) {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy") ?? "";
  const order = searchParams.get("order") ?? "";
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", searchTerm, categorySlug ?? "", sortBy, order],
    queryFn: () => fetchProducts(searchTerm, categorySlug, sortBy || undefined, (order as "asc" | "desc") || undefined),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const products = data?.products ?? [];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p: Product) => (
        <BaseCard key={p.id} product={p} />
      ))}
    </div>
  );
}
