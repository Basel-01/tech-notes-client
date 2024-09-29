import { useGetUsersQuery } from "../../app/api/usersApiSlice";
import { User } from ".";
import { Loading } from "../common";
import { ErrorMessage } from "../error";

const UsersList: React.FC = () => {
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorMessage
        text="Somthing went wrong! Try again later."
        error={error}
      />
    );
  }

  const tableContent =
    users &&
    users.ids.map((userId) => (
      <User key={userId} user={users.entities[userId]} />
    ));

  return (
    <div className="table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Roles</th>
            <th>Edit</th>
          </tr>
        </thead>

        {users && users?.ids.length > 0 ? (
          <tbody>{tableContent}</tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={3}>No Users To Show.</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default UsersList;
