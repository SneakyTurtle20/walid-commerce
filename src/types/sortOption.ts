import { SelectOption } from "./common";

export const SortSelectOption: SelectOption[] = [
  { label: "Alphabetically A-Z", value: "title-asc" },
  { label: "Alphabetically Z-A", value: "title-desc" },
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Date, old to new", value: "createdAt-asc" },
  { label: "Date, new to old", value: "createdAt-desc" },
];
