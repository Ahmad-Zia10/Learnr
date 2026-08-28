import { useState } from "react"
import AuthCard from "../components/core/Auth/AuthCard"
import { useResetPasswordTokenMutation } from "../services/authApi"

//Two states on one route: request the link, then confirm it was sent.
function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState(null)

  const [resetPasswordToken, { isLoading }] = useResetPasswordTokenMutation()

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      await resetPasswordToken({ email }).unwrap()
      setEmailSent(true)
    } catch (err) {
      setError(err?.data?.message || "Could not send the reset link.")
    }
  }

  return (
    <AuthCard
      title={emailSent ? "Check email" : "Reset your password"}
      description={
        emailSent
          ? `We have sent the reset email to ${email}`
          : "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
      }
    >
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-6">
        {!emailSent && (
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Email Address <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
        )}

        {error && <p className="text-[0.875rem] text-pink-200">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900
          disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? "Sending..."
            : emailSent
              ? "Resend email"
              : "Reset Password"}
        </button>
      </form>
    </AuthCard>
  )
}

export default ForgotPassword
