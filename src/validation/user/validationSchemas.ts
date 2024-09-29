import * as yup from "yup";

const usernameSchema = yup
  .string()
  .max(15, "Username must be at most 15 characters")
  .required("Username is required");

const passwordSchema = yup
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(25, "Password must be at most 25 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one special character"
  )
  .required("Password is required");

const rolesSchema = yup
  .array()
  .of(yup.string().oneOf(["employee", "manager", "admin"], "Invalid role"))
  .min(1, "At least one role is required")
  .required("Roles are required");

export { usernameSchema, passwordSchema, rolesSchema };
