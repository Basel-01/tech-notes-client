import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  BaseQueryApi,
} from "@reduxjs/toolkit/query/react";
import { setToken } from "../slices/authSlice";
import type { RootState } from "../store";

export type CustomError = {
  data: {
    message: string;
  };
  status: number;
};

type RefreshData = {
  accessToken: string;
};

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
}) as BaseQueryFn<string | FetchArgs, unknown, CustomError, {}>;

const baseQueryWithReauth = async (
  args: any,
  api: BaseQueryApi,
  extraOption: {}
) => {
  let result = await baseQuery(args, api, extraOption);

  if (result?.error?.status === 401) {
    let refreshResult = await baseQuery("/auth/refresh", api, extraOption);
    const refreshData = refreshResult.data as RefreshData;

    if (refreshData?.accessToken) {
      api.dispatch(setToken(refreshData.accessToken));

      result = await baseQuery(args, api, extraOption);
    } else {
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
