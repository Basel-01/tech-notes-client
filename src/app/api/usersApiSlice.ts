import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { RolesValues } from "../../config/ROLES";

export type User = {
  id: string;
  roles: RolesValues[];
  username: string;
  active: boolean;
};

type UsersResponse = {
  success: boolean;
  message: string;
  users: User[];
};

const usersAdapter = createEntityAdapter<User>();

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createDefaultUser: build.mutation({
      query: () => ({
        url: "/users/create-default-user",
        method: "POST",
      }),
    }),
    getUsers: build.query<EntityState<User, string>, void>({
      query: () => "/users",
      transformResponse: (response: UsersResponse) => {
        const users = response.users.map((user) => {
          const { _id, ...rest } = user as User & { _id: string };
          return {
            ...rest,
            id: _id,
          };
        });

        return usersAdapter.setAll(initialState, users);
      },
    }),
    createUser: build.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            usersApiSlice.util.updateQueryData(
              "getUsers",
              undefined,
              (draft) => {
                usersAdapter.upsertOne(draft, data.user);
              }
            )
          );
        } catch (error) {
          console.error("Error creating user: ", error);
        }
      },
    }),
    updateUser: build.mutation({
      query: (data) => ({
        url: "/users",
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(
        { id, password, ...updatedUser },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData("getUsers", undefined, (draft) => {
            usersAdapter.updateOne(draft, {
              id,
              changes: updatedUser,
            });
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Error updateing user: ", error);
        }
      },
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: "/users",
        method: "DELETE",
        body: { id },
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(
            usersApiSlice.util.updateQueryData(
              "getUsers",
              undefined,
              (draft) => {
                usersAdapter.removeOne(draft, id);
              }
            )
          );
        } catch (error) {
          console.error("Error deleting user: ", error);
        }
      },
    }),
  }),
});

export const {
  useCreateDefaultUserMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
