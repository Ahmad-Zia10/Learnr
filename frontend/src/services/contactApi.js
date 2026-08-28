// Contact endpoint (backend mounts this under /api/v1/reach)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const contactApi = createApi({
  reducerPath: "contactApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/reach/",
  }),

  endpoints: (builder) => ({
    contactUs: builder.mutation({
      query: (body) => ({
        url: "contact",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useContactUsMutation } = contactApi;
