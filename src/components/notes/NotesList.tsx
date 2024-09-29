import { useGetNotesQuery } from "../../app/api/notesApiSlice";
import { Note } from ".";
import { Loading } from "../common";
import { ErrorMessage } from "../error";

const NotesList: React.FC = () => {
  const {
    data: notes,
    isLoading,
    isError,
    error,
  } = useGetNotesQuery(undefined, {
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
    notes &&
    notes.ids.map((noteId) => (
      <Note key={noteId} note={notes.entities[noteId]} />
    ));

  return (
    <div className="table-container">
      <table className="notes-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Status</th>
            <th>Title</th>
            <th>Description</th>
            <th>Assigned To</th>
            <th>Created By</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>View</th>
            <th>Edit</th>
          </tr>
        </thead>

        {notes && notes?.ids.length > 0 ? (
          <tbody>{tableContent}</tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={10}>No Notes To Show.</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default NotesList;
