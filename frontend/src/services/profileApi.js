// Profile endpoints (backend mounts these under /api/v1/profile)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE } from './apiBase';

export const profileApi = createApi({
  reducerPath: "profileApi",
  tagTypes: ["Profile", "EnrolledCourses"],

  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE}/api/v1/`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({

    getUserDetails: builder.query({
      query: () => "profile/get-user-details",
      transformResponse: (response) => response?.data ?? null,
      providesTags: ["Profile"],
    }),

    getEnrolledCourses: builder.query({
      query: () => "profile/get-enrolled-courses",
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["EnrolledCourses"],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: "profile/update-profile",
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => response?.data ?? null,
      invalidatesTags: ["Profile"],
    }),

    //multipart upload, so the body is a FormData holding `displayPicture`
    updateDisplayImage: builder.mutation({
      query: (formData) => ({
        url: "profile/update-display-Image",
        method: "PATCH",
        body: formData,
      }),
      transformResponse: (response) => response?.data ?? null,
      invalidatesTags: ["Profile"],
    }),

    changePassword: builder.mutation({
      query: (body) => ({
        url: "users/changePassword",
        method: "POST",
        body,
      }),
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: "profile/delete-profile",
        method: "DELETE",
      }),
    }),

  }),
});

export const {
  useGetUserDetailsQuery,
  useGetEnrolledCoursesQuery,
  useUpdateProfileMutation,
  useUpdateDisplayImageMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = profileApi;
