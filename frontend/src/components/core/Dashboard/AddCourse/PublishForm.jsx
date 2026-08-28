import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUpdateCourseMutation } from "../../../../services/courseApi"

//Step 3: choose whether the finished course goes live.
function PublishForm({ course, onBack }) {
  const navigate = useNavigate()
  const [isPublic, setIsPublic] = useState(course?.status === "Published")
  const [error, setError] = useState(null)

  const [updateCourse, { isLoading }] = useUpdateCourseMutation()

  const save = async (status) => {
    setError(null)

    const payload = new FormData()
    payload.append("courseId", course._id)
    payload.append("status", status)

    try {
      await updateCourse(payload).unwrap()
      navigate("/dashboard/my-courses")
    } catch (err) {
      setError(err?.data?.message || "Could not save the course.")
    }
  }

  return (
    <div className="rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <p className="text-[1.375rem] font-semibold text-richblack-5">
        Publish Settings
      </p>

      <label className="mt-6 flex items-center gap-x-3">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-yellow-50"
        />
        <span className="text-[0.938rem] text-richblack-300">
          Make this Course Public
        </span>
      </label>

      {error && <p className="mt-4 text-[0.875rem] text-pink-200">{error}</p>}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="cursor-pointer rounded-md bg-richblack-700 px-5 py-2 font-medium text-richblack-50
          disabled:cursor-not-allowed disabled:opacity-60"
        >
          Back
        </button>

        <div className="flex gap-x-3">
          <button
            type="button"
            onClick={() => save("Draft")}
            disabled={isLoading}
            className="cursor-pointer rounded-md bg-richblack-700 px-5 py-2 font-medium text-richblack-50
            disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save as a Draft
          </button>
          <button
            type="button"
            onClick={() => save(isPublic ? "Published" : "Draft")}
            disabled={isLoading}
            className="cursor-pointer rounded-md bg-yellow-50 px-5 py-2 font-medium text-richblack-900
            disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save and Publish"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PublishForm
