import { useState } from "react"
import { Link } from "react-router-dom"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { useGetEnrolledCoursesQuery } from "../services/profileApi"
import { useMarkCourseCompleteMutation } from "../services/courseApi"

const FILTERS = ["All", "Pending", "Completed"]

//Deep-link straight into the first lecture of a course.
const firstLecturePath = (course) => {
  const section = (course.courseContent ?? []).find(
    (item) => item.subSection?.length
  )
  const lecture = section?.subSection?.[0]

  if (!section || !lecture) return `/courses/${course._id}`
  return `/view-course/${course._id}/section/${section._id}/sub-section/${lecture._id}`
}

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
  const { data: courses = [], isFetching, refetch } = useGetEnrolledCoursesQuery()
  const [markCourseComplete] = useMarkCourseCompleteMutation()
  const [openMenu, setOpenMenu] = useState(null)

  const handleMarkComplete = async (courseId) => {
    setOpenMenu(null)
    try {
      await markCourseComplete(courseId).unwrap()
      //the percentage is computed by the enrolled-courses endpoint
      refetch()
    } catch {
      //surfaced by the row staying where it is; nothing destructive happened
    }
  }

  const visible = courses.filter((course) => {
    const progress = course.progressPercentage ?? 0
    if (filter === "Completed") return progress >= 100
    if (filter === "Pending") return progress < 100
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
            <p className="w-[130px]">Lectures</p>
            <p className="w-[210px]">Progress</p>
            <p className="w-[26px]" />
          </div>

          {visible.map((course) => (
            <div
              key={course._id}
              className="flex flex-wrap items-center gap-4 border-b border-richblack-700 px-6 py-5 last:border-b-0"
            >
              <Link
                to={firstLecturePath(course)}
                className="flex flex-1 items-center gap-x-4"
              >
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="h-14 w-14 rounded-md object-cover"
                />
                <div>
                  <p className="text-[1rem] font-medium">{course.courseName}</p>
                  <p className="mt-1 line-clamp-1 text-[0.813rem] text-richblack-300">
                    {course.courseDescription}
                  </p>
                </div>
              </Link>

              <p className="w-[130px] text-[0.875rem] text-richblack-100">
                {course.completedLectures ?? 0}/{course.totalLectures ?? 0}{" "}
                lectures
              </p>

              <div className="w-[210px]">
                <p className="text-[0.813rem] text-richblack-100">
                  {(course.progressPercentage ?? 0) >= 100
                    ? "Completed"
                    : `Progress ${course.progressPercentage ?? 0}%`}
                </p>
                <ProgressBar value={course.progressPercentage ?? 0} />
              </div>

              {/* Row actions */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Course actions"
                  onClick={() =>
                    setOpenMenu(openMenu === course._id ? null : course._id)
                  }
                  className="cursor-pointer p-1 text-richblack-100"
                >
                  <HiOutlineDotsVertical size={18} />
                </button>

                {openMenu === course._id && (
                  <div className="absolute right-0 z-10 mt-1 w-[210px] overflow-hidden rounded-md border border-richblack-600 bg-richblack-700">
                    <button
                      type="button"
                      onClick={() => handleMarkComplete(course._id)}
                      disabled={(course.progressPercentage ?? 0) >= 100}
                      className="w-full cursor-pointer px-4 py-3 text-left text-[0.875rem] text-richblack-5
                      disabled:cursor-not-allowed disabled:text-richblack-400"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EnrolledCourses
