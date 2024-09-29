import Input, { InputProps } from "./Input";

const PasswordInput: React.FC<Omit<InputProps, "type">> = (props) => {
  return <Input type="password" {...props} />;
};

export default PasswordInput;
