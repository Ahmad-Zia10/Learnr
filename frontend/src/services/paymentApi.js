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

    //Creates a single Razorpay order covering every course in the cart.
    capturePayment: builder.mutation({
      query: (courseIds) => ({
        url: "capture-payment",
        method: "POST",
        body: { courseIds },
      }),
      transformResponse: (response) => response?.data ?? null,
    }),

    //Confirms the payment server-side, which is what actually enrols the student.
    verifyPayment: builder.mutation({
      query: (payment) => ({
        url: "verify-payment",
        method: "POST",
        body: payment,
      }),
      transformResponse: (response) => response?.data ?? null,
    }),

  }),
});

export const {
  useCapturePaymentMutation,
  useVerifyPaymentMutation,
} = paymentApi;
