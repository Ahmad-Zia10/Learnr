// Auth API endpoints (backend mounts these under /api/v1/users)
// Vite proxies /api/v1 -> http://localhost:4000 in development.

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE } from './apiBase';

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE}/api/v1/users/`,
    //send the httpOnly access/refresh cookies the backend sets on login
    credentials: "include",
  }),

  endpoints: (builder) => ({

    // Send OTP
    sendOtp: builder.mutation({
      query: (body) => ({
        url: "sendOTP",
        method: "POST",
        body,
      }),
    }),

    // Signup
    signup: builder.mutation({
      query: (body) => ({
        url: "signup",
        method: "POST",
        body,
      }),
    }),

    // Login
    login: builder.mutation({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
    }),

    // Generate reset password token
    resetPasswordToken: builder.mutation({
      query: (body) => ({
        url: "reset-password-token",
        method: "POST",
        body,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "reset-password",
        method: "POST",
        body,
      }),
    }),

  }),
});

// Auto-generated hooks
export const {
  useSendOtpMutation,
  useSignupMutation,
  useLoginMutation,
  useResetPasswordTokenMutation,
  useResetPasswordMutation,
} = authApi;
