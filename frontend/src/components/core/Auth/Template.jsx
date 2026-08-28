import { useState } from "react"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import Tab from "./Tab"

const ACCOUNT_TABS = [
  { label: "Student", value: "Student" },
  { label: "Instructors", value: "Instructor" },
]

//Two-column shell for the login screen: form on the left, framed image on the right.
function Template({ title, description1, description2, image, formType }) {
  const [accountType, setAccountType] = useState("Student")

  return (
    <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
      <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
          {title}
        </h1>
        <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
          <span className="text-richblack-100">{description1}</span>{" "}
          <span className="font-edu-sa font-bold italic text-blue-100">
            {description2}
          </span>
        </p>

        <div className="mt-6">
          <Tab tabs={ACCOUNT_TABS} value={accountType} onChange={setAccountType} />
        </div>

        {formType === "signup" ? (
          <SignupForm accountType={accountType} />
        ) : (
          <LoginForm />
        )}
      </div>

      <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
        {/* offset crosshatch panel sitting behind-right of the photo */}
        <div
          className="absolute -right-3 top-4 z-0 hidden h-full w-full rounded-sm md:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #FFFFFF22 0 1px, transparent 1px 8px)",
          }}
        />
        <img
          src={image}
          alt="Students learning with StudyNotion"
          width={558}
          height={504}
          loading="lazy"
          className="relative z-10"
        />
      </div>
    </div>
  )
}

export default Template
