import ROLES, { RolesValues } from "../../config/ROLES";

const getRolesData = (roles: RolesValues[]) => {
  const isEmployee = roles.includes(ROLES.Employee);
  const isManager = roles.includes(ROLES.Manager);
  const isAdmin = roles.includes(ROLES.Admin);
  const isAdminOrManager = isAdmin || isManager;
  const isOnlyAdmin = isAdmin && !isManager && !isEmployee;

  const role = isAdmin
    ? ROLES.Admin
    : isManager
    ? ROLES.Manager
    : ROLES.Employee;

  return {
    role,
    isEmployee,
    isManager,
    isAdmin,
    isAdminOrManager,
    isOnlyAdmin,
  };
};

export default getRolesData;
