import { Link } from "react-router-dom";

type ErrorPage = { status: number; description: string };

const ErrorPage: React.FC<ErrorPage> = ({ status, description }) => {
  return (
    <div className="errorpage-container">
      <h1 className="errorpage-heading">{status}</h1>
      <p className="errorpage-description">{description}</p>
      <Link to="/dash" className="btn">
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
