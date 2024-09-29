import ROLES from "../config/ROLES";
import useAuth from "./useAuth";
import { Note } from "../app/api/notesApiSlice";
import { User } from "../app/api/usersApiSlice";
import { getRolesData } from "../utils/helper";

type UseRolePermissionsProps = {
  note?: Note;
  user?: User;
};

const isSuperUser = (username: string) =>
  username === import.meta.env.VITE_SUPER_USER_NAME;

const useRolePermissions = ({ note, user }: UseRolePermissionsProps) => {
  const { id, role, isEmployee, isManager, isAdmin, isAdminOrManager } =
    useAuth();

  const userRole = user ? getRolesData(user.roles).role : null;
  const isSuper = user ? isSuperUser(user.username) : null;

  const isNoteAssignedToUser = note && id === note.assignedTo?._id;
  const isNoteCreatedByUser = note && id === note.createdBy?._id;

  const canEditUser =
    !isSuper &&
    (isAdmin || (role === ROLES.Manager && userRole === ROLES.Employee));

  const canRetrieveUsers = isAdminOrManager;
  const canEditAllNoteFields = isAdminOrManager;
  const canDeleteNote = isAdminOrManager;

  const canEditNote =
    isAdmin ||
    (isManager && (isNoteAssignedToUser || isNoteCreatedByUser)) ||
    (isEmployee && isNoteAssignedToUser);

  const canCreateAdminOrManager = isAdmin;
  const canEditAdminOrManager = isAdmin;

  const canDeleteUser = user && id !== user.id && !isSuper;

  return {
    canEditUser,
    canRetrieveUsers,
    canEditNote,
    canEditAllNoteFields,
    canEditNoteCompletionOnly: !canEditAllNoteFields,
    canDeleteNote,
    canCreateAdminOrManager,
    canEditAdminOrManager,
    canDeleteUser,
  };
};

export default useRolePermissions;
