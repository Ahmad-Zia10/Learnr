import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { IoIosArrowDown } from "react-icons/io"
import { MdOutlineOndemandVideo } from "react-icons/md"

//Course outline with a completion checkbox per lecture.
function VideoSidebar({ course, completedVideos, onToggleComplete, onAddReview }) {
  const navigate = useNavigate()
  const { courseId, sectionId, subSectionId } = useParams()
  const [openSection, setOpenSection] = useState(sectionId)

  //Keep the section holding the active lecture expanded.
  useEffect(() => {
    if (sectionId) setOpenSection(sectionId)
  }, [sectionId])

  const sections = course?.courseContent ?? []

  const totalLectures = sections.reduce(
    (total, section) => total + (section.subSection?.length ?? 0),
    0
  )

  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-r border-richblack-700">
      <div className="border-b border-richblack-700 px-5 py-6">
        <p className="text-[1.125rem] font-semibold text-richblack-5">
          {course?.courseName}{" "}
          <span className="text-[0.875rem] font-normal text-caribbeangreen-100">
            {completedVideos.length}/{totalLectures}
          </span>
        </p>

        <button
          type="button"
          onClick={onAddReview}
          className="mt-4 cursor-pointer rounded-md bg-yellow-50 px-5 py-2 text-[0.875rem] font-medium text-richblack-900"
        >
          Add Review
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => {
          const isOpen = openSection === section._id
          const lectures = section.subSection ?? []

          return (
            <div key={section._id} className="border-b border-richblack-700">
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : section._id)}
                className="flex w-full cursor-pointer items-center justify-between gap-x-3 px-5 py-4 text-left"
              >
                <span className="text-[0.875rem] text-richblack-5">
                  {section.sectionName}
                </span>
                <IoIosArrowDown
                  className={`shrink-0 text-richblack-300 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="bg-richblack-900 pb-2">
                  {lectures.map((lecture) => {
                    const isActive = lecture._id === subSectionId
                    const isComplete = completedVideos.includes(lecture._id)

                    return (
                      <div
                        key={lecture._id}
                        className={`flex items-center gap-x-3 px-5 py-2 ${
                          isActive ? "bg-yellow-800" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isComplete}
                          onChange={() =>
                            onToggleComplete(lecture._id, isComplete)
                          }
                          aria-label={`Mark ${lecture.title} complete`}
                          className="h-4 w-4 shrink-0 cursor-pointer accent-yellow-50"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/view-course/${courseId}/section/${section._id}/sub-section/${lecture._id}`
                            )
                          }
                          className={`flex flex-1 cursor-pointer items-center gap-x-2 text-left text-[0.875rem] ${
                            isActive ? "text-richblack-5" : "text-richblack-200"
                          } ${isComplete ? "line-through decoration-richblack-400" : ""}`}
                        >
                          {lecture.title}
                          <MdOutlineOndemandVideo className="shrink-0 text-richblack-400" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default VideoSidebar
