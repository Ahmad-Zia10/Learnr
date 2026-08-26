import { useState } from "react"
import { MdOutlineOndemandVideo } from "react-icons/md"
import { IoIosArrowDown } from "react-icons/io"

//One collapsible course section listing its lectures.
function CourseAccordion({ section, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const lectures = section?.subSection ?? []

  return (
    <div className="border-b border-richblack-600 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-x-4 bg-richblack-700 px-6 py-4 text-left"
      >
        <span className="flex items-center gap-x-3">
          <IoIosArrowDown
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
          <span className="text-[0.875rem] text-richblack-5">
            {section.sectionName}
          </span>
        </span>
        <span className="text-[0.875rem] text-yellow-25">
          {lectures.length} lecture{lectures.length === 1 ? "" : "s"}
        </span>
      </button>

      {open && (
        <div className="bg-richblack-900 px-6 py-2">
          {lectures.length ? (
            lectures.map((lecture) => (
              <div
                key={lecture._id}
                className="flex items-center justify-between gap-x-4 py-2 text-[0.875rem] text-richblack-50"
              >
                <span className="flex items-center gap-x-3">
                  <MdOutlineOndemandVideo />
                  {lecture.title}
                </span>
                <span className="text-richblack-300">{lecture.timeDuration}</span>
              </div>
            ))
          ) : (
            <p className="py-2 text-[0.875rem] text-richblack-400">
              No lectures in this section yet.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default CourseAccordion
