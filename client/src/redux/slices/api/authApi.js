import { apiSlice } from "../apiSlice";

const AUTH_URL = "/auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    Login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    Signup: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),

    Logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
    }),

    CheckAuth: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/check`,
        method: "GET",
      }),
    }),

    UpdateProfile: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/update-profile`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useCheckAuthMutation,
  useUpdateProfileMutation,
} = authApiSlice;
