import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RxCountdownTimer } from "react-icons/rx"
import AuthCard from "../components/core/Auth/AuthCard"
import OtpInput from "../components/core/Auth/OtpInput"
import { useSendOtpMutation, useSignupMutation } from "../services/authApi"
import { setSignupData } from "../store/authSlice"

const OTP_LENGTH = 6

//Final step of signup: the account is only created once the OTP checks out.
function VerifyEmail() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { signupData } = useSelector((state) => state.auth)

  const [otp, setOtp] = useState("")
  const [error, setError] = useState(null)

  const [signup, { isLoading }] = useSignupMutation()
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation()

  //Reaching this page directly has no pending signup to complete.
  useEffect(() => {
    if (!signupData) navigate("/signup")
  }, [signupData, navigate])

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (otp.length !== OTP_LENGTH) {
      setError("Enter all 6 digits of the verification code.")
      return
    }

    try {
      await signup({ ...signupData, otp }).unwrap()
      dispatch(setSignupData(null))
      navigate("/login")
    } catch (err) {
      setError(err?.data?.message || "Could not verify the code.")
    }
  }

  const handleResend = async () => {
    setError(null)
    try {
      await sendOtp({ email: signupData?.email }).unwrap()
    } catch (err) {
      setError(err?.data?.message || "Could not resend the code.")
    }
  }

  if (!signupData) return null

  return (
    <AuthCard
      title="Verify email"
      description="A verification code has been sent to you. Enter the code below"
      footer={
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="flex items-center gap-x-2 text-blue-100 disabled:opacity-60"
        >
          <RxCountdownTimer />
          Resend it
        </button>
      }
    >
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-6">
        <OtpInput value={otp} onChange={setOtp} length={OTP_LENGTH} />

        {error && <p className="text-[0.875rem] text-pink-200">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900
          disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Verifying..." : "Verify and Register"}
        </button>
      </form>
    </AuthCard>
  )
}

export default VerifyEmail
