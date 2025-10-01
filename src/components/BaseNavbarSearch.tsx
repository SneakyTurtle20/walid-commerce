"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BaseSelect from "./BaseSelect";
import { SortSelectOption } from "src/types/sortOption";

export default function BaseNavbarSearch({ hideControls = false }: { hideControls?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const handle = setTimeout(() => {
      const currentQ = searchParams.get("q") ?? "";
      if (currentQ === value) return;
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.delete("page");
      params.delete("sortBy");
      params.delete("order");
      params.delete("category");
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : "/");
    }, 400);
    return () => clearTimeout(handle);
  }, [value, router, searchParams]);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">W Commerce</a>
      </div>
      {!hideControls && (
        <div className="flex gap-2">
          <div className="join">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="text"
              placeholder="Search products..."
              className="input input-bordered join-item w-24 md:w-auto"
            />
          </div>
          <div className="join">
            <BaseSelect selectOptions={SortSelectOption} />
          </div>
        </div>
      )}
    </div>
  );
}
