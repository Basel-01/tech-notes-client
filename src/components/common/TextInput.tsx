import Input, { InputProps } from "./Input";

const TextInput: React.FC<Omit<InputProps, "type">> = (props) => {
  return <Input type="text" {...props} />;
};

export default TextInput;
