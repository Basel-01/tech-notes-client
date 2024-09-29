import { Link } from "react-router-dom";

type ErrorMessageProps = {
  text: string;
  error?: any;
  linkText?: string;
  linkPath?: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  text,
  error,
  linkText,
  linkPath,
}) => {
  if (error?.data?.message) {
    console.error(error.data?.message);
  }

  return (
    <p className="error-message">
      * {text} {linkText && linkPath && <Link to={linkPath}>{linkText}</Link>}
    </p>
  );
};

export default ErrorMessage;
