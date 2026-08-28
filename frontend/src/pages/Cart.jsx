import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { RiDeleteBin6Line } from "react-icons/ri"
import RatingStars from "../components/common/RatingStars"
import { removeFromCart } from "../store/cartSlice"

const averageRating = (reviews = []) => {
  if (!reviews.length) return 0
  return reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
}

function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total, totalItems } = useSelector((state) => state.cart)

  return (
    <div className="text-richblack-5">
      <p className="text-[0.875rem] text-richblack-300">
        Home / Dashboard / <span className="text-yellow-25">Cart</span>
      </p>
      <h1 className="mt-2 text-[1.875rem] font-semibold">My Cart</h1>
      <p className="mt-4 border-b border-richblack-600 pb-3 text-[0.875rem] font-semibold text-richblack-300">
        {totalItems} Course{totalItems === 1 ? "" : "s"} in Cart
      </p>

      {!totalItems ? (
        <p className="mt-10 text-richblack-300">
          Your cart is empty.{" "}
          <Link to="/" className="text-yellow-50">
            Browse courses
          </Link>
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:justify-between">
          {/* Items */}
          <div className="flex-1">
            {items.map((course) => {
              const rating = averageRating(course.ratingAndReviews)
              return (
                <div
                  key={course._id}
                  className="flex flex-wrap items-start gap-4 border-b border-richblack-600 py-6"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[100px] w-[220px] rounded-md object-cover"
                  />

                  <div className="flex-1">
                    <Link
                      to={`/courses/${course._id}`}
                      className="text-[1.125rem] font-medium"
                    >
                      {course.courseName}
                    </Link>
                    <p className="mt-1 text-[0.875rem] text-richblack-300">
                      {course?.instructor?.firstName}{" "}
                      {course?.instructor?.lastName}
                    </p>
                    <div className="mt-2 flex items-center gap-x-2 text-[0.875rem]">
                      <span className="text-yellow-100">
                        {rating.toFixed(1)}
                      </span>
                      <RatingStars rating={rating} />
                      <span className="text-richblack-400">
                        ({course?.ratingAndReviews?.length ?? 0} Reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-y-3">
                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(course._id))}
                      className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-700 px-3 py-1 text-[0.875rem] text-pink-200"
                    >
                      <RiDeleteBin6Line />
                      Remove
                    </button>
                    <p className="text-[1.125rem] font-semibold text-yellow-50">
                      Rs. {course.price}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="h-fit w-full max-w-[320px] rounded-md border border-richblack-700 bg-richblack-800 p-6">
            <p className="text-[0.875rem] text-richblack-300">Total:</p>
            <p className="mt-1 text-[1.875rem] font-semibold text-yellow-50">
              Rs. {total}
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard/checkout")}
              className="mt-5 w-full cursor-pointer rounded-md bg-yellow-50 py-[10px] font-medium text-richblack-900"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
