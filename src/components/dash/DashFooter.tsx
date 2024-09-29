import { useAuth } from "../../hooks";

const DashFooter: React.FC = () => {
  const { username, role } = useAuth();

  return (
    <footer className="flex">
      <p>Current User: {username}</p>
      <p>Role: {role}</p>
    </footer>
  );
};

export default DashFooter;
