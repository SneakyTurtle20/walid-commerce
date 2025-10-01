"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "../types/product";

export default function BaseCard({ product }: { product: Product }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToDetails = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("page");
    params.delete("category");
    params.delete("sortBy");
    params.delete("order");
    params.set("productId", String(product.id));
    router.push(`/?${params.toString()}`);
  };
  return (
    <div key={product.id} className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-60 w-full object-cover"
          loading="lazy"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title gap-0">{product.title}</h2>
        <p className="line-clamp-3">{product.description}</p>
        <div className="card-actions justify-between items-center">
          <span className="font-semibold">${product.price}</span>
          <button className="btn btn-primary" onClick={goToDetails}>
            See Details
          </button>
        </div>
      </div>
    </div>
  );
}
