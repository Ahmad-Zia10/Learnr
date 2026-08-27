import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useGetEnrolledCoursesQuery } from "../services/profileApi"

const FILTERS = ["All", "Pending", "Completed"]

//Total lectures across a course's sections.
const lectureCount = (course) =>
  (course.courseContent ?? []).reduce(
    (total, section) => total + (section.subSection?.length ?? 0),
    0
  )

function ProgressBar({ value }) {
  return (
    <div className="mt-1 h-2 w-full max-w-[220px] overflow-hidden rounded-full bg-richblack-700">
      <div
        className={`h-full rounded-full ${
          value >= 100 ? "bg-caribbeangreen-100" : "bg-blue-100"
        }`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

function EnrolledCourses() {
  const [filter, setFilter] = useState("All")
  const { data: courses = [], isFetching } = useGetEnrolledCoursesQuery()

  //The backend does not report progress yet, so treat every course as not
  //started until a course-progress endpoint exists.
  const withProgress = useMemo(
    () =>
      courses.map((course) => ({
        ...course,
        progress: course.progressPercentage ?? 0,
      })),
    [courses]
  )

  const visible = withProgress.filter((course) => {
    if (filter === "Completed") return course.progress >= 100
    if (filter === "Pending") return course.progress < 100
    return true
  })

  if (isFetching) {
    return <p className="text-richblack-100">Loading your courses...</p>
  }

  return (
    <div className="text-richblack-5">
      <p className="text-[0.875rem] text-richblack-300">
        Home / Dashboard /{" "}
        <span className="text-yellow-25">Enrolled Courses</span>
      </p>
      <h1 className="mt-2 text-[1.875rem] font-semibold">Enrolled Courses</h1>

      {/* Filter pills */}
      <div className="mt-6 flex max-w-max gap-x-1 rounded-full bg-richblack-800 p-1">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`cursor-pointer rounded-full px-5 py-2 text-[0.875rem] ${
              filter === option
                ? "bg-richblack-900 text-richblack-5"
                : "bg-transparent text-richblack-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {!visible.length ? (
        <p className="mt-10 text-richblack-300">
          {courses.length
            ? "No courses match this filter."
            : "You have not enrolled in any course yet."}
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-md border border-richblack-700">
          <div className="flex items-center gap-x-4 bg-richblack-700 px-6 py-3 text-[0.875rem] text-richblack-50">
            <p className="flex-1">Course Name</p>
            <p className="w-[130px]">Duration</p>
            <p className="w-[240px]">Progress</p>
          </div>

          {visible.map((course) => (
            <div
              key={course._id}
              className="flex flex-wrap items-center gap-4 border-b border-richblack-700 px-6 py-5 last:border-b-0"
            >
              <Link
                to={`/courses/${course._id}`}
                className="flex flex-1 items-center gap-x-4"
              >
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="h-14 w-14 rounded-md object-cover"
                />
                <div>
                  <p className="text-[1rem] font-medium">{course.courseName}</p>
                  <p className="mt-1 text-[0.813rem] text-richblack-300">
                    {lectureCount(course)} lecture
                    {lectureCount(course) === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>

              <p className="w-[130px] text-[0.875rem] text-richblack-100">
                {course.totalDuration ?? "—"}
              </p>

              <div className="w-[240px]">
                <p className="text-[0.813rem] text-richblack-100">
                  {course.progress >= 100
                    ? "Completed"
                    : `Progress ${course.progress}%`}
                </p>
                <ProgressBar value={course.progress} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EnrolledCourses
