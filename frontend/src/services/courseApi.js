// Course + category endpoints (backend mounts these under /api/v1/courses)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const courseApi = createApi({
  reducerPath: "courseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/courses/",
    credentials: "include",
  }),

  endpoints: (builder) => ({

    // All categories (used by the navbar catalog dropdown)
    getCategories: builder.query({
      query: () => "show-all-categories",
      transformResponse: (response) => response?.data ?? [],
    }),

    // Courses grouped for a category landing page
    getCategoryPageDetails: builder.query({
      query: (categoryId) => ({
        url: "category-page-details",
        params: { categoryId },
      }),
      transformResponse: (response) => response?.data ?? {},
    }),

    // Public detail page for a single course
    getCourse: builder.query({
      query: (courseId) => ({
        url: "get-course",
        params: { courseId },
      }),
      transformResponse: (response) => response?.data ?? null,
    }),

    getAllCourses: builder.query({
      query: () => "get-all-courses",
      transformResponse: (response) => response?.data ?? [],
    }),

  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryPageDetailsQuery,
  useGetCourseQuery,
  useGetAllCoursesQuery,
} = courseApi;
