import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faFloppyDisk, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ValidationError } from "yup";
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
  User,
} from "../../app/api/usersApiSlice";
import { useRolePermissions } from "../../hooks";
import {
  transformRolesToArray,
  transformRolesToObject,
  notify,
} from "../../utils/helper";
import { updateUserSchema } from "../../validation";
import { IconButton, TextInput, CheckboxInput, PasswordInput } from "../common";
import { ErrorMessage } from "../error";
import type { CustomError } from "../../app/api/apiSlice";

const EditUserForm: React.FC<{ user: User }> = ({ user }) => {
  const { canEditAdminOrManager, canDeleteUser, canEditUser } =
    useRolePermissions({ user });
  const [
    updateUser,
    { isLoading: isUpdateLoading, isError: isUpdateError, error: updateError },
  ] = useUpdateUserMutation();
  const [
    deleteUser,
    { isLoading: isDeleteLoading, isError: isDeleteError, error: deleteError },
  ] = useDeleteUserMutation();

  const rolesValue = canEditAdminOrManager
    ? transformRolesToObject(user.roles)
    : { employee: true };

  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState(rolesValue);
  const [active, setActive] = useState(user.active);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage("");
  }, [username, password, roles, active]);

  useEffect(() => {
    const error = isUpdateError
      ? updateError
      : isDeleteError
      ? deleteError
      : null;

    if (error) {
      if ((error as CustomError)?.data?.message) {
        setErrorMessage((error as CustomError).data.message);
      } else {
        setErrorMessage("Somthing went wrong! Try again later.");
      }
    }
  }, [isUpdateError, isDeleteError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const rolesArray = transformRolesToArray(roles);
      await updateUserSchema.validate(
        {
          username,
          roles: rolesArray,
          active,
          ...(password ? { password } : {}),
        },
        { abortEarly: false }
      );
      await updateUser({
        id: user.id,
        username,
        roles: rolesArray,
        active,
        ...(password ? { password: password } : {}),
      }).unwrap();
      notify("User updated successfully", "success");
      navigate("/dash/users/");
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrorMessage(error.errors.join("\n"));
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user.id).unwrap();
      notify("User deleted successfully", "success");
      navigate("/dash/users");
    } catch (error: any) {
      if (error?.data?.message) {
        setErrorMessage(error.data.message);
      } else {
        setErrorMessage("Somthing went wrong! Try again later.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <ErrorMessage text={errorMessage} />}

      <div className="flex-between">
        <h2>Edit {user.username}'s Data</h2>

        <div className="flex-between">
          {canEditUser && (
            <IconButton
              type="submit"
              icon={faFloppyDisk}
              title="Edit user"
              disabled={isUpdateLoading || Boolean(errorMessage)}
            />
          )}

          {canDeleteUser && (
            <IconButton
              icon={faTrashCan}
              title="Delete user"
              onClick={handleDelete}
              disabled={isDeleteLoading || Boolean(errorMessage)}
              color="#ff3c3c"
            />
          )}
        </div>
      </div>

      <TextInput
        id="username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <PasswordInput
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="checkboxes-container">
        <label>Assigned roles:</label>

        {roles &&
          Object.entries(roles).map(([role, checked]) => {
            return (
              <CheckboxInput
                key={role}
                id={role}
                name={role}
                label={`${role[0].toUpperCase()}${role.slice(1)}`}
                checked={checked}
                onChange={(e) =>
                  setRoles((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.checked,
                  }))
                }
              />
            );
          })}
      </div>

      <div className="checkboxes-container">
        <label>User activation:</label>

        <CheckboxInput
          id="active"
          label="Active"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
      </div>
    </form>
  );
};

export default EditUserForm;
