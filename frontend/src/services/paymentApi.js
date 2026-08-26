// Payment endpoints (backend mounts these under /api/v1/payment)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paymentApi = createApi({
  reducerPath: "paymentApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/payment/",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      //the backend also accepts the access token as a bearer header
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({

    //Creates one Razorpay order for a single course.
    capturePayment: builder.mutation({
      query: (courseId) => ({
        url: "capture-payment",
        method: "POST",
        body: { courseId },
      }),
      transformResponse: (response) => response?.data ?? null,
    }),

  }),
});

export const { useCapturePaymentMutation } = paymentApi;
