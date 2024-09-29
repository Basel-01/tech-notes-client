import { Link } from "react-router-dom";
import { useAuth } from "../../hooks";

const Welcome: React.FC = () => {
  const { username, isAdminOrManager } = useAuth();

  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(new Date());

  return (
    <div className="welcome">
      <p className="welcome-date">{today}</p>

      <h1 className="welcome-text">Welcome {username}!</h1>

      <p>
        <Link to="/dash/notes">View techNotes</Link>
      </p>

      {isAdminOrManager && (
        <>
          <p>
            <Link to="/dash/notes/create">Add New techNotes</Link>
          </p>

          <p>
            <Link to="/dash/users">View Users Settings</Link>
          </p>

          <p>
            <Link to="/dash/users/create">Create New User</Link>
          </p>
        </>
      )}
    </div>
  );
};

export default Welcome;
