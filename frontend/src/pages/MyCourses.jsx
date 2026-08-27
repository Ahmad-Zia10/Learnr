import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RiEditBoxLine, RiDeleteBin6Line } from "react-icons/ri"
import { VscAdd } from "react-icons/vsc"
import {
  useGetInstructorCoursesQuery,
  useDeleteCourseMutation,
} from "../services/courseApi"

//Total runtime of a course, from its lecture durations.
const courseDuration = (course) => {
  const lectures = (course.courseContent ?? []).flatMap(
    (section) => section.subSection ?? []
  )
  if (!lectures.length) return "—"
  return `${lectures.length} lecture${lectures.length === 1 ? "" : "s"}`
}

function StatusPill({ status }) {
  const published = status === "Published"
  return (
    <span
      className={`inline-flex items-center gap-x-2 rounded-full bg-richblack-700 px-3 py-1 text-[0.75rem] ${
        published ? "text-yellow-100" : "text-pink-100"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          published ? "bg-yellow-100" : "bg-pink-100"
        }`}
      />
      {published ? "Published" : "Drafted"}
    </span>
  )
}

function MyCourses() {
  const navigate = useNavigate()
  const { data: courses = [], isFetching } = useGetInstructorCoursesQuery()
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation()

  const [confirmId, setConfirmId] = useState(null)
  const [error, setError] = useState(null)

  const handleDelete = async (courseId) => {
    setError(null)
    try {
      await deleteCourse(courseId).unwrap()
      setConfirmId(null)
    } catch (err) {
      setError(err?.data?.message || "Could not delete the course.")
      setConfirmId(null)
    }
  }

  if (isFetching) {
    return <p className="text-richblack-100">Loading your courses...</p>
  }

  return (
    <div className="text-richblack-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.875rem] text-richblack-300">
            Home / Dashboard / <span className="text-yellow-25">Courses</span>
          </p>
          <h1 className="mt-2 text-[1.875rem] font-semibold">My Courses</h1>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/add-course")}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-yellow-50 px-5 py-2 font-medium text-richblack-900"
        >
          <VscAdd />
          New
        </button>
      </div>

      {error && <p className="mt-4 text-[0.875rem] text-pink-200">{error}</p>}

      {!courses.length ? (
        <p className="mt-10 text-richblack-300">
          You have not created any course yet.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-md border border-richblack-700">
          <div className="flex items-center gap-x-4 bg-richblack-700 px-6 py-3 text-[0.875rem] text-richblack-50">
            <p className="flex-1">Courses</p>
            <p className="w-[110px]">Duration</p>
            <p className="w-[90px]">Price</p>
            <p className="w-[70px]">Actions</p>
          </div>

          {courses.map((course) => (
            <div
              key={course._id}
              className="flex flex-wrap items-start gap-4 border-b border-richblack-700 px-6 py-5 last:border-b-0"
            >
              <div className="flex flex-1 gap-x-4">
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="h-[100px] w-[180px] rounded-md object-cover"
                />
                <div className="flex-1">
                  <Link
                    to={`/courses/${course._id}`}
                    className="text-[1.063rem] font-semibold"
                  >
                    {course.courseName}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-[0.813rem] text-richblack-300">
                    {course.courseDescription}
                  </p>
                  <p className="mt-2 text-[0.75rem] text-richblack-300">
                    Created:{" "}
                    {new Date(course.createdAt || Date.now()).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <StatusPill status={course.status} />
                  </div>
                </div>
              </div>

              <p className="w-[110px] text-[0.875rem] text-richblack-100">
                {courseDuration(course)}
              </p>
              <p className="w-[90px] text-[0.875rem] text-richblack-100">
                ₹{course.price}
              </p>

              <div className="flex w-[70px] gap-x-3">
                <button
                  type="button"
                  aria-label="Edit course"
                  onClick={() =>
                    navigate(`/dashboard/edit-course/${course._id}`)
                  }
                  className="cursor-pointer text-richblack-300"
                >
                  <RiEditBoxLine size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Delete course"
                  onClick={() => setConfirmId(course._id)}
                  className="cursor-pointer text-richblack-300"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              </div>

              {confirmId === course._id && (
                <div className="w-full rounded-md border border-pink-700 bg-pink-900 p-4">
                  <p className="text-[0.875rem] text-pink-25">
                    Delete “{course.courseName}”? This removes its sections and
                    lectures permanently.
                  </p>
                  <div className="mt-3 flex gap-x-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(course._id)}
                      disabled={isDeleting}
                      className="cursor-pointer rounded-md bg-pink-200 px-4 py-1 text-[0.875rem] font-medium text-richblack-900
                      disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeleting ? "Deleting..." : "Yes, delete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="cursor-pointer rounded-md bg-richblack-700 px-4 py-1 text-[0.875rem] font-medium text-richblack-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCourses
