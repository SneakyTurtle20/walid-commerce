import { Category, Product } from "src/types/product";
import { toast, Bounce } from "react-toastify";

type ProductsResponse = { products: Product[]; total?: number; skip?: number; limit?: number };

export async function fetchProducts(
  searchTerm?: string,
  categorySlug?: string,
  sortBy?: string,
  order?: "asc" | "desc",
  page?: number,
  limit: number = 10
): Promise<ProductsResponse> {
  let url =
    searchTerm && searchTerm.trim().length > 0
      ? `https://dummyjson.com/products/search?q=${encodeURIComponent(
          searchTerm
        )}&limit=${limit}`
      : categorySlug && categorySlug.trim().length > 0
      ? `https://dummyjson.com/products/category/${encodeURIComponent(
          categorySlug
        )}?limit=${limit}`
      : `https://dummyjson.com/products?limit=${limit}`;

  const hasQuery = url.includes("?");
  if (sortBy && order) {
    url += `${hasQuery ? "&" : "?"}sortBy=${encodeURIComponent(
      sortBy
    )}&order=${encodeURIComponent(order)}`;
  }

  const skip = Math.max(0, ((page ?? 1) - 1) * limit);
  url += `${hasQuery ? "&" : "?"}skip=${skip}`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (e) {
    toast.error("Products not found", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    return {
      products: [],
    };
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch("https://dummyjson.com/products/categories");
    return response.json();
  } catch (e) {
    toast.error("Categories not found", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    return [];
  }
}
