import { useLocation, useNavigate } from "react-router-dom";
import {
  faHouse,
  faFilePen,
  faFileCirclePlus,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useLogoutMutation } from "../../app/api/authApiSlice";
import { useAuth } from "../../hooks";
import { Logo, IconButton } from "../common";

const DashHeader: React.FC = () => {
  const [logout] = useLogoutMutation();
  const { isAdminOrManager } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handelLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const isOnDashboard = pathname === "/dash";
  const isOnNotesPage = pathname === "/dash/notes";
  const isOnUsersPage = pathname === "/dash/users";

  return (
    <header className="flex-between header-container">
      <Logo to="/dash" />

      <nav className="header-nav">
        {!isOnDashboard && (
          <IconButton
            icon={faHouse}
            title="Home"
            onClick={() => navigate("/dash")}
          />
        )}

        {!isOnNotesPage && (
          <IconButton
            icon={faFilePen}
            title="Notes"
            onClick={() => navigate("/dash/notes")}
          />
        )}

        {isAdminOrManager && isOnNotesPage && (
          <IconButton
            icon={faFileCirclePlus}
            title="Create note"
            onClick={() => navigate("/dash/notes/create")}
          />
        )}

        {isAdminOrManager && !isOnUsersPage && (
          <IconButton
            icon={faUserGear}
            title="Users"
            onClick={() => navigate("/dash/users")}
          />
        )}

        {isAdminOrManager && isOnUsersPage && (
          <IconButton
            icon={faUserPlus}
            title="Create user"
            onClick={() => navigate("/dash/users/create")}
          />
        )}

        <IconButton
          icon={faRightFromBracket}
          title="Logout"
          onClick={handelLogout}
        />
      </nav>
    </header>
  );
};

export default DashHeader;
