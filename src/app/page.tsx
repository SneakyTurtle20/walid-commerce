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
  };
}) {
  const queryClient = new QueryClient();
  const { q, category, sortBy, order } = await searchParams;
  const searchTerm = typeof q === "string" ? q : undefined;
  const categorySlug = typeof category === "string" ? category : undefined;
  const sortByParam = typeof sortBy === "string" ? sortBy : undefined;
  const orderParam =
    typeof order === "string" ? (order as "asc" | "desc") : undefined;
  await queryClient.prefetchQuery({
    queryKey: [
      "products",
      searchTerm ?? "",
      categorySlug ?? "",
      sortByParam ?? "",
      orderParam ?? "",
    ],
    queryFn: () =>
      fetchProducts(searchTerm, categorySlug, sortByParam, orderParam),
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
