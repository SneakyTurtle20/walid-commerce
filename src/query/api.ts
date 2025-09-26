export async function fetchProducts(searchTerm?: string) {
  const url = searchTerm && searchTerm.trim().length > 0
    ? `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}&limit=10`
    : "https://dummyjson.com/products?limit=10";
  const response = await fetch(url);
  return response.json();
}
