import { Link } from "react-router-dom"
import { useGetPurchaseHistoryQuery } from "../services/paymentApi"

//Razorpay reports amounts in paise.
const toRupees = (paise) => (paise ?? 0) / 100

function PurchaseHistory() {
  const { data: orders = [], isFetching } = useGetPurchaseHistoryQuery()

  if (isFetching) {
    return <p className="text-richblack-100">Loading your purchases...</p>
  }

  return (
    <div className="text-richblack-5">
      <p className="text-[0.875rem] text-richblack-300">
        Home / Dashboard /{" "}
        <span className="text-yellow-25">Purchase History</span>
      </p>
      <h1 className="mt-2 text-[1.875rem] font-semibold">Purchase History</h1>

      {!orders.length ? (
        <p className="mt-10 text-richblack-300">
          You have not purchased anything yet.{" "}
          <Link to="/" className="text-yellow-50">
            Browse courses
          </Link>
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-md border border-richblack-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 bg-richblack-700 px-6 py-3 text-[0.875rem]">
                <span className="text-richblack-50">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="text-richblack-200">
                  {order.courses?.length ?? 0} course
                  {order.courses?.length === 1 ? "" : "s"}
                </span>
                <span className="font-semibold text-yellow-50">
                  Rs. {toRupees(order.amount)}
                </span>
              </div>

              <div className="divide-y divide-richblack-700">
                {(order.courses ?? []).map((course) => (
                  <Link
                    key={course._id}
                    to={`/courses/${course._id}`}
                    className="flex items-center gap-x-4 px-6 py-4"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="h-14 w-24 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-[1rem] font-medium">
                        {course.courseName}
                      </p>
                      <p className="mt-1 text-[0.813rem] text-richblack-300">
                        {course?.instructor?.firstName}{" "}
                        {course?.instructor?.lastName}
                      </p>
                    </div>
                    <p className="text-[0.875rem] text-richblack-100">
                      Rs. {course.price}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PurchaseHistory
