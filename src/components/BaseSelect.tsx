"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { SelectOption } from "src/types/common";

export default function BaseSelect({
  selectOptions,
}: {
  selectOptions: SelectOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortBy = searchParams.get("sortBy") ?? "";
  const order = searchParams.get("order") ?? "";

  const applyParams = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      applyParams({ sortBy: undefined, order: undefined });
      return;
    }
    const [by, direction] = value.split("-");
    applyParams({ sortBy: by, order: direction });
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <span>Sort by</span>
      <select
        value={sortBy && order ? `${sortBy}-${order}` : ""}
        onChange={handleChange}
        className="select flex-1"
      >
        <option value="">None</option>
        {selectOptions.map((selectOption: SelectOption) => (
          <option key={selectOption.value} value={String(selectOption.value)}>
            {selectOption.label}
          </option>
        ))}
      </select>
    </div>
  );
}
