"use client";

import { useQuery } from "@tanstack/react-query";
import Categories from "src/layouts/Categories";
import Products from "src/layouts/Products";
import { fetchCategories } from "src/query/api";
import BaseSkeleton from "./BaseSkeleton";

export default function BaseDrawer({
  searchTerm,
  categorySlug,
}: {
  searchTerm?: string;
  categorySlug?: string;
}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  if (isLoading) return <BaseSkeleton />;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="p-8">
          <Products searchTerm={searchTerm ?? ""} categorySlug={categorySlug} />
        </div>
      </div>
      <Categories
        categorySlug={categorySlug}
        searchTerm={searchTerm}
        data={data}
      />
    </div>
  );
}
