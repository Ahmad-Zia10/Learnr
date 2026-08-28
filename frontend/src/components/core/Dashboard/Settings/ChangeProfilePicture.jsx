import { useRef, useState } from "react"
import { useUpdateDisplayImageMutation } from "../../../../services/profileApi"

function ChangeProfilePicture({ user }) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const [updateDisplayImage, { isLoading }] = useUpdateDisplayImageMutation()

  const handleSelect = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) return
    setError(null)

    //the backend reads this through multer as `displayPicture`
    const formData = new FormData()
    formData.append("displayPicture", file)

    try {
      await updateDisplayImage(formData).unwrap()
      setFile(null)
    } catch (err) {
      setError(err?.data?.message || "Could not upload the picture.")
    }
  }

  return (
    <section className="flex items-center gap-x-4 rounded-md border border-richblack-700 bg-richblack-800 p-8">
      <img
        src={preview || user?.image}
        alt={user?.firstName}
        className="aspect-square w-[78px] rounded-full object-cover"
      />

      <div>
        <p className="font-medium">Change Profile Picture</p>

        <div className="mt-3 flex gap-x-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-md bg-richblack-700 px-5 py-2 text-[0.875rem] font-medium text-richblack-50"
          >
            Select
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="cursor-pointer rounded-md bg-yellow-50 px-5 py-2 text-[0.875rem] font-medium text-richblack-900
            disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {error && <p className="mt-2 text-[0.875rem] text-pink-200">{error}</p>}
      </div>
    </section>
  )
}

export default ChangeProfilePicture
