import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "yup";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCreateNoteMutation } from "../../app/api/notesApiSlice";
import { IconButton, TextInput, SelectInput } from "../common";
import { notify } from "../../utils/helper";
import { createNoteSchema } from "../../validation";
import { ErrorMessage } from "../error";
import type { CustomError } from "../../app/api/apiSlice";

type CreateNoteFormProps = { users: { id: string; username: string }[] };

const CreateNoteForm: React.FC<CreateNoteFormProps> = ({ users }) => {
  const [createNote, { isLoading, isError, error }] = useCreateNoteMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage("");
  }, [title, description, assignedTo]);

  useEffect(() => {
    if (isError) {
      if ((error as CustomError)?.data?.message) {
        setErrorMessage((error as CustomError).data.message);
      } else {
        setErrorMessage("Somthing went wrong! Try again later.");
      }
    }
  }, [isError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await createNoteSchema.validate(
        { title, description, assignedTo },
        { abortEarly: false }
      );
      await createNote({
        assignedTo,
        title,
        description,
      }).unwrap();
      notify("Note created successfully", "success");
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

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.username,
  }));

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <ErrorMessage text={errorMessage} />}

      <div className="flex-between">
        <h2>New Note</h2>

        <IconButton
          type="submit"
          icon={faPlus}
          title="Create note"
          disabled={isLoading || Boolean(errorMessage)}
        />
      </div>

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
        onChange={(e) => setAssignedTo(e.target.value)}
        options={userOptions}
        hiddenOption="Select User"
      />
    </form>
  );
};

export default CreateNoteForm;
