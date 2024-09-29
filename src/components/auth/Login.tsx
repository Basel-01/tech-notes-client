import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "yup";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useLoginMutation } from "../../app/api/authApiSlice";
import { useRememberMe } from "../../hooks";
import {
  IconButton,
  PasswordInput,
  TextInput,
  CheckboxInput,
  InfoForTester,
} from "../common";
import { ErrorMessage } from "../error";
import { loginSchema } from "../../validation";
import type { CustomError } from "../../app/api/apiSlice";

const Login: React.FC = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useRememberMe();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage("");
  }, [username, password]);

  useEffect(() => {
    if (isError) {
      if ((error as CustomError)?.data?.message) {
        setErrorMessage((error as CustomError).data.message);
      } else {
        setErrorMessage("Somthing went wrong while login! Try again later.");
      }
    }
  }, [isError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await loginSchema.validate({ username, password, rememberMe });
      await login({ username, password, rememberMe }).unwrap();
      navigate("/dash");
    } catch (error: any) {
      if (error instanceof ValidationError) {
        setErrorMessage(error.errors.join("\n"));
      } else if (error?.data?.message) {
        setErrorMessage(error.data.message);
      } else {
        setErrorMessage("Somthing went wrong while login! Try again later.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <ErrorMessage text={errorMessage} />}

      <div className="flex-between">
        <h2>Login</h2>

        <IconButton
          type="submit"
          icon={faRightToBracket}
          title="Login"
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

      <CheckboxInput
        id="rememberMe"
        label="Remember Me"
        checked={rememberMe}
        onChange={() => setRememberMe((prev) => !prev)}
      />

      <InfoForTester />
    </form>
  );
};

export default Login;
