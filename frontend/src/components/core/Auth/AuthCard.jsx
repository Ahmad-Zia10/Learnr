import { Link } from "react-router-dom"
import { IoIosArrowRoundBack } from "react-icons/io"

//Centered single-column shell shared by the OTP, forgot-password and
//reset-password screens.
function AuthCard({ title, description, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-maxContent items-center justify-center">
      <div className="w-full max-w-[440px] px-4 py-20">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-[1rem] leading-[1.625rem] text-richblack-100">
            {description}
          </p>
        )}

        <div className="mt-7">{children}</div>

        <div className="mt-6 flex items-center justify-between">
          <Link to="/login">
            <p className="flex items-center gap-x-2 text-richblack-5">
              <IoIosArrowRoundBack size={22} />
              Back to login
            </p>
          </Link>
          {footer}
        </div>
      </div>
    </div>
  )
}

export default AuthCard
