import { useState } from "react"
import countryCodes from "../../../data/countrycode.json"
import { useContactUsMutation } from "../../../services/contactApi"

const fieldClasses =
  "w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"

const INITIAL = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+91",
  phoneNumber: "",
  message: "",
}

function ContactForm() {
  const [formData, setFormData] = useState(INITIAL)
  const [status, setStatus] = useState(null)

  const [contactUs, { isLoading }] = useContactUsMutation()

  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    try {
      const response = await contactUs(formData).unwrap()
      setStatus({
        ok: true,
        message: response?.message || "Thanks for reaching out.",
      })
      setFormData(INITIAL)
    } catch (err) {
      setStatus({
        ok: false,
        message: err?.data?.message || "Could not send your message.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-5 sm:flex-row">
        <label className="flex-1">
          <p className="mb-1 text-[0.875rem] text-richblack-5">First Name</p>
          <input
            required
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleOnChange}
            placeholder="Enter first name"
            className={fieldClasses}
          />
        </label>

        <label className="flex-1">
          <p className="mb-1 text-[0.875rem] text-richblack-5">Last Name</p>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleOnChange}
            placeholder="Enter last name"
            className={fieldClasses}
          />
        </label>
      </div>

      <label>
        <p className="mb-1 text-[0.875rem] text-richblack-5">Email Address</p>
        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className={fieldClasses}
        />
      </label>

      <div>
        <p className="mb-1 text-[0.875rem] text-richblack-5">Phone Number</p>
        <div className="flex gap-x-3">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleOnChange}
            aria-label="Country code"
            className="w-[90px] rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
          >
            {countryCodes.map((entry) => (
              <option key={entry.country} value={entry.code}>
                {entry.code}
              </option>
            ))}
          </select>

          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleOnChange}
            placeholder="12345 67890"
            className={fieldClasses}
          />
        </div>
      </div>

      <label>
        <p className="mb-1 text-[0.875rem] text-richblack-5">Message</p>
        <textarea
          required
          rows={6}
          name="message"
          value={formData.message}
          onChange={handleOnChange}
          placeholder="Enter your message here"
          className={`${fieldClasses} resize-none`}
        />
      </label>

      {status && (
        <p
          className={`text-[0.875rem] ${
            status.ok ? "text-caribbeangreen-100" : "text-pink-200"
          }`}
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="cursor-pointer rounded-md bg-yellow-50 py-[10px] font-medium text-richblack-900
        disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}

export default ContactForm
