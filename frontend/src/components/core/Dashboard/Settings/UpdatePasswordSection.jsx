import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useChangePasswordMutation } from "../../../../services/profileApi"
import { isPasswordValid } from "../../../../utils/passwordRules"
import PasswordChecklist from "../../Auth/PasswordChecklist"

const fieldClasses =
  "w-full rounded-[0.5rem] bg-richblack-700 p-[12px] pr-12 text-richblack-5"

function UpdatePasswordSection() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [status, setStatus] = useState(null)

  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    if (formData.newPassword !== formData.confirmNewPassword) {
      setStatus({ ok: false, message: "New passwords do not match." })
      return
    }

    if (!isPasswordValid(formData.newPassword)) {
      setStatus({
        ok: false,
        message: "New password does not meet all the requirements below.",
      })
      return
    }

    try {
      await changePassword(formData).unwrap()
      setStatus({ ok: true, message: "Password updated." })
      setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" })
    } catch (err) {
      setStatus({
        ok: false,
        message: err?.data?.message || "Could not update the password.",
      })
    }
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-8 rounded-md border border-richblack-700 bg-richblack-800 p-8"
    >
      <p className="text-[1.125rem] font-semibold">Password</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <label className="relative">
          <p className="mb-1 text-[0.875rem]">
            Current Password <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showOld ? "text" : "password"}
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleOnChange}
            className={fieldClasses}
          />
          <span
            onClick={() => setShowOld((prev) => !prev)}
            className="absolute right-3 top-[38px] cursor-pointer"
          >
            {showOld ? (
              <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={22} fill="#AFB2BF" />
            )}
          </span>
        </label>

        <label className="relative">
          <p className="mb-1 text-[0.875rem]">
            New Password <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showNew ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleOnChange}
            className={fieldClasses}
          />
          <span
            onClick={() => setShowNew((prev) => !prev)}
            className="absolute right-3 top-[38px] cursor-pointer"
          >
            {showNew ? (
              <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={22} fill="#AFB2BF" />
            )}
          </span>
        </label>

        <label className="relative">
          <p className="mb-1 text-[0.875rem]">
            Confirm New Password <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showNew ? "text" : "password"}
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleOnChange}
            className={fieldClasses}
          />
        </label>
      </div>

      <div className="mt-4 max-w-[420px]">
        <PasswordChecklist password={formData.newPassword} />
      </div>

      {status && (
        <p
          className={`mt-4 text-[0.875rem] ${
            status.ok ? "text-caribbeangreen-100" : "text-pink-200"
          }`}
        >
          {status.message}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-md bg-yellow-50 px-6 py-2 font-medium text-richblack-900
          disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  )
}

export default UpdatePasswordSection
