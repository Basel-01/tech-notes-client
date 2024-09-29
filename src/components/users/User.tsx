import { useNavigate } from "react-router-dom";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useRolePermissions } from "../../hooks";
import { User as UserType } from "../../app/api/usersApiSlice";
import { IconButton } from "../common";

const User: React.FC<{ user: UserType }> = ({ user }) => {
  if (!user) {
    return null;
  }

  const { canEditUser } = useRolePermissions({ user });
  const navigate = useNavigate();

  const userRolesString = user.roles.join(", ");
  const userActive = user.active ? "" : "user-inactive";

  return (
    <tr className="center">
      <td className={`larger-width ${userActive}`}>{user.username}</td>
      <td className={userActive}>{userRolesString}</td>
      <td className="icon-cell">
        {canEditUser && (
          <IconButton
            icon={faEdit}
            title="Edit user"
            onClick={() => navigate(`/dash/users/${user.id}`)}
          />
        )}
      </td>
    </tr>
  );
};

export default User;
