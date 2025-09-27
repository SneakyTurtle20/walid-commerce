"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Products from "src/layouts/Products";
import { fetchCategories } from "src/query/api";
import { Category } from "src/types/product";

export default function BaseDrawer({
  searchTerm,
  categorySlug,
}: {
  searchTerm?: string;
  categorySlug?: string;
}) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    
    if (categorySlug === slug) {
      router.push(params.toString() ? `/?${params.toString()}` : "/");
    } else {
      params.set("category", slug);
      router.push(`/?${params.toString()}`);
    }
  };
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="p-8">
          <Products searchTerm={searchTerm ?? ""} categorySlug={categorySlug} />
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 gap-2">
          {data &&
            data.map((category: Category) => (
              <label key={category.slug} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={categorySlug === category.slug}
                  onChange={() => handleCategoryClick(category.slug)}
                />
                {category.name}
              </label>
            ))}
        </ul>
      </div>
    </div>
  );
}
