import { useEffect, useRef } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"

//Finds the active lecture plus the ones on either side of it, so the player
//can offer Previous / Next across section boundaries.
const buildPlaylist = (course) =>
  (course?.courseContent ?? []).flatMap((section) =>
    (section.subSection ?? []).map((lecture) => ({
      sectionId: section._id,
      lecture,
    }))
  )

function VideoDetails() {
  const { courseId, subSectionId } = useParams()
  const navigate = useNavigate()
  const { course } = useOutletContext()
  const videoRef = useRef(null)

  const playlist = buildPlaylist(course)
  const index = playlist.findIndex((item) => item.lecture._id === subSectionId)
  const current = playlist[index]

  //Reload the element when the lecture changes, otherwise the old video keeps playing.
  useEffect(() => {
    videoRef.current?.load()
  }, [subSectionId])

  if (!current) {
    return (
      <p className="p-10 text-richblack-100">
        Pick a lecture from the list to start watching.
      </p>
    )
  }

  const goTo = (item) =>
    navigate(
      `/view-course/${courseId}/section/${item.sectionId}/sub-section/${item.lecture._id}`
    )

  const previous = index > 0 ? playlist[index - 1] : null
  const next = index < playlist.length - 1 ? playlist[index + 1] : null

  return (
    <div className="flex flex-col gap-y-5 p-6">
      <video
        ref={videoRef}
        controls
        controlsList="nodownload"
        className="w-full rounded-md bg-black"
        poster={course?.thumbnail}
      >
        <source src={current.lecture.video} type="video/mp4" />
        Your browser cannot play this video.
      </video>

      <div className="flex gap-x-3">
        <button
          type="button"
          onClick={() => previous && goTo(previous)}
          disabled={!previous}
          className="cursor-pointer rounded-md bg-richblack-700 px-5 py-2 text-[0.875rem] font-medium text-richblack-50
          disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => next && goTo(next)}
          disabled={!next}
          className="cursor-pointer rounded-md bg-yellow-50 px-5 py-2 text-[0.875rem] font-medium text-richblack-900
          disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div>
        <h1 className="text-[1.75rem] font-semibold text-richblack-5">
          {current.lecture.title}
        </h1>
        <p className="mt-2 text-[0.938rem] text-richblack-200">
          {current.lecture.description}
        </p>
      </div>
    </div>
  )
}

export default VideoDetails
