"use client";

import Categories from "src/layouts/Categories";
import Products from "src/layouts/Products";
import { Category } from "src/types/product";

export default function BaseDrawer({
  searchTerm,
  categorySlug,
  categories,
}: {
  searchTerm?: string;
  categorySlug?: string;
  categories?: Category[];
}) {
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
        data={categories}
      />
    </div>
  );
}
