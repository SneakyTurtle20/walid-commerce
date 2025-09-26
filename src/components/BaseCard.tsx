import { Product } from "../types/product";

function highlight(text: string, term?: string) {
  if (!term) return text;
  const parts = text.split(
    new RegExp(`(${"" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig")
  );
  return (
    <>
      {parts.map((part, idx) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={idx}>{part}</mark>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
}

export default function BaseCard({
  product,
  highlightTerm,
}: {
  product: Product;
  highlightTerm?: string;
}) {
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
        <h2 className="card-title gap-0">
          {highlight(product.title, highlightTerm)}
        </h2>
        <p className="line-clamp-3">
          {highlight(product.description, highlightTerm)}
        </p>
        <div className="card-actions justify-between items-center">
          <span className="font-semibold">${product.price}</span>
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
