import React from 'react';

export default function NumberField({
  id,
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  units,
  disabled = false,
  describedby,
  tooltip
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-200">
        {label}
        {tooltip && (
          <span className="ml-1 text-xs cursor-help" title={tooltip}>
            ⓘ
          </span>
        )}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) =>
            onChange(e.target.value === '' ? '' : parseFloat(e.target.value))
          }
          disabled={disabled}
          aria-describedby={describedby}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 disabled:opacity-50"
        />
        {units && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {units}
          </span>
        )}
      </div>
    </div>
  );
}
