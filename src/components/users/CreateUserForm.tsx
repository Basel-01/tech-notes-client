import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "yup";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ROLES from "../../config/ROLES";
import { useCreateUserMutation } from "../../app/api/usersApiSlice";
import { useRolePermissions } from "../../hooks";
import { IconButton, PasswordInput, TextInput, CheckboxInput } from "../common";
import { createUserSchema } from "../../validation";
import {
  transformRolesToArray,
  transformRolesToObject,
  notify,
} from "../../utils/helper";
import { ErrorMessage } from "../error";
import type { CustomError } from "../../app/api/apiSlice";

const CreateUserForm: React.FC = () => {
  const { canCreateAdminOrManager } = useRolePermissions({});
  const [createUser, { isLoading, isError, error }] = useCreateUserMutation();

  const initialRolesValue = canCreateAdminOrManager
    ? transformRolesToObject([ROLES.Employee])
    : { employee: true };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState(initialRolesValue);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage("");
  }, [username, password, roles]);

  useEffect(() => {
    if (isError) {
      if ((error as CustomError)?.data?.message) {
        setErrorMessage((error as CustomError).data.message);
      } else {
        setErrorMessage("Somthing went wrong! Try again later.");
      }
    }
  }, [isError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const rolesArray = transformRolesToArray(roles);
      await createUserSchema.validate(
        { username, password, roles: rolesArray },
        { abortEarly: false }
      );
      await createUser({
        username,
        password,
        roles: rolesArray,
      }).unwrap();
      notify("User created successfully", "success");
      navigate("/dash/users/");
    } catch (error: any) {
      if (error instanceof ValidationError) {
        setErrorMessage(error.errors.join("\n"));
      } else if (error?.data?.message) {
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
        <h2>New User</h2>

        <IconButton
          type="submit"
          icon={faPlus}
          title="Create user"
          disabled={isLoading || Boolean(errorMessage)}
        />
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

        {Object.entries(roles).map(([role, checked]) => {
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
    </form>
  );
};

export default CreateUserForm;
