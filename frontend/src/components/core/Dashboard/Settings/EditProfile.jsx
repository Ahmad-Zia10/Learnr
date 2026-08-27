import { useState } from "react"
import { useUpdateProfileMutation } from "../../../../services/profileApi"

const GENDERS = ["Male", "Female", "Other"]

const fieldClasses =
  "w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"

function EditProfile({ user }) {
  const details = user?.additionalDetails

  const [formData, setFormData] = useState({
    dateOfBirth: details?.dateOfBirth ?? "",
    gender: details?.gender ?? "",
    contactNumber: details?.contactNumber ?? "",
    about: details?.about ?? "",
  })
  const [status, setStatus] = useState(null)

  const [updateProfile, { isLoading }] = useUpdateProfileMutation()

  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    try {
      await updateProfile(formData).unwrap()
      setStatus({ ok: true, message: "Profile updated." })
    } catch (err) {
      setStatus({
        ok: false,
        message: err?.data?.message || "Could not update the profile.",
      })
    }
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-8 rounded-md border border-richblack-700 bg-richblack-800 p-8"
    >
      <p className="text-[1.125rem] font-semibold">Profile Information</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <label>
          <p className="mb-1 text-[0.875rem]">Date of Birth</p>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleOnChange}
            className={fieldClasses}
          />
        </label>

        <label>
          <p className="mb-1 text-[0.875rem]">Gender</p>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleOnChange}
            className={fieldClasses}
          >
            <option value="">Select gender</option>
            {GENDERS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          <p className="mb-1 text-[0.875rem]">Phone Number</p>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleOnChange}
            placeholder="12345 67890"
            className={fieldClasses}
          />
        </label>

        <label>
          <p className="mb-1 text-[0.875rem]">About</p>
          <input
            type="text"
            name="about"
            value={formData.about}
            onChange={handleOnChange}
            placeholder="Enter Bio Details"
            className={fieldClasses}
          />
        </label>
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
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  )
}

export default EditProfile
