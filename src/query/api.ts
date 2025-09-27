import { Category, Product } from "src/types/product";
import { toast, Bounce } from "react-toastify";

export async function fetchProducts(
  searchTerm?: string,
  categorySlug?: string
): Promise<{ products: [] }> {
  const url =
    searchTerm && searchTerm.trim().length > 0
      ? `https://dummyjson.com/products/search?q=${encodeURIComponent(
          searchTerm
        )}&limit=10`
      : categorySlug && categorySlug.trim().length > 0
      ? `https://dummyjson.com/products/category/${encodeURIComponent(
          categorySlug
        )}`
      : "https://dummyjson.com/products?limit=10";
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
