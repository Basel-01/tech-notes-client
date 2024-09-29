export type SelectInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  hiddenOption?: string;
};

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  id,
  value,
  onChange,
  options,
  hiddenOption,
}) => {
  return (
    <div className="input-container">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        className="select-input"
        onChange={onChange}
      >
        {hiddenOption && <option hidden>{hiddenOption}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
