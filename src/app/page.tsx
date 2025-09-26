import BaseNavbarSearch from "../components/BaseNavbarSearch";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Products from "layouts/Products";
import { fetchProducts } from "../query/api";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <BaseNavbarSearch />
      <div className="p-8">
        <Products />
      </div>
    </HydrationBoundary>
  );
}
