export async function fetchProducts() {
  const response = await fetch("https://dummyjson.com/products?limit=10");
  return response.json();
}
