import { useGetUsersQuery } from "../../app/api/usersApiSlice";
import { getRolesData } from "../../utils/helper";
import { CreateNoteForm } from ".";
import { Loading } from "../common";
import { ErrorMessage } from "../error";

const CreateNote: React.FC = () => {
  const { users, isLoading } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => {
      return {
        users: data?.ids
          .filter((id) => {
            const { isOnlyAdmin } = getRolesData(data.entities[id].roles);
            return !isOnlyAdmin;
          })
          .map((id) => ({ id, username: data.entities[id].username })),
        isLoading,
      };
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!users?.length) {
    return <ErrorMessage text="No Users Available For Notes!" />;
  }

  return <CreateNoteForm users={users} />;
};

export default CreateNote;
