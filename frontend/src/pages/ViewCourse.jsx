import { useState } from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet, useParams } from "react-router-dom"
import VideoSidebar from "../components/core/ViewCourse/VideoSidebar"
import ReviewModal from "../components/core/ViewCourse/ReviewModal"
import {
  useGetFullCourseDetailsQuery,
  useMarkLectureCompleteMutation,
  useMarkLectureIncompleteMutation,
} from "../services/courseApi"

//Shell for the lecture player: outline on the left, active lecture on the right.
function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const [showReview, setShowReview] = useState(false)

  const { data, isFetching, isError, error } = useGetFullCourseDetailsQuery(
    courseId,
    { skip: !token }
  )

  const [markComplete] = useMarkLectureCompleteMutation()
  const [markIncomplete] = useMarkLectureIncompleteMutation()

  const handleToggleComplete = async (subSectionId, isComplete) => {
    const mutation = isComplete ? markIncomplete : markComplete
    try {
      await mutation({ courseId, subSectionId }).unwrap()
    } catch {
      //the checkbox reflects server state, which the refetch restores
    }
  }

  if (!token) return <Navigate to="/login" replace />

  if (isFetching) {
    return (
      <p className="mx-auto max-w-maxContent py-20 text-richblack-100">
        Loading course...
      </p>
    )
  }

  if (isError) {
    return (
      <p className="mx-auto max-w-maxContent py-20 text-richblack-100">
        {error?.data?.message || "This course could not be opened."}
      </p>
    )
  }

  const course = data?.course
  const completedVideos = data?.completedVideos ?? []

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <VideoSidebar
        course={course}
        completedVideos={completedVideos}
        onToggleComplete={handleToggleComplete}
        onAddReview={() => setShowReview(true)}
      />

      <div className="flex-1 overflow-y-auto">
        <Outlet context={{ course, completedVideos }} />
      </div>

      {showReview && (
        <ReviewModal
          courseId={courseId}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  )
}

export default ViewCourse
