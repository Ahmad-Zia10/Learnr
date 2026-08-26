import { useRef } from "react"

const OTP_LENGTH = 6

//Six single-character boxes. Empty boxes render a dash, matching the design.
function OtpInput({ value, onChange, length = OTP_LENGTH }) {
  const inputRefs = useRef([])

  const digits = value.padEnd(length, " ").slice(0, length).split("")

  const setDigit = (index, digit) => {
    const next = digits.map((d, i) => (i === index ? digit : d)).join("")
    //trailing spaces are padding, not real input
    onChange(next.replace(/\s+$/, ""))
  }

  const handleChange = (index, e) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1)
    if (!digit) return
    setDigit(index, digit)
    if (index < length - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      if (digits[index].trim()) {
        setDigit(index, " ")
      } else if (index > 0) {
        setDigit(index - 1, " ")
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  //Let the user paste the whole code at once.
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (!pasted) return
    onChange(pasted)
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className="flex gap-x-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label={`Digit ${index + 1}`}
          value={digit.trim()}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          placeholder="-"
          className="h-[48px] w-[48px] rounded-[0.5rem] bg-richblack-800 text-center text-richblack-5
          caret-yellow-50 placeholder:text-richblack-500 focus:border focus:border-yellow-50 focus:outline-none"
        />
      ))}
    </div>
  )
}

export default OtpInput
