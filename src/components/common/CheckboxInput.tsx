type CheckboxInputProps = {
  id: string;
  name?: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  id,
  name = "",
  label,
  checked,
  onChange,
}) => {
  return (
    <div className="checkbox-container">
      <input
        type="checkbox"
        id={id}
        name={name}
        className="checkbox-input"
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default CheckboxInput;
