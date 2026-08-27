import { useState } from "react"
import { IoClose } from "react-icons/io5"
import {
  useCreateSubSectionMutation,
  useUpdateSubSectionMutation,
} from "../../../../services/courseApi"

const fieldClasses =
  "w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"

//Splits "HH:MM:SS" back into its parts for editing.
const splitDuration = (value = "") => {
  const [hh = "", mm = "", ss = ""] = String(value).split(":")
  return { hh, mm, ss }
}

//Add or edit one lecture inside a section.
function LectureModal({ sectionId, lecture, onClose }) {
  const existing = splitDuration(lecture?.timeDuration)

  const [title, setTitle] = useState(lecture?.title ?? "")
  const [description, setDescription] = useState(lecture?.description ?? "")
  const [hh, setHh] = useState(existing.hh)
  const [mm, setMm] = useState(existing.mm)
  const [ss, setSs] = useState(existing.ss)
  const [video, setVideo] = useState(null)
  const [error, setError] = useState(null)

  const [createSubSection, { isLoading: isCreating }] =
    useCreateSubSectionMutation()
  const [updateSubSection, { isLoading: isUpdating }] =
    useUpdateSubSectionMutation()

  const pad = (value) => String(value || 0).padStart(2, "0")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!lecture && !video) {
      setError("A lecture video is required.")
      return
    }

    const timeDuration = `${pad(hh)}:${pad(mm)}:${pad(ss)}`

    const payload = new FormData()
    payload.append("title", title)
    payload.append("description", description)
    payload.append("timeDuration", timeDuration)
    if (video) payload.append("lectureVideo", video)

    try {
      if (lecture) {
        payload.append("subSectionId", lecture._id)
        await updateSubSection(payload).unwrap()
      } else {
        payload.append("sectionId", sectionId)
        await createSubSection(payload).unwrap()
      }
      onClose()
    } catch (err) {
      setError(err?.data?.message || "Could not save the lecture.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
      <div className="my-8 w-full max-w-[620px] overflow-hidden rounded-lg border border-richblack-600 bg-richblack-800">
        <div className="flex items-center justify-between bg-richblack-700 px-6 py-4">
          <p className="text-[1.125rem] font-semibold text-richblack-5">
            {lecture ? "Editing Lecture" : "Adding Lecture"}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer text-richblack-5"
          >
            <IoClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <label className="block">
            <p className="mb-1 text-[0.875rem] text-richblack-5">
              Lecture Video <sup className="text-pink-200">*</sup>
            </p>
            <input
              type="file"
              accept="video/mp4, video/webm"
              onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
              className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-[0.875rem] text-richblack-200"
            />
            <p className="mt-1 text-[0.75rem] text-richblack-300">
              Aspect ratio 16:9 &middot; Recommended size 1024x576
            </p>
          </label>

          <label className="mt-5 block">
            <p className="mb-1 text-[0.875rem] text-richblack-5">
              Lecture Title <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Lecture Title"
              className={fieldClasses}
            />
          </label>

          <div className="mt-5">
            <p className="mb-1 text-[0.875rem] text-richblack-5">
              Video Playback Time <sup className="text-pink-200">*</sup>
            </p>
            <div className="flex gap-x-3">
              {[
                { label: "HH", value: hh, set: setHh, max: 23 },
                { label: "MM", value: mm, set: setMm, max: 59 },
                { label: "SS", value: ss, set: setSs, max: 59 },
              ].map((part) => (
                <label key={part.label} className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max={part.max}
                    value={part.value}
                    onChange={(e) => part.set(e.target.value)}
                    placeholder={part.label}
                    className={fieldClasses}
                  />
                  <span className="mt-1 block text-[0.75rem] text-richblack-300">
                    {part.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="mt-5 block">
            <p className="mb-1 text-[0.875rem] text-richblack-5">
              Lecture Description <sup className="text-pink-200">*</sup>
            </p>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Lecture Description"
              className={`${fieldClasses} resize-none`}
            />
          </label>

          {error && (
            <p className="mt-4 text-[0.875rem] text-pink-200">{error}</p>
          )}

          <div className="mt-6 flex justify-end gap-x-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md bg-richblack-700 px-5 py-2 font-medium text-richblack-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="cursor-pointer rounded-md bg-yellow-50 px-5 py-2 font-medium text-richblack-900
              disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating || isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LectureModal
