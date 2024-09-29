import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "../../app/api/usersApiSlice";
import { EditUserForm } from ".";
import { Loading } from "../common";
import { ErrorMessage } from "../error";

const EditUser: React.FC = () => {
  const { userId } = useParams();
  const { user, isLoading } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      user: data?.entities[userId!],
      isLoading,
    }),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <ErrorMessage
        text="User Not Found!"
        linkText="Go Back To Users"
        linkPath="/dash/users/"
      />
    );
  }

  return <EditUserForm user={user} />;
};

export default EditUser;
