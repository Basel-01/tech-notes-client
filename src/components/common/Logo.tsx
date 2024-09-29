import { Link } from "react-router-dom";

type LogoProps = {
  to: string;
};

const Logo: React.FC<LogoProps> = ({ to }) => {
  return (
    <h1 className="logo">
      <Link to={to}>
        <img src="/assets/logo.png" alt="Logo" />
      </Link>
    </h1>
  );
};

export default Logo;
