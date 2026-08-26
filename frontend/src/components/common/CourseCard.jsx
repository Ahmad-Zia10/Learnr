import { Link } from "react-router-dom"
import RatingStars from "./RatingStars"

//Average of a course's reviews, or 0 when it has none yet.
const averageRating = (reviews = []) => {
  if (!reviews.length) return 0
  const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
  return total / reviews.length
}

function CourseCard({ course, bestseller = false }) {
  const rating = averageRating(course?.ratingAndReviews)
  const reviewCount = course?.ratingAndReviews?.length ?? 0

  return (
    <Link to={`/courses/${course._id}`} className="flex flex-col gap-y-2">
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="h-[201px] w-full rounded-sm object-cover"
          loading="lazy"
        />
        {bestseller && (
          <span className="absolute left-0 top-3 rounded-r-sm bg-pink-200 px-3 py-1 text-[0.75rem] font-medium text-richblack-5">
            Bestseller
          </span>
        )}
      </div>

      <p className="text-[1rem] leading-[1.5rem] text-richblack-5">
        {course.courseName}
      </p>
      <p className="text-[0.875rem] text-richblack-300">
        {course?.instructor?.firstName} {course?.instructor?.lastName}
      </p>

      <div className="flex items-center gap-x-2">
        <span className="text-[0.875rem] text-yellow-100">
          {rating.toFixed(1)}
        </span>
        <RatingStars rating={rating} />
        <span className="text-[0.875rem] text-richblack-400">
          ({reviewCount} Reviews)
        </span>
      </div>

      <p className="text-[1.125rem] font-semibold text-richblack-5">
        Rs. {course.price}
      </p>
    </Link>
  )
}

export default CourseCard
