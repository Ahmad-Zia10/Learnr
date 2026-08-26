import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import RatingStars from "../components/common/RatingStars"
import { useCapturePaymentMutation } from "../services/paymentApi"
import { resetCart } from "../store/cartSlice"
import { loadRazorpayScript } from "../utils/razorpay"

const averageRating = (reviews = []) => {
  if (!reviews.length) return 0
  return reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
}

function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total, totalItems } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.profile)

  const [capturePayment, { isLoading }] = useCapturePaymentMutation()

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email ?? "",
  })
  const [error, setError] = useState(null)

  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePay = async (e) => {
    e.preventDefault()
    setError(null)

    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      setError("Could not reach the payment provider. Check your connection.")
      return
    }

    try {
      //the backend creates one order per course
      for (const course of items) {
        const order = await capturePayment(course._id).unwrap()
        if (!order?.order_id) continue

        await new Promise((resolve) => {
          const checkout = new window.Razorpay({
            key: import.meta.env.VITE_RAZORPAY_KEY,
            order_id: order.order_id,
            amount: order.amount,
            currency: order.currency,
            name: "StudyNotion",
            description: order.courseName,
            image: order.thumbnail,
            prefill: {
              name: formData.fullName,
              email: formData.email,
            },
            handler: resolve,
            modal: { ondismiss: resolve },
          })
          checkout.open()
        })
      }

      dispatch(resetCart())
      navigate("/dashboard/enrolled-courses")
    } catch (err) {
      setError(err?.data?.message || "Payment could not be started.")
    }
  }

  if (!totalItems) {
    return (
      <p className="text-richblack-300">
        Your cart is empty.{" "}
        <Link to="/" className="text-yellow-50">
          Browse courses
        </Link>
      </p>
    )
  }

  const fieldClasses =
    "w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"

  return (
    <div className="text-richblack-5">
      <p className="text-[0.875rem] text-richblack-300">
        Home / Cart / <span className="text-yellow-25">Checkout</span>
      </p>
      <h1 className="mt-2 text-[1.875rem] font-semibold">Checkout</h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:justify-between">
        {/* Order summary */}
        <div className="flex-1">
          <p className="text-[0.938rem] text-richblack-100">Order Summary</p>

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
                  className="h-[90px] w-[190px] rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="text-[1.063rem] font-medium">
                    {course.courseName}
                  </p>
                  <p className="mt-1 text-[0.875rem] text-richblack-300">
                    {course?.instructor?.firstName}{" "}
                    {course?.instructor?.lastName}
                  </p>
                  <div className="mt-2 flex items-center gap-x-2 text-[0.875rem]">
                    <span className="text-yellow-100">{rating.toFixed(1)}</span>
                    <RatingStars rating={rating} />
                  </div>
                </div>
                <p className="text-[1.125rem] font-semibold text-yellow-50">
                  Rs. {course.price}
                </p>
              </div>
            )
          })}
        </div>

        {/* Payment details */}
        <form
          onSubmit={handlePay}
          className="h-fit w-full max-w-[380px] rounded-md border border-richblack-700 bg-richblack-800 p-6"
        >
          <p className="text-[1.125rem] font-semibold">Payment Details</p>
          <p className="mt-1 text-[0.813rem] text-richblack-300">
            Complete your purchase by providing your payment details.
          </p>

          <label className="mt-5 block">
            <p className="mb-1 text-[0.875rem] text-richblack-5">
              Full Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleOnChange}
              placeholder="Enter Full Name"
              className={fieldClasses}
            />
          </label>

          <label className="mt-4 block">
            <p className="mb-1 text-[0.875rem] text-richblack-5">
              Email ID <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleOnChange}
              placeholder="Enter Email ID"
              className={fieldClasses}
            />
          </label>

          <div className="mt-5 flex items-center justify-between border-t border-richblack-600 pt-4">
            <span className="text-[0.938rem] text-richblack-100">Total</span>
            <span className="text-[0.938rem] font-semibold">Rs. {total}/-</span>
          </div>

          {error && (
            <p className="mt-3 text-[0.875rem] text-pink-200">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-5 w-full cursor-pointer rounded-md bg-yellow-50 py-[10px] font-medium text-richblack-900
            disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Starting payment..." : `Pay Rs. ${total}`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Checkout
