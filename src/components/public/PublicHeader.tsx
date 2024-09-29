import { useLocation, useNavigate } from "react-router-dom";
import { faHouse, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { Logo, IconButton } from "../common";

const PublicHeader: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isOnPublicPage = pathname === "/";
  const isOnLoginPage = pathname === "/login";

  return (
    <header className="flex-between header-container">
      <Logo to="/" />

      <nav className="header-nav">
        {!isOnPublicPage && (
          <IconButton
            icon={faHouse}
            title="Home"
            onClick={() => navigate("/")}
          />
        )}

        {!isOnLoginPage && (
          <IconButton
            icon={faRightToBracket}
            title="Login"
            onClick={() => navigate("/login")}
          />
        )}
      </nav>
    </header>
  );
};

export default PublicHeader;
