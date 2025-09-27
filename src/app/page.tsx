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
  searchParams: { q?: string; category?: string };
}) {
  const queryClient = new QueryClient();
  const { q, category } = await searchParams;
  const searchTerm = typeof q === "string" ? q : undefined;
  const categorySlug = typeof category === "string" ? category : undefined;
  await queryClient.prefetchQuery({
    queryKey: ["products", searchTerm ?? "", categorySlug ?? ""],
    queryFn: () => fetchProducts(searchTerm, categorySlug),
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
