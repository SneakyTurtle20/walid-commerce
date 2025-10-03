"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchProductDetails } from "src/query/api";
import { Review } from "src/types/product";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string, 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductDetails(productId),
    enabled: Number.isFinite(productId) && productId > 0,
  });

  if (!productId || !Number.isFinite(productId)) return null;
  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Product not found</div>;

  const goBack = () => {
    router.push("/");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button className="btn mb-4" onClick={goBack}>
        ← Back
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative w-full aspect-square">
          <Image
            src={data.thumbnail}
            alt={data.title}
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
          <p className="mb-4 text-sm opacity-80">{data.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xl font-semibold">${data.price}</span>
            {typeof data.rating !== "undefined" && (
              <span className="badge badge-secondary">
                Rating: {data.rating}
              </span>
            )}
            {typeof data.brand === "string" && (
              <span className="badge">{data.brand}</span>
            )}
          </div>
          {Array.isArray(data.images) && data.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {data.images.slice(0, 8).map((src: string, idx: number) => (
                <div key={idx} className="relative w-full aspect-square">
                  <Image
                    src={src}
                    alt={`${data.title} - Image ${idx + 1}`}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {data.reviews.length === 0 && (
        <div className="mt-10">No reviews yet.</div>
      )}
      {Array.isArray(data.reviews) && data.reviews.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Reviews ({data.reviews.length})
          </h2>
          <div className="space-y-3">
            {data.reviews.slice(0, 10).map((rev: Review, idx: number) => {
              const initials = (rev.reviewerName || "Anonymous")
                .split(" ")
                .map((s: string) => s[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const rating = Number.isFinite(rev.rating)
                ? Math.max(0, Math.min(5, Number(rev.rating)))
                : 0;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-base-300 bg-base-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-9">
                            <span className="text-xs p-2">{initials}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium leading-tight">
                            {rev.reviewerName ?? "Anonymous"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-outline">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="divider my-3" />
                    <p className="text-sm leading-relaxed">{rev.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
