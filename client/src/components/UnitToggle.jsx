import React from "react";

export default function UnitToggle({ units, onChange }) {
  const toggle = (u) => () => onChange(u);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Units</span>
      <div
        role="group"
        aria-label="Units"
        className="flex rounded overflow-hidden border border-gray-300 dark:border-gray-600 w-max"
      >
        <button
          type="button"
          onClick={toggle("metric")}
          className={`px-3 py-1 text-sm ${
            units === "metric"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          Metric
        </button>
        <button
          type="button"
          onClick={toggle("imperial")}
          className={`px-3 py-1 text-sm ${
            units === "imperial"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          Imperial
        </button>
      </div>
    </div>
  );
}
