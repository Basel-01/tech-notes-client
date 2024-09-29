import { Navigate, Outlet } from "react-router-dom";
import { PublicHeader, PublicFooter } from ".";
import { useIsLoggedInMutation } from "../../app/api/authApiSlice";
import { useEffect } from "react";
import { Loading } from "../common";

const Layout: React.FC = () => {
  const [IsLoggedIn, { isLoading, data }] = useIsLoggedInMutation();

  useEffect(() => {
    IsLoggedIn();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (data) {
    if (data.isLoggedIn) {
      return <Navigate to="/dash" />;
    }
  }

  return (
    <div className="container">
      <PublicHeader />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default Layout;
