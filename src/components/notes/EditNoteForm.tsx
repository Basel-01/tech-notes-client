import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "yup";
import { faFloppyDisk, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  useDeleteNoteMutation,
  useUpdateNoteMutation,
  Note,
} from "../../app/api/notesApiSlice";
import { useRolePermissions } from "../../hooks";
import { IconButton, TextInput, SelectInput, CheckboxInput } from "../common";
import { notify } from "../../utils/helper";
import { updateNoteSchema, updateNoteCompletionSchema } from "../../validation";
import { ErrorMessage } from "../error";
import type { CustomError } from "../../app/api/apiSlice";

type EditNoteFormProps = {
  note: Note;
  users?: { id: string; username: string }[];
};

const EditNoteForm: React.FC<EditNoteFormProps> = ({ note, users }) => {
  const { canEditAllNoteFields, canEditNoteCompletionOnly, canDeleteNote } =
    useRolePermissions({});
  const [
    updateNote,
    { isLoading: isUpdateLoading, isError: isUpdateError, error: updateError },
  ] = useUpdateNoteMutation();
  const [
    deleteNote,
    { isLoading: isDeleteLoading, isError: isDeleteError, error: deleteError },
  ] = useDeleteNoteMutation();
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [assignedTo, setAssignedTo] = useState(note.assignedTo._id);
  const [username, setUsername] = useState(note.assignedTo.username);
  const [completed, setCompleted] = useState(note.completed);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage("");
  }, [title, description, assignedTo, completed]);

  useEffect(() => {
    const error = isUpdateError
      ? updateError
      : isDeleteError
      ? deleteError
      : null;

    if (error) {
      if ((error as CustomError)?.data?.message) {
        setErrorMessage((error as CustomError).data.message);
      } else {
        setErrorMessage("Somthing went wrong! Try again later.");
      }
    }
  }, [isUpdateError, isDeleteError]);

  const handleAssignedToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const username = e.target.options[e.target.selectedIndex].textContent;
    setUsername(username!);
    setAssignedTo(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const schema = canEditNoteCompletionOnly
        ? updateNoteCompletionSchema
        : updateNoteSchema;
      const dataToValidate = {
        completed,
        ...(canEditAllNoteFields ? { title, description, assignedTo } : {}),
      };
      await schema.validate(dataToValidate, { abortEarly: false });
      await updateNote({
        id: note.id,
        ...dataToValidate,
        ...(canEditAllNoteFields ? { username } : {}),
        canEditAllNoteFields,
      }).unwrap();
      notify("Note updated successfully", "success");
      navigate("/dash/notes");
    } catch (error: any) {
      if (error instanceof ValidationError) {
        setErrorMessage(error.errors.join("\n"));
      } else if (error?.data?.message) {
        setErrorMessage(error.data.message);
      } else {
        setErrorMessage("Somthing went wrong! Try again later.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(note.id).unwrap();
      notify("Note deleted successfully", "success");
      navigate("/dash/notes");
    } catch (error: any) {
      if (error instanceof ValidationError) {
        setErrorMessage(error.errors.join("\n"));
      } else if (error?.data?.message) {
        setErrorMessage(error.data.message);
      } else {
        setErrorMessage("Somthing went wrong! Try again later.");
      }
    }
  };

  const created = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const userOptions =
    users &&
    users.map((user) => ({
      value: user.id,
      label: user.username,
    }));

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <ErrorMessage text={errorMessage} />}

      <div className="flex-between">
        <h2>Edit Note #{note.ticket}</h2>

        <div className="flex-between">
          <IconButton
            type="submit"
            icon={faFloppyDisk}
            title="Edit note"
            disabled={isUpdateLoading || Boolean(errorMessage)}
          />

          {canDeleteNote && (
            <IconButton
              icon={faTrashCan}
              title="Delete note"
              onClick={handleDelete}
              disabled={isDeleteLoading || Boolean(errorMessage)}
              color="#ff3c3c"
            />
          )}
        </div>
      </div>

      {canEditAllNoteFields && (
        <>
          <TextInput
            id="title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextInput
            id="description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <SelectInput
            label="Assigned To"
            id="assignedTo"
            value={assignedTo}
            onChange={handleAssignedToChange}
            options={userOptions!}
            hiddenOption="Select User"
          />
        </>
      )}

      <CheckboxInput
        id="completed"
        label="Work Complete"
        checked={completed}
        onChange={() => setCompleted((prev) => !prev)}
      />

      <div className="note-dates">
        <p>
          Created at: <span className="bold">{created}</span>
        </p>
        <p>
          Updated at: <span className="bold">{updated}</span>
        </p>
      </div>
    </form>
  );
};

export default EditNoteForm;
