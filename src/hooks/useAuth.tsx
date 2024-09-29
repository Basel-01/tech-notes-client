import { jwtDecode } from "jwt-decode";
import { useAppSelector } from "../app/hooks";
import { selectCurrentToken } from "../app/slices/authSlice";
import { RolesValues } from "../config/ROLES";
import { getRolesData } from "../utils/helper";

type DecodedToken = {
  id: string;
  username: string;
  roles: RolesValues[];
  exp: number;
  iat: number;
};

const useAuth = () => {
  const token = useAppSelector(selectCurrentToken);

  if (token) {
    const decoded: DecodedToken = jwtDecode(token);

    const { id, username, roles } = decoded;

    const {
      role,
      isEmployee,
      isManager,
      isAdmin,
      isAdminOrManager,
      isOnlyAdmin,
    } = getRolesData(roles);

    return {
      id,
      username,
      roles,
      isEmployee,
      isManager,
      isAdmin,
      isAdminOrManager,
      isOnlyAdmin,
      role,
    };
  }

  return {
    id: "",
    username: "",
    roles: [],
    isEmployee: false,
    isManager: false,
    isAdmin: false,
    isAdminOrManager: false,
    isOnlyAdmin: false,
    role: "",
  };
};

export default useAuth;
