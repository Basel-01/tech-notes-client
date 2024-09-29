import { useParams } from "react-router-dom";
import { useGetNotesQuery } from "../../app/api/notesApiSlice";
import { Loading } from "../common";
import { ErrorMessage } from "../error";

const ViewNote: React.FC = () => {
  const { noteId } = useParams();

  const { note, isLoading, isError } = useGetNotesQuery(undefined, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      note: data?.entities[noteId!],
      isLoading,
      isError,
    }),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !note) {
    return (
      <ErrorMessage
        text="Note not found."
        linkText="Go Back To Notes"
        linkPath="/dash/notes"
      />
    );
  }

  return (
    <div className="note-view bg-container">
      <h3 className="bold">ticket #{note.ticket}</h3>

      <h1>* {note.title} *</h1>

      <p className="description">{note.description}</p>

      <div className="details">
        <p>
          Note status:{" "}
          <span className={note.completed ? "note-completed" : "note-open"}>
            {note.completed ? "Completed" : "Open"}
          </span>
        </p>
        <p>
          Assigned to: <span>{note.assignedTo.username}</span>
        </p>
        <p>
          Created by: <span>{note.createdBy.username}</span>
        </p>
        <p>
          Created at: <span>{note.createdAt}</span>
        </p>
        <p>
          Updated at: <span>{note.updatedAt}</span>
        </p>
      </div>
    </div>
  );
};

export default ViewNote;
