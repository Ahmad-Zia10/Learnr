import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useParams } from "react-router-dom"
import AuthCard from "../components/core/Auth/AuthCard"
import PasswordChecklist from "../components/core/Auth/PasswordChecklist"
import { useResetPasswordMutation } from "../services/authApi"
import { isPasswordValid } from "../utils/passwordRules"

//Reached from the emailed link: /update-password/:token
function UpdatePassword() {
  const { token } = useParams()

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState(null)
  const [complete, setComplete] = useState(false)

  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const { newPassword, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (!isPasswordValid(newPassword)) {
      setError("Password does not meet all the requirements below.")
      return
    }

    try {
      await resetPassword({ newPassword, confirmPassword, token }).unwrap()
      setComplete(true)
    } catch (err) {
      setError(err?.data?.message || "Could not reset the password.")
    }
  }

  if (complete) {
    return (
      <AuthCard
        title="Reset complete!"
        description="All done! We have sent an email to confirm"
      />
    )
  }

  const fieldClasses =
    "w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
  const fieldShadow = {
    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
  }

  return (
    <AuthCard
      title="Choose new password"
      description="Almost done. Enter your new password and youre all set."
    >
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-4">
        <label className="relative w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            New password <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={newPassword}
            onChange={handleOnChange}
            placeholder="Enter Password"
            style={fieldShadow}
            className={fieldClasses}
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
        </label>

        <label className="relative w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Confirm new password <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleOnChange}
            placeholder="Confirm Password"
            style={fieldShadow}
            className={fieldClasses}
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
          >
            {showConfirmPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
        </label>

        <PasswordChecklist password={newPassword} />

        {error && <p className="text-[0.875rem] text-pink-200">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900
          disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthCard>
  )
}

export default UpdatePassword
