import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

export type Note = {
  id: string;
  ticket: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo: {
    _id: string;
    username: string;
  };
  createdBy: {
    _id: string;
    username: string;
  };
};

type NotesResponse = {
  success: boolean;
  message: string;
  notes: Note[];
};

type UpdateNoteData = {
  id: string;
  title?: string;
  description?: string;
  assignedTo?: string;
  username?: string;
  completed: boolean;
  canEditAllNoteFields: boolean;
};

const notesAdapter = createEntityAdapter<Note>({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getNotes: build.query<EntityState<Note, string>, void>({
      query: () => "/notes",
      transformResponse: (response: NotesResponse) => {
        const notes = response.notes.map((note) => {
          const { _id, ...rest } = note as Note & { _id: string };
          return {
            ...rest,
            id: _id,
          };
        });

        return notesAdapter.setAll(initialState, notes);
      },
    }),
    createNote: build.mutation({
      query: (data) => ({
        url: "/notes",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            notesApiSlice.util.updateQueryData(
              "getNotes",
              undefined,
              (draft) => {
                notesAdapter.upsertOne(draft, data.note);
              }
            )
          );
        } catch (error) {
          console.error("Error creating note: ", error);
        }
      },
    }),
    updateNote: build.mutation<void, UpdateNoteData>({
      query: ({ username, canEditAllNoteFields, ...data }) => ({
        url: "/notes",
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        let updatedNote: Partial<Note> = {
          completed: data.completed,
        };

        if (data.canEditAllNoteFields) {
          updatedNote = {
            ...updatedNote,
            title: data.title,
            description: data.description,
            assignedTo: {
              _id: data.assignedTo!,
              username: data.username!,
            },
          };
        }

        const patchResult = dispatch(
          notesApiSlice.util.updateQueryData("getNotes", undefined, (draft) => {
            notesAdapter.updateOne(draft, {
              id: data.id,
              changes: updatedNote,
            });
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Error updateing note: ", error);
        }
      },
    }),
    deleteNote: build.mutation<void, string>({
      query: (id) => ({
        url: "/notes",
        method: "DELETE",
        body: { id },
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notesApiSlice.util.updateQueryData("getNotes", undefined, (draft) => {
            notesAdapter.removeOne(draft, id);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Error deleting note: ", error);
        }
      },
    }),
  }),
});

export const {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;
