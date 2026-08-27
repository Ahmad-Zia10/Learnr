import { useState } from "react"
import {
  useGetCategoriesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../../../../services/courseApi"

const fieldClasses =
  "w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"

//Step 1: the course's own details. Creates the course, or edits it in place.
function CourseInformationForm({ course, onComplete }) {
  const { data: categories = [] } = useGetCategoriesQuery()
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation()
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation()

  const [formData, setFormData] = useState({
    courseName: course?.courseName ?? "",
    courseDescription: course?.courseDescription ?? "",
    price: course?.price ?? "",
    category: course?.category?._id ?? course?.category ?? "",
    whatYouWillLearn: course?.whatYouWillLearn ?? "",
  })
  const [tags, setTags] = useState(course?.tag ?? [])
  const [tagDraft, setTagDraft] = useState("")
  const [instructions, setInstructions] = useState(course?.instructions ?? [])
  const [instructionDraft, setInstructionDraft] = useState("")
  const [thumbnail, setThumbnail] = useState(null)
  const [error, setError] = useState(null)

  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const addTag = () => {
    const value = tagDraft.trim()
    if (!value || tags.includes(value)) return
    setTags((prev) => [...prev, value])
    setTagDraft("")
  }

  const addInstruction = () => {
    const value = instructionDraft.trim()
    if (!value || instructions.includes(value)) return
    setInstructions((prev) => [...prev, value])
    setInstructionDraft("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!course && !thumbnail) {
      setError("A course thumbnail is required.")
      return
    }

    //multipart, because the thumbnail rides along with the fields
    const payload = new FormData()
    payload.append("courseName", formData.courseName)
    payload.append("courseDescription", formData.courseDescription)
    payload.append("price", formData.price)
    payload.append("category", formData.category)
    payload.append("whatYouWillLearn", formData.whatYouWillLearn)
    payload.append("tag", JSON.stringify(tags))
    payload.append("instructions", JSON.stringify(instructions))
    if (thumbnail) payload.append("thumbnailImage", thumbnail)

    try {
      if (course) {
        payload.append("courseId", course._id)
        const updated = await updateCourse(payload).unwrap()
        onComplete(updated)
      } else {
        const created = await createCourse(payload).unwrap()
        onComplete(created)
      }
    } catch (err) {
      setError(err?.data?.message || "Could not save the course.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-richblack-700 bg-richblack-800 p-6"
    >
      <label className="block">
        <p className="mb-1 text-[0.875rem] text-richblack-5">
          Course Title <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={handleOnChange}
          placeholder="Enter Course Title"
          className={fieldClasses}
        />
      </label>

      <label className="mt-5 block">
        <p className="mb-1 text-[0.875rem] text-richblack-5">
          Course Short Description <sup className="text-pink-200">*</sup>
        </p>
        <textarea
          required
          rows={4}
          name="courseDescription"
          value={formData.courseDescription}
          onChange={handleOnChange}
          placeholder="Enter Description"
          className={`${fieldClasses} resize-none`}
        />
      </label>

      <label className="mt-5 block">
        <p className="mb-1 text-[0.875rem] text-richblack-5">
          Price <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="number"
          min="0"
          name="price"
          value={formData.price}
          onChange={handleOnChange}
          placeholder="Enter Price"
          className={fieldClasses}
        />
      </label>

      <label className="mt-5 block">
        <p className="mb-1 text-[0.875rem] text-richblack-5">
          Category <sup className="text-pink-200">*</sup>
        </p>
        <select
          required
          name="category"
          value={formData.category}
          onChange={handleOnChange}
          className={fieldClasses}
        >
          <option value="">Choose a Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      {/* Tags */}
      <div className="mt-5">
        <p className="mb-1 text-[0.875rem] text-richblack-5">Tags</p>
        {tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-x-2 rounded-full bg-yellow-400 px-3 py-1 text-[0.75rem] text-richblack-5"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                  className="cursor-pointer"
                  aria-label={`Remove ${tag}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-x-3">
          <input
            type="text"
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTag()
              }
            }}
            placeholder="Choose a Tag"
            className={fieldClasses}
          />
          <button
            type="button"
            onClick={addTag}
            className="cursor-pointer rounded-md bg-richblack-700 px-4 text-[0.875rem] text-yellow-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Thumbnail */}
      <label className="mt-5 block">
        <p className="mb-1 text-[0.875rem] text-richblack-5">
          Course Thumbnail <sup className="text-pink-200">*</sup>
        </p>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-[0.875rem] text-richblack-200"
        />
        <p className="mt-1 text-[0.75rem] text-richblack-300">
          Aspect ratio 16:9 &middot; Recommended size 1024x576
        </p>
      </label>

      <label className="mt-5 block">
        <p className="mb-1 text-[0.875rem] text-richblack-5">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </p>
        <textarea
          required
          rows={4}
          name="whatYouWillLearn"
          value={formData.whatYouWillLearn}
          onChange={handleOnChange}
          placeholder="Enter Benefits of the course"
          className={`${fieldClasses} resize-none`}
        />
      </label>

      {/* Requirements */}
      <div className="mt-5">
        <p className="mb-1 text-[0.875rem] text-richblack-5">
          Requirements/Instructions
        </p>
        {instructions.length > 0 && (
          <ul className="mb-2 flex flex-col gap-y-1 text-[0.875rem] text-richblack-5">
            {instructions.map((item) => (
              <li key={item} className="flex items-center gap-x-2">
                {item}
                <button
                  type="button"
                  onClick={() =>
                    setInstructions((prev) => prev.filter((i) => i !== item))
                  }
                  className="cursor-pointer text-[0.75rem] text-pink-200"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-x-3">
          <input
            type="text"
            value={instructionDraft}
            onChange={(e) => setInstructionDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addInstruction()
              }
            }}
            placeholder="Enter a requirement"
            className={fieldClasses}
          />
          <button
            type="button"
            onClick={addInstruction}
            className="cursor-pointer rounded-md bg-richblack-700 px-4 text-[0.875rem] text-yellow-50"
          >
            Add
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-[0.875rem] text-pink-200">{error}</p>}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="cursor-pointer rounded-md bg-yellow-50 px-6 py-2 font-medium text-richblack-900
          disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating || isUpdating ? "Saving..." : "Next"}
        </button>
      </div>
    </form>
  )
}

export default CourseInformationForm
