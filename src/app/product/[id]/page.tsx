import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchProductDetails } from "../../../query/api";
import ProductDetails from "src/layouts/ProductDetails";
import BaseNavbarSearch from "src/components/BaseNavbarSearch";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = new QueryClient();
  const productId = parseInt(params.id, 10);

  if (!Number.isFinite(productId)) {
    return <div>Invalid product ID</div>;
  }

  await queryClient.prefetchQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductDetails(productId),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <BaseNavbarSearch hideControls={true} />
      <ProductDetails />
    </HydrationBoundary>
  );
}
