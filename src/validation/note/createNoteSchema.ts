import * as yup from "yup";

const createNoteSchema = yup.object().shape({
  title: yup
    .string()
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  description: yup
    .string()
    .max(200, "Description must be at most 200 characters")
    .required("Description is required"),
  assignedTo: yup
    .string()
    .required("Please choose a user to assign the note to"),
});

export default createNoteSchema;
