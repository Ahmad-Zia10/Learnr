import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { BiInfoCircle } from "react-icons/bi"
import CourseAccordion from "../components/core/Catalog/CourseAccordion"
import RatingStars from "../components/common/RatingStars"
import { useGetCourseQuery } from "../services/courseApi"
import { addToCart } from "../store/cartSlice"

const COURSE_INCLUDES = [
  "8 hours on-demand video",
  "Full Lifetime access",
  "Access on Mobile and TV",
  "Certificate of completion",
]

function CourseDetails() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data: course, isFetching, isError } = useGetCourseQuery(courseId)

  const { token } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const inCart = items.some((item) => item._id === courseId)

  //Buying requires an account, so send signed-out visitors to log in first.
  const handleAddToCart = () => {
    if (!token) return navigate("/login")
    dispatch(
      addToCart({
        _id: course._id,
        courseName: course.courseName,
        thumbnail: course.thumbnail,
        price: course.price,
        instructor: course.instructor,
        ratingAndReviews: course.ratingAndReviews,
      })
    )
  }

  const handleBuyNow = () => {
    if (!token) return navigate("/login")
    handleAddToCart()
    navigate("/dashboard/cart")
  }

  const reviews = useMemo(() => course?.ratingAndReviews ?? [], [course])

  const rating = useMemo(() => {
    if (!reviews.length) return 0
    return reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
  }, [reviews])

  const sections = course?.courseContent ?? []
  const lectureCount = sections.reduce(
    (total, section) => total + (section.subSection?.length ?? 0),
    0
  )

  if (isFetching) {
    return (
      <p className="mx-auto max-w-maxContent py-20 text-richblack-100">
        Loading course...
      </p>
    )
  }

  if (isError || !course) {
    return (
      <p className="mx-auto max-w-maxContent py-20 text-richblack-100">
        We couldn&apos;t find that course.{" "}
        <Link to="/" className="text-yellow-50">
          Back to home
        </Link>
      </p>
    )
  }

  //benefits are stored as one string; show each line as a bullet
  const benefits = (course.whatYouWillLearn || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <div className="text-richblack-5">
      {/* Hero */}
      <div className="bg-richblack-800">
        <div className="mx-auto flex max-w-maxContent flex-col gap-8 px-4 py-10 lg:flex-row lg:justify-between">
          <div className="max-w-[680px]">
            <p className="text-[0.875rem] text-richblack-300">
              Home / Learning /{" "}
              <span className="text-yellow-25">{course?.category?.name}</span>
            </p>
            <h1 className="mt-3 text-[1.875rem] font-semibold">
              {course.courseName}
            </h1>
            <p className="mt-3 text-[0.938rem] text-richblack-200">
              {course.courseDescription}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 text-[0.875rem]">
              <span className="text-yellow-100">{rating.toFixed(1)}</span>
              <RatingStars rating={rating} />
              <span className="text-richblack-200">
                ({reviews.length} reviews)
              </span>
            </div>

            <p className="mt-2 text-[0.875rem] text-richblack-100">
              Created by {course?.instructor?.firstName}{" "}
              {course?.instructor?.lastName}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 text-[0.875rem] text-richblack-100">
              <span className="flex items-center gap-x-2">
                <BiInfoCircle /> Created at{" "}
                {new Date(course.createdAt || Date.now()).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-x-2">
                <HiOutlineGlobeAlt /> English
              </span>
            </div>
          </div>

          {/* Purchase card */}
          <div className="h-fit w-full max-w-[380px] rounded-md bg-richblack-700 p-4">
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="h-[201px] w-full rounded-md object-cover"
            />
            <p className="mt-4 text-[1.875rem] font-semibold">
              Rs. {course.price}
            </p>

            <button
              type="button"
              onClick={inCart ? () => navigate("/dashboard/cart") : handleAddToCart}
              className="mt-4 w-full cursor-pointer rounded-md bg-yellow-50 py-[10px] font-medium text-richblack-900"
            >
              {inCart ? "Go to Cart" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="mt-3 w-full cursor-pointer rounded-md bg-richblack-800 py-[10px] font-medium text-richblack-5"
            >
              Buy now
            </button>

            <p className="mt-3 text-center text-[0.813rem] text-richblack-200">
              30-Day Money-Back Guarantee
            </p>

            <p className="mt-4 text-[0.938rem] font-semibold">
              This course includes:
            </p>
            <ul className="mt-2 flex flex-col gap-y-1 text-[0.813rem] text-caribbeangreen-100">
              {COURSE_INCLUDES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-maxContent px-4 py-12">
        {/* What you'll learn */}
        {benefits.length > 0 && (
          <section className="max-w-[780px] rounded-md border border-richblack-600 p-8">
            <h2 className="text-[1.75rem] font-semibold">What you&apos;ll learn</h2>
            <ul className="mt-4 flex flex-col gap-y-2 text-[0.938rem] text-richblack-50">
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Course content */}
        <section className="mt-12 max-w-[780px]">
          <h2 className="text-[1.75rem] font-semibold">Course content</h2>
          <p className="mt-2 text-[0.875rem] text-richblack-200">
            {sections.length} section{sections.length === 1 ? "" : "s"} •{" "}
            {lectureCount} lecture{lectureCount === 1 ? "" : "s"}
          </p>

          <div className="mt-4 overflow-hidden rounded-md border border-richblack-600">
            {sections.length ? (
              sections.map((section, index) => (
                <CourseAccordion
                  key={section._id}
                  section={section}
                  defaultOpen={index === 0}
                />
              ))
            ) : (
              <p className="px-6 py-4 text-[0.875rem] text-richblack-400">
                Course content is being prepared.
              </p>
            )}
          </div>
        </section>

        {/* Author */}
        <section className="mt-12 max-w-[780px]">
          <h2 className="text-[1.75rem] font-semibold">Author</h2>
          <div className="mt-4 flex items-center gap-x-4">
            <img
              src={course?.instructor?.image}
              alt={course?.instructor?.firstName}
              className="h-14 w-14 rounded-full object-cover"
            />
            <p className="text-[1.125rem] font-semibold">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
          </div>
          {course?.instructor?.additionalDetails?.about && (
            <p className="mt-3 text-[0.938rem] text-richblack-50">
              {course.instructor.additionalDetails.about}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

export default CourseDetails
