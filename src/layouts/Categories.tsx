import { useRouter } from "next/navigation";
import { Category } from "src/types/product";

export default function Categories({
  data,
  searchTerm,
  categorySlug,
}: {
  data?: Category[];
  searchTerm?: string;
  categorySlug?: string;
}) {
  const router = useRouter();
  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);

    if (categorySlug === slug) {
      router.push(params.toString() ? `/?${params.toString()}` : "/");
    } else {
      params.set("category", slug);
      router.push(`/?${params.toString()}`);
    }
  };
  return (
    <div className="drawer-side">
      <label
        htmlFor="my-drawer-2"
        aria-label="close sidebar"
        className="drawer-overlay p-2"
      >
        Categories
      </label>
      <ul className="menu bg-white text-base-content min-h-full w-80 p-4 gap-2">
        {data && data.length === 0 && <div>No categories found.</div>}
        {data &&
          data.length > 0 &&
          data.map((category: Category) => (
            <label key={category.slug} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={categorySlug === category.slug}
                onChange={() => handleCategoryClick(category.slug)}
              />
              {category.name}
            </label>
          ))}
      </ul>
    </div>
  );
}
