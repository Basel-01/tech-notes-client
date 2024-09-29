import { Link } from "react-router-dom";
import { useCreateDefaultUserMutation } from "../../app/api/usersApiSlice";
import { notify } from "../../utils/helper";

const InfoForTester: React.FC = () => {
  const [createDefaultUser] = useCreateDefaultUserMutation();

  const handleCreateDefaultUser = async () => {
    try {
      const { message } = await createDefaultUser({}).unwrap();
      notify(message, "success");
    } catch (error: any) {
      if (error?.data?.message) {
        notify(error.data.message, "error");
      } else {
        notify(
          "Something went wrong while creating the default admin user. Please try again later.",
          "error"
        );
      }
    }
  };

  return (
    <div className="for-tester bg-container">
      <h3>Admin Test Credentials</h3>
      <div className="description">
        Since there is no signup, only logged-in users can create other users.
      </div>
      <div className="description">
        You can login using the following only admin credentials:
      </div>
      <div>
        <strong>Username:</strong> {import.meta.env.VITE_SUPER_USER_NAME}
      </div>
      <div>
        <strong>Password:</strong> {import.meta.env.VITE_SUPER_USER_PASSWORD}
      </div>
      <button type="button" onClick={handleCreateDefaultUser} className="btn">
        Create Default Admin User
      </button>
      <p>
        * This admin user cannot be deleted or edited. You can use it to create
        other users with any role for testing purposes.
      </p>
      <p>
        * For more details on roles and permissions, please refer to the{" "}
        <Link
          to={
            "https://github.com/Basel-01/tech-notes-client/blob/main/README.md#roles--permissions"
          }
          target="_blank"
        >
          README file.
        </Link>
      </p>
    </div>
  );
};

export default InfoForTester;
