import { useState } from "react"
import { useSelector } from "react-redux"
import { IoClose } from "react-icons/io5"
import { TiStar, TiStarOutline } from "react-icons/ti"
import { useCreateRatingAndReviewMutation } from "../../../services/courseApi"

function ReviewModal({ courseId, onClose }) {
  const { user } = useSelector((state) => state.profile)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [error, setError] = useState(null)

  const [createRatingAndReview, { isLoading }] =
    useCreateRatingAndReviewMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!rating) {
      setError("Select a star rating first.")
      return
    }

    try {
      await createRatingAndReview({ courseId, rating, review }).unwrap()
      onClose()
    } catch (err) {
      setError(err?.data?.message || "Could not save your review.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[520px] overflow-hidden rounded-lg border border-richblack-600 bg-richblack-800">
        <div className="flex items-center justify-between bg-richblack-700 px-6 py-4">
          <p className="text-[1.125rem] font-semibold text-richblack-5">
            Add Review
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer text-richblack-5"
          >
            <IoClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="flex flex-col items-center gap-y-2">
            <div className="flex items-center gap-x-3">
              <img
                src={user?.image}
                alt={user?.firstName}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-richblack-5">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[0.813rem] text-richblack-300">
                  Posting Publicly
                </p>
              </div>
            </div>

            <div className="mt-3 flex gap-x-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    className="cursor-pointer text-yellow-100"
                  >
                    {value <= rating ? (
                      <TiStar size={26} />
                    ) : (
                      <TiStarOutline size={26} className="text-richblack-500" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <label className="mt-6 block">
            <p className="mb-1 text-[0.875rem] text-richblack-5">
              Add Your Experience <sup className="text-pink-200">*</sup>
            </p>
            <textarea
              required
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share details of your own experience for this course"
              className="w-full resize-none rounded-[0.5rem] bg-richblack-700 p-3 text-richblack-5"
            />
          </label>

          {error && <p className="mt-2 text-[0.875rem] text-pink-200">{error}</p>}

          <div className="mt-6 flex justify-end gap-x-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md bg-richblack-700 px-5 py-2 font-medium text-richblack-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer rounded-md bg-yellow-50 px-5 py-2 font-medium text-richblack-900
              disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewModal
