import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import {
  useLogoutMutation,
  useRefreshMutation,
} from "../../app/api/authApiSlice";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentToken } from "../../app/slices/authSlice";
import { Loading } from "../common";

const PersistLogin: React.FC = () => {
  const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
    useRefreshMutation();
  const [logout] = useLogoutMutation();
  const token = useAppSelector(selectCurrentToken);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh().unwrap();
      } catch (error) {
        console.error(error);
      }
    };

    if (!token) verifyRefreshToken();
  }, []);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        if (!isUninitialized && !isLoading && (!isSuccess || isError)) {
          await logout().unwrap();
        }
      } catch (err) {
        console.error(err);
      }
    };

    handleLogout();
  }, [isSuccess, isError, isUninitialized]);

  if (isLoading) {
    return <Loading />;
  }

  if (isSuccess || (isUninitialized && token)) {
    return <Outlet />;
  }

  if (!isUninitialized && (!isSuccess || isError)) {
    return <Navigate to="/login" />;
  }

  return null;
};

export default PersistLogin;
