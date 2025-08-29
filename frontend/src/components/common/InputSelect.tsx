import React from 'react';

// Props type definition
interface Option {
  value: string;
  label: string;
}

interface InputSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
}
const InputSelect = ({ label, value, onChange, options = [], required = false }: InputSelectProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 text-gray-700">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full
          px-4 py-2
          border border-gray-400
          rounded-lg
          shadow-sm
          focus:outline-none
          focus:ring-1
          focus:ring-sky-500
          focus:border-sky-500
          transition
          duration-200
          placeholder-gray-400
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSelect;
