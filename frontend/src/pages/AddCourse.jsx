import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { IoIosArrowBack } from "react-icons/io"
import Stepper from "../components/core/Dashboard/AddCourse/Stepper"
import UploadTips from "../components/core/Dashboard/AddCourse/UploadTips"
import CourseInformationForm from "../components/core/Dashboard/AddCourse/CourseInformationForm"
import CourseBuilderForm from "../components/core/Dashboard/AddCourse/CourseBuilderForm"
import PublishForm from "../components/core/Dashboard/AddCourse/PublishForm"
import { useGetFullCourseDetailsQuery } from "../services/courseApi"

//Three-step wizard, used both to create a course and to edit an existing one.
function AddCourse() {
  const { courseId } = useParams()
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState(null)

  //When editing, load the course; the query is skipped for a brand new one.
  //Once a course exists it can be re-read by id, which keeps the builder in
  //step with sections and lectures added through their own endpoints.
  const activeId = courseId ?? draft?._id

  const { data, isFetching } = useGetFullCourseDetailsQuery(activeId, {
    skip: !activeId,
  })

  //Prefer the server's copy once it has loaded; the draft covers the gap
  //between creating the course and that first fetch resolving.
  const course = data?.course ?? draft ?? null

  if (courseId && isFetching && !draft) {
    return <p className="text-richblack-100">Loading course...</p>
  }

  return (
    <div className="text-richblack-5">
      <Link
        to="/dashboard/my-courses"
        className="flex items-center gap-x-2 text-[0.875rem] text-richblack-300"
      >
        <IoIosArrowBack />
        Back to Dashboard
      </Link>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <Stepper current={step} />

          {step === 1 && (
            <CourseInformationForm
              course={course}
              onComplete={(saved) => {
                //keep the saved course so the builder knows its id
                setDraft(saved)
                setStep(2)
              }}
            />
          )}

          {step === 2 && (
            <CourseBuilderForm
              course={course}
              onBack={() => setStep(1)}
              onComplete={() => setStep(3)}
              onCourseChange={setDraft}
            />
          )}

          {step === 3 && (
            <PublishForm course={course} onBack={() => setStep(2)} />
          )}
        </div>

        <div className="w-full lg:max-w-[380px]">
          <UploadTips />
        </div>
      </div>
    </div>
  )
}

export default AddCourse
