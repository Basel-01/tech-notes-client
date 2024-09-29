import ROLES, { RolesValues } from "../../config/ROLES";

type RolesObject = { [key in RolesValues]: boolean };

export const transformRolesToObject = (rolesArray: RolesValues[]) =>
  Object.values(ROLES).reduce((acc, role) => {
    acc[role] = rolesArray.includes(role);
    return acc;
  }, {} as RolesObject);

export const transformRolesToArray = (rolesObject: Partial<RolesObject>) =>
  Object.keys(rolesObject).filter((role) => rolesObject[role as RolesValues]);
