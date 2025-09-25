"use client";

import { useQuery } from "@tanstack/react-query";

type Product = { id: number; title: string; description: string; price: number; thumbnail: string };

async function fetchProducts() {
  const response = await fetch("https://dummyjson.com/products");
  return response.json();
}

export default function BaseCard({ initialData }: { initialData: any }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialData: initialData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const products: Product[] = data?.products ?? [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <div key={p.id} className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <img src={p.thumbnail} alt={p.title} className="h-56 w-full object-cover" loading="lazy" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{p.title}</h2>
            <p className="line-clamp-3">{p.description}</p>
            <div className="card-actions justify-between items-center">
              <span className="font-semibold">${p.price}</span>
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}