import { useState } from "react"
import { RiEditBoxLine, RiDeleteBin6Line } from "react-icons/ri"
import { IoIosArrowDown, IoIosAddCircleOutline } from "react-icons/io"
import { MdOutlineFormatListNumbered } from "react-icons/md"
import LectureModal from "./LectureModal"
import {
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useDeleteSubSectionMutation,
} from "../../../../services/courseApi"

//Step 2: build the course out of sections, each holding its lectures.
function CourseBuilderForm({ course, onBack, onComplete, onCourseChange }) {
  const [sectionName, setSectionName] = useState("")
  const [editingSectionId, setEditingSectionId] = useState(null)
  const [openSection, setOpenSection] = useState(null)
  const [modal, setModal] = useState(null)
  const [error, setError] = useState(null)

  const [createSection, { isLoading: isCreating }] = useCreateSectionMutation()
  const [updateSection] = useUpdateSectionMutation()
  const [deleteSection] = useDeleteSectionMutation()
  const [deleteSubSection] = useDeleteSubSectionMutation()

  const sections = course?.courseContent ?? []

  const handleSubmitSection = async (e) => {
    e.preventDefault()
    setError(null)

    if (!sectionName.trim()) return

    try {
      if (editingSectionId) {
        await updateSection({
          sectionId: editingSectionId,
          sectionName,
        }).unwrap()
        setEditingSectionId(null)
      } else {
        //the backend hands back the course with its content populated
        const updated = await createSection({
          sectionName,
          courseId: course._id,
        }).unwrap()
        if (updated) onCourseChange(updated)
      }
      setSectionName("")
    } catch (err) {
      setError(err?.data?.message || "Could not save the section.")
    }
  }

  const handleDeleteSection = async (sectionId) => {
    setError(null)
    try {
      await deleteSection({ courseId: course._id, sectionId }).unwrap()
    } catch (err) {
      setError(err?.data?.message || "Could not delete the section.")
    }
  }

  const handleDeleteLecture = async (subSectionId) => {
    setError(null)
    try {
      await deleteSubSection({ subSectionId }).unwrap()
    } catch (err) {
      setError(err?.data?.message || "Could not delete the lecture.")
    }
  }

  const handleNext = () => {
    //a publishable course needs at least one lecture to watch
    if (!sections.length) {
      setError("Add at least one section before continuing.")
      return
    }

    const hasLecture = sections.some((section) => section.subSection?.length)
    if (!hasLecture) {
      setError("Add at least one lecture before continuing.")
      return
    }

    onComplete()
  }

  return (
    <div className="rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <p className="text-[1.375rem] font-semibold text-richblack-5">
        Course Builder
      </p>

      {/* Existing sections */}
      {sections.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-md border border-richblack-600">
          {sections.map((section) => {
            const isOpen = openSection === section._id
            return (
              <div
                key={section._id}
                className="border-b border-richblack-600 last:border-b-0"
              >
                <div className="flex items-center justify-between gap-x-3 bg-richblack-700 px-4 py-3">
                  <span className="flex items-center gap-x-3 text-[0.938rem] font-medium text-richblack-5">
                    <MdOutlineFormatListNumbered className="text-richblack-300" />
                    {section.sectionName}
                  </span>

                  <span className="flex items-center gap-x-3">
                    <button
                      type="button"
                      aria-label="Rename section"
                      onClick={() => {
                        setEditingSectionId(section._id)
                        setSectionName(section.sectionName)
                      }}
                      className="cursor-pointer text-richblack-300"
                    >
                      <RiEditBoxLine size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete section"
                      onClick={() => handleDeleteSection(section._id)}
                      className="cursor-pointer text-richblack-300"
                    >
                      <RiDeleteBin6Line size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Toggle section"
                      onClick={() => setOpenSection(isOpen ? null : section._id)}
                      className="cursor-pointer text-richblack-300"
                    >
                      <IoIosArrowDown
                        className={`transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </span>
                </div>

                {isOpen && (
                  <div className="bg-richblack-800 px-6 py-2">
                    {(section.subSection ?? []).map((lecture) => (
                      <div
                        key={lecture._id}
                        className="flex items-center justify-between border-b border-richblack-600 py-2 last:border-b-0"
                      >
                        <span className="text-[0.875rem] text-richblack-50">
                          {lecture.title}
                        </span>
                        <span className="flex items-center gap-x-3">
                          <button
                            type="button"
                            aria-label="Edit lecture"
                            onClick={() =>
                              setModal({ sectionId: section._id, lecture })
                            }
                            className="cursor-pointer text-richblack-300"
                          >
                            <RiEditBoxLine size={15} />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete lecture"
                            onClick={() => handleDeleteLecture(lecture._id)}
                            className="cursor-pointer text-richblack-300"
                          >
                            <RiDeleteBin6Line size={15} />
                          </button>
                        </span>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setModal({ sectionId: section._id, lecture: null })
                      }
                      className="mt-2 flex cursor-pointer items-center gap-x-2 py-2 text-[0.875rem] text-yellow-50"
                    >
                      <IoIosAddCircleOutline size={18} />
                      Add Lecture
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add / rename a section */}
      <form onSubmit={handleSubmitSection} className="mt-6">
        <label className="block">
          <p className="mb-1 text-[0.875rem] text-richblack-5">
            Section Name <sup className="text-pink-200">*</sup>
          </p>
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Add a section to build your course"
            className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
          />
        </label>

        <div className="mt-3 flex items-center gap-x-4">
          <button
            type="submit"
            disabled={isCreating}
            className="flex cursor-pointer items-center gap-x-2 rounded-md border border-yellow-50 px-5 py-2 text-[0.875rem] font-medium text-yellow-50
            disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IoIosAddCircleOutline size={18} />
            {editingSectionId ? "Rename Section" : "Create Section"}
          </button>

          {editingSectionId && (
            <button
              type="button"
              onClick={() => {
                setEditingSectionId(null)
                setSectionName("")
              }}
              className="cursor-pointer text-[0.875rem] text-richblack-300 underline"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {error && <p className="mt-4 text-[0.875rem] text-pink-200">{error}</p>}

      <div className="mt-8 flex justify-end gap-x-3">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-md bg-richblack-700 px-5 py-2 font-medium text-richblack-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="cursor-pointer rounded-md bg-yellow-50 px-5 py-2 font-medium text-richblack-900"
        >
          Next
        </button>
      </div>

      {modal && (
        <LectureModal
          sectionId={modal.sectionId}
          lecture={modal.lecture}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

export default CourseBuilderForm
