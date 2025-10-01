import BaseNavbarSearch from "../components/BaseNavbarSearch";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchCategories, fetchProducts, fetchProductDetails } from "../query/api";
import BaseDrawer from "src/components/BaseDrawer";
import ProductDetails from "src/layouts/ProductDetails";

export default async function Home({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    sortBy?: string;
    order?: string;
    page?: string;
    productId?: string;
  };
}) {
  const queryClient = new QueryClient();
  const { q, category, sortBy, order, page, productId } = await searchParams;
  const searchTerm = typeof q === "string" ? q : undefined;
  const categorySlug = typeof category === "string" ? category : undefined;
  const sortByParam = typeof sortBy === "string" ? sortBy : undefined;
  const orderParam =
    typeof order === "string" ? (order as "asc" | "desc") : undefined;
  const pageParam = typeof page === "string" ? Math.max(1, parseInt(page, 10) || 1) : 1;
  const limitParam = 10;
  const productIdNum = typeof productId === "string" ? parseInt(productId, 10) : undefined;
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
  if (productIdNum && Number.isFinite(productIdNum)) {
    await queryClient.prefetchQuery({
      queryKey: ["product", productIdNum],
      queryFn: () => fetchProductDetails(productIdNum),
    });
  }
  const categories = await fetchCategories();
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <BaseNavbarSearch hideControls={Boolean(productIdNum)} />
      {productIdNum ? (
        <ProductDetails />
      ) : (
        <BaseDrawer searchTerm={searchTerm} categorySlug={categorySlug} categories={categories} />
      )}
    </HydrationBoundary>
  );
}
