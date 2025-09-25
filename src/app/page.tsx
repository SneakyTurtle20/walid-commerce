import BaseCard from "../app/components/BaseCard";
import { dehydrate, QueryClient } from "@tanstack/react-query";

async function fetchProducts() {
  // Fetch data on the server
  const res = await fetch("https://dummyjson.com/products");
  return res.json();
}

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const dehydratedState = dehydrate(queryClient);
  return <BaseCard initialData={dehydratedState} />;
}
