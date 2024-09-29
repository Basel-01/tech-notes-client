import { useNavigate } from "react-router-dom";
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { useRolePermissions } from "../../hooks";
import { Note as NoteType } from "../../app/api/notesApiSlice";
import { IconButton } from "../common";

const Note: React.FC<{ note: NoteType }> = ({ note }) => {
  if (!note) {
    return null;
  }

  const { canEditNote } = useRolePermissions({ note });
  const navigate = useNavigate();

  const createdAt = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const updatedAt = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <tr>
      <td className="center bold">#{note.ticket}</td>
      <td
        className={`center bold ${
          note.completed ? "note-completed" : "note-open"
        }`}
      >
        {note.completed ? "Completed" : "Open"}
      </td>
      <td>{note.title}</td>
      <td>{note.description}</td>
      <td className="center">
        {note.assignedTo?.username
          ? note.assignedTo.username
          : "*Deleted User*"}
      </td>
      <td className="center">
        {note.createdBy?.username ? note.createdBy.username : "*Deleted User*"}
      </td>
      <td className="center larger-width">{createdAt}</td>
      <td className="center larger-width">{updatedAt}</td>
      <td className="icon-cell">
        <IconButton
          icon={faEye}
          title="View note"
          onClick={() => navigate(`/dash/notes/${note.id}/view`)}
        />
      </td>
      <td className="icon-cell">
        {canEditNote && (
          <IconButton
            icon={faEdit}
            title="Update note"
            onClick={() => navigate(`/dash/notes/${note.id}`)}
          />
        )}
      </td>
    </tr>
  );
};

export default Note;
