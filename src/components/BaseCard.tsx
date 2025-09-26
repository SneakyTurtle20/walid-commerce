import { Product } from "../types/product";

export default function BaseCard({ product }: { product: Product }) {
  return (
    <div key={product.id} className="card bg-base-100 w-60 shadow-sm">
      <figure>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-30 w-full object-cover"
          loading="lazy"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.title}</h2>
        <p className="line-clamp-3">{product.description}</p>
        <div className="card-actions justify-between items-center">
          <span className="font-semibold">${product.price}</span>
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
