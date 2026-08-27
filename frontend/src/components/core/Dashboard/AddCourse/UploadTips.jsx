const TIPS = [
  "Set the Course Price option or make it free.",
  "Standard size for the course thumbnail is 1024x576.",
  "Video section controls the course overview video.",
  "Course Builder is where you create & organize a course.",
  "Add Topics in the Course Builder section to create lessons, quizzes, and assignments.",
  "Information from the Additional Data section shows up on the course single page.",
  "Make Announcements to notify any important",
  "Notes to all enrolled students at once.",
]

function UploadTips() {
  return (
    <aside className="h-fit rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <p className="text-[1.125rem] font-semibold text-richblack-5">
        ⚡ Course Upload Tips
      </p>
      <ul className="mt-4 list-disc space-y-3 pl-4 text-[0.875rem] text-richblack-5">
        {TIPS.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </aside>
  )
}

export default UploadTips
