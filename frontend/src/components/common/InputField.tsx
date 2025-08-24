type InputProps = {
  label: string;
  type?: string;
  value: string | number;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const InputField: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  placeholder,
  onChange,
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 text-gray-700">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
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
      />
    </div>
  );
};

export default InputField;
