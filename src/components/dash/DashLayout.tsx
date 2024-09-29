import { Outlet } from "react-router-dom";
import { DashHeader, DashFooter } from ".";

const DashLayout: React.FC = () => {
  return (
    <div className="container">
      <DashHeader />
      <main>
        <Outlet />
      </main>
      <DashFooter />
    </div>
  );
};

export default DashLayout;
