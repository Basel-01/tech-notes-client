import * as yup from "yup";

const errorMessage = "Invalid username or password.";

const loginSchema = yup.object().shape({
  username: yup.string().required(errorMessage).max(15, errorMessage),
  password: yup
    .string()
    .min(6, errorMessage)
    .max(25, errorMessage)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, errorMessage),
  rememberMe: yup.boolean(),
});

export default loginSchema;
