import * as yup from "yup";
import {
  usernameSchema,
  passwordSchema,
  rolesSchema,
} from "./validationSchemas";

const createUserSchema = yup.object().shape({
  username: usernameSchema,
  password: passwordSchema,
  roles: rolesSchema,
});

export default createUserSchema;
