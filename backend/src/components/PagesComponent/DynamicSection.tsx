import React from "react";
import { FiPlus } from "react-icons/fi";
import { RichTextField } from "./RichTextField";

interface DynamicSectionProps<T> {
  label: string;
  items: T[];
  fieldNames: { title: keyof T; content: keyof T };
  placeholders: { title: string; content: string };
  onAdd: () => void;
  onChange: (index: number, field: keyof T, value: string) => void;
  onRemove: (index: number) => void;
}

export function DynamicSection<T extends Record<string, string>>({
  label,
  items,
  fieldNames,
  placeholders,
  onAdd,
  onChange,
  onRemove,
}: DynamicSectionProps<T>) {
  const singularLabel =
    typeof label === "string" ? label.replace(/s$/, "") : "";

  return (
    <div className="p-4 rounded-lg bg-gray-50 space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">{label}</h2>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center text-blue-600 hover:underline"
        >
          <FiPlus className="mr-1" /> Add {singularLabel}
        </button>
      </div>

      {items && items.length > 0 ? (
        items.map((item, index) => (
          <RichTextField
            key={index}
            index={index}
            data={item}
            fieldNames={fieldNames}
            placeholders={placeholders}
            onChange={onChange}
            onRemove={onRemove}
          />
        ))
      ) : (
        <p className="text-gray-500 text-sm">
          No {typeof label === "string" ? label.toLowerCase() : ""} added yet.
        </p>
      )}
    </div>
  );
}
