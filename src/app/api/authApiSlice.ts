import { apiSlice } from "./apiSlice";
import { setToken, logout as logoutAction } from "../slices/authSlice";

type Credentials = {
  username: string;
  password: string;
  rememberMe: boolean;
};

type AuthResponse = {
  success: boolean;
  message: string;
  accessToken: string;
};

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, Credentials>({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) dispatch(setToken(data?.accessToken));
        } catch (error) {
          console.error(error);
        }
      },
    }),
    isLoggedIn: build.mutation<{ isLoggedIn: boolean }, void>({
      query: () => ({
        url: "/auth/is-logged-in",
        method: "GET",
      }),
    }),
    refresh: build.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) dispatch(setToken(data?.accessToken));
        } catch (error) {
          console.error(error);
        }
      },
    }),
    logout: build.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logoutAction());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (error) {
          console.error(error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useIsLoggedInMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApiSlice;
