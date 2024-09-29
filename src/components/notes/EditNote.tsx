import { useParams } from "react-router-dom";
import { useGetNotesQuery } from "../../app/api/notesApiSlice";
import { useGetUsersQuery } from "../../app/api/usersApiSlice";
import { useRolePermissions } from "../../hooks";
import { EditNoteForm } from ".";
import { getRolesData } from "../../utils/helper";
import { Loading } from "../common";
import { ErrorMessage } from "../error";

const EditNote: React.FC = () => {
  const { noteId } = useParams();
  const { canRetrieveUsers } = useRolePermissions({});
  const { note, isNoteLoading } = useGetNotesQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      note: data?.entities[noteId!],
      isNoteLoading: isLoading,
    }),
  });
  const { users, isUsersLoading } = useGetUsersQuery(undefined, {
    skip: !canRetrieveUsers,
    selectFromResult: ({ data, isLoading }) => {
      return {
        users: data?.ids
          .filter((id) => {
            const { isOnlyAdmin } = getRolesData(data.entities[id].roles);
            return !isOnlyAdmin;
          })
          .map((id) => ({ id, username: data.entities[id].username })),
        isUsersLoading: isLoading,
      };
    },
  });

  if (isNoteLoading || isUsersLoading) {
    return <Loading />;
  }

  if (!note) {
    return (
      <ErrorMessage
        text="Note not found."
        linkText="Go Back To Notes"
        linkPath="/dash/notes"
      />
    );
  }

  if (canRetrieveUsers && !users?.length) {
    return (
      <ErrorMessage
        text="No users found to be assigned to notes."
        linkText="Go Back To Notes"
        linkPath="/dash/notes"
      />
    );
  }

  return canRetrieveUsers && users ? (
    <EditNoteForm note={note} users={users} />
  ) : (
    <EditNoteForm note={note} />
  );
};

export default EditNote;
