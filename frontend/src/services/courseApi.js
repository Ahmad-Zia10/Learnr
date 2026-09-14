// Course + category endpoints (backend mounts these under /api/v1/courses)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE } from './apiBase';

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["CourseProgress", "FullCourse", "InstructorCourses"],

  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE}/api/v1/courses/`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
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

    //Full content including video URLs; requires enrolment.
    getFullCourseDetails: builder.query({
      query: (courseId) => ({
        url: "get-full-course-details",
        params: { courseId },
      }),
      transformResponse: (response) => response?.data ?? null,
      providesTags: ["FullCourse", "CourseProgress"],
    }),

    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: "get-course-progress",
        params: { courseId },
      }),
      transformResponse: (response) => response?.data?.completedVideos ?? [],
      providesTags: ["CourseProgress"],
    }),

    markLectureComplete: builder.mutation({
      query: (body) => ({
        url: "update-course-progress",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CourseProgress"],
    }),

    markLectureIncomplete: builder.mutation({
      query: (body) => ({
        url: "mark-lecture-incomplete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CourseProgress"],
    }),

    markCourseComplete: builder.mutation({
      query: (courseId) => ({
        url: "mark-course-complete",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["CourseProgress"],
    }),

    createRatingAndReview: builder.mutation({
      query: (body) => ({
        url: "create-rating-and-review",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FullCourse"],
    }),

    getInstructorCourses: builder.query({
      query: () => "get-instructor-courses",
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["InstructorCourses"],
    }),

    //multipart, so the body is a FormData
    createCourse: builder.mutation({
      query: (formData) => ({
        url: "create-course",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response) => response?.data ?? null,
      invalidatesTags: ["InstructorCourses"],
    }),

    updateCourse: builder.mutation({
      query: (formData) => ({
        url: "update-course",
        method: "PATCH",
        body: formData,
      }),
      transformResponse: (response) => response?.data ?? null,
      invalidatesTags: ["InstructorCourses", "FullCourse"],
    }),

    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: "delete-course",
        method: "DELETE",
        body: { courseId },
      }),
      invalidatesTags: ["InstructorCourses"],
    }),

    createSection: builder.mutation({
      query: (body) => ({
        url: "create-section",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data ?? null,
      invalidatesTags: ["FullCourse"],
    }),

    updateSection: builder.mutation({
      query: (body) => ({
        url: "update-section",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["FullCourse"],
    }),

    deleteSection: builder.mutation({
      query: ({ courseId, sectionId }) => ({
        url: `delete-section/${courseId}/${sectionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FullCourse"],
    }),

    createSubSection: builder.mutation({
      query: (formData) => ({
        url: "create-subSection",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["FullCourse"],
    }),

    updateSubSection: builder.mutation({
      query: (formData) => ({
        url: "update-subSection",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["FullCourse"],
    }),

    deleteSubSection: builder.mutation({
      query: (body) => ({
        url: "delete-subSection",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FullCourse"],
    }),

    getAllCourses: builder.query({
      query: () => "get-all-courses",
      transformResponse: (response) => response?.data ?? [],
    }),

  }),
});

export const {
  useGetFullCourseDetailsQuery,
  useGetInstructorCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useCreateSubSectionMutation,
  useUpdateSubSectionMutation,
  useDeleteSubSectionMutation,
  useCreateRatingAndReviewMutation,
  useGetCourseProgressQuery,
  useMarkLectureCompleteMutation,
  useMarkLectureIncompleteMutation,
  useMarkCourseCompleteMutation,
  useGetCategoriesQuery,
  useGetCategoryPageDetailsQuery,
  useGetCourseQuery,
  useGetAllCoursesQuery,
} = courseApi;
