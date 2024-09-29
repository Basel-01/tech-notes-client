import { useState } from "react";
import { IconButton } from "../common";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export type InputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
};

const Input: React.FC<InputProps> = ({ label, id, value, onChange, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="input-container">
      <label htmlFor={id}>{label}</label>
      <div className="input-field">
        <input
          type={inputType}
          id={id}
          className="text-input"
          value={value}
          onChange={onChange}
        />
        {type === "password" && (
          <IconButton
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword((prev) => !prev)}
            title={showPassword ? "Hide password" : "Show password"}
          />
        )}
      </div>
    </div>
  );
};

export default Input;
