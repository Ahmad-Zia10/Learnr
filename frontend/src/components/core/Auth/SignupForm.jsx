import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useSendOtpMutation } from "../../../services/authApi"
import { setSignupData } from "../../../store/authSlice"
import { isPasswordValid } from "../../../utils/passwordRules"
import PasswordChecklist from "./PasswordChecklist"

//Signup collects the details, then defers account creation to the OTP step:
//the backend only creates the user once /signup is called with a valid OTP.
function SignupForm({ accountType }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sendOtp, { isLoading }] = useSendOtpMutation()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState(null)

  const { firstName, lastName, email, password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (!isPasswordValid(password)) {
      setError("Password does not meet all the requirements below.")
      return
    }

    try {
      await sendOtp({ email }).unwrap()
      //hold the details until the OTP screen can complete the signup
      dispatch(setSignupData({ ...formData, accountType }))
      navigate("/verify-email")
    } catch (err) {
      setError(err?.data?.message || "Could not send the verification code.")
    }
  }

  const fieldClasses =
    "w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
  const fieldShadow = {
    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
  }

  return (
    <form onSubmit={handleOnSubmit} className="mt-6 flex w-full flex-col gap-y-4">
      <div className="flex gap-x-4">
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            First Name <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="firstName"
            value={firstName}
            onChange={handleOnChange}
            placeholder="Enter first name"
            style={fieldShadow}
            className={fieldClasses}
          />
        </label>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Last Name <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="lastName"
            value={lastName}
            onChange={handleOnChange}
            placeholder="Enter last name"
            style={fieldShadow}
            className={fieldClasses}
          />
        </label>
      </div>

      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          style={fieldShadow}
          className={fieldClasses}
        />
      </label>

      <div className="flex gap-x-4">
        <label className="relative w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Create Password <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter Password"
            style={fieldShadow}
            className={`${fieldClasses} pr-12`}
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
            Confirm Password <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleOnChange}
            placeholder="Confirm Password"
            style={fieldShadow}
            className={`${fieldClasses} pr-12`}
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
      </div>

      <PasswordChecklist password={password} />

      {error && <p className="text-[0.875rem] text-pink-200">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900
        disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Sending code..." : "Create Account"}
      </button>
    </form>
  )
}

export default SignupForm
