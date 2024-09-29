import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks";
import { RolesValues } from "../../config/ROLES";

type RequireAuthProps = {
  allowedRoles: RolesValues[];
  to: string;
};

const RequireAuth: React.FC<RequireAuthProps> = ({
  allowedRoles = [],
  to = "/",
}) => {
  const { roles } = useAuth();

  return roles.some((role) => Object.values(allowedRoles).includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to={to} replace />
  );
};

export default RequireAuth;
