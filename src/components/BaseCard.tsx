"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
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
    router.push(`/product/${product.id}`);
  };
  return (
    <div key={product.id} className="card bg-base-100 w-96 shadow-sm">
      <figure className="relative h-60 w-full">
        <Image
          src={product.thumbnail}
          alt={product.title}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 384px"
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
