import BaseNavbarSearch from "../components/BaseNavbarSearch";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Products from "../layouts/Products";
import { fetchProducts } from "../query/api";

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const queryClient = new QueryClient();
  const searchTerm = typeof searchParams?.q === "string" ? searchParams.q : undefined;
  await queryClient.prefetchQuery({
    queryKey: ["products", searchTerm ?? ""],
    queryFn: () => fetchProducts(searchTerm),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <BaseNavbarSearch />
      <div className="p-8">
        <Products searchTerm={searchTerm ?? ""} />
      </div>
    </HydrationBoundary>
  );
}
