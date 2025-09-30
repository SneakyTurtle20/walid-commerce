import BaseNavbarSearch from "../components/BaseNavbarSearch";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchCategories, fetchProducts } from "../query/api";
import BaseDrawer from "src/components/BaseDrawer";

export default async function Home({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    sortBy?: string;
    order?: string;
    page?: string;
  };
}) {
  const queryClient = new QueryClient();
  const { q, category, sortBy, order, page } = await searchParams;
  const searchTerm = typeof q === "string" ? q : undefined;
  const categorySlug = typeof category === "string" ? category : undefined;
  const sortByParam = typeof sortBy === "string" ? sortBy : undefined;
  const orderParam =
    typeof order === "string" ? (order as "asc" | "desc") : undefined;
  const pageParam = typeof page === "string" ? Math.max(1, parseInt(page, 10) || 1) : 1;
  const limitParam = 10;
  await queryClient.prefetchQuery({
    queryKey: [
      "products",
      searchTerm ?? "",
      categorySlug ?? "",
      sortByParam ?? "",
      orderParam ?? "",
      pageParam,
      limitParam,
    ],
    queryFn: () =>
      fetchProducts(
        searchTerm,
        categorySlug,
        sortByParam,
        orderParam,
        pageParam,
        limitParam
      ),
  });
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <BaseNavbarSearch />
      <BaseDrawer searchTerm={searchTerm} categorySlug={categorySlug} />
    </HydrationBoundary>
  );
}
