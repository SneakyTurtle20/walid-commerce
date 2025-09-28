import { SelectOption } from "src/types/common";

export default function BaseSelect({
  selectOptions,
}: {
  selectOptions: SelectOption[];
}) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <span className="">Sort by</span>
      <select defaultValue={""} className="select flex-1">
        {selectOptions.map((selectOption: SelectOption) => (
          <option key={selectOption.value} value={selectOption.value}>
            {selectOption.label}
          </option>
        ))}
      </select>
    </div>
  );
}
