import { evaluatePassword } from "../../../utils/passwordRules.js"
import { IoIosCheckmarkCircle } from "react-icons/io"

//Two-column live checklist shown under the new-password fields.
function PasswordChecklist({ password }) {
  const rules = evaluatePassword(password)

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
      {rules.map((rule) => (
        <li key={rule.id} className="flex items-center gap-x-2">
          <IoIosCheckmarkCircle
            fontSize={14}
            className={rule.passed ? "text-caribbeangreen-100" : "text-richblack-500"}
          />
          <span
            className={`text-[0.75rem] leading-[1.125rem] ${
              rule.passed ? "text-caribbeangreen-100" : "text-richblack-400"
            }`}
          >
            {rule.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default PasswordChecklist
