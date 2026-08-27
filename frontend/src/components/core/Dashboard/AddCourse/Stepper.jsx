import { FaCheck } from "react-icons/fa"

const STEPS = [
  { id: 1, title: "Course Information" },
  { id: 2, title: "Course Builder" },
  { id: 3, title: "Publish" },
]

function Stepper({ current }) {
  return (
    <div className="mb-8">
      <div className="flex w-full justify-center">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-[0.875rem] ${
                current > step.id
                  ? "border-yellow-50 bg-yellow-50 text-richblack-900"
                  : current === step.id
                    ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                    : "border-richblack-700 bg-richblack-800 text-richblack-300"
              }`}
            >
              {current > step.id ? <FaCheck size={12} /> : step.id}
            </div>

            {index !== STEPS.length - 1 && (
              <div
                className={`h-[1px] w-[80px] border-b-2 border-dashed sm:w-[180px] ${
                  current > step.id
                    ? "border-yellow-50"
                    : "border-richblack-500"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 flex w-full select-none justify-center gap-x-[52px] sm:gap-x-[130px]">
        {STEPS.map((step) => (
          <p
            key={step.id}
            className={`text-[0.875rem] ${
              current >= step.id ? "text-richblack-5" : "text-richblack-500"
            }`}
          >
            {step.title}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Stepper
