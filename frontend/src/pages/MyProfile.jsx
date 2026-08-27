import { useNavigate } from "react-router-dom"
import { RiEditBoxLine } from "react-icons/ri"
import { useGetUserDetailsQuery } from "../services/profileApi"

function EditButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-x-2 rounded-md bg-yellow-50 px-5 py-2 font-medium text-richblack-900"
    >
      <RiEditBoxLine />
      Edit
    </button>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[0.875rem] text-richblack-500">{label}</p>
      <p className="mt-1 text-[0.875rem] text-richblack-5">{value || "Add"}</p>
    </div>
  )
}

function MyProfile() {
  const navigate = useNavigate()
  const { data: user, isFetching } = useGetUserDetailsQuery()

  if (isFetching) {
    return <p className="text-richblack-100">Loading profile...</p>
  }

  const details = user?.additionalDetails

  return (
    <div className="text-richblack-5">
      <p className="text-[0.875rem] text-richblack-300">
        Home / Dashboard / <span className="text-yellow-25">My Profile</span>
      </p>
      <h1 className="mt-2 text-[1.875rem] font-semibold">My Profile</h1>

      {/* Identity card */}
      <section className="mt-8 flex items-center justify-between gap-x-4 rounded-md border border-richblack-700 bg-richblack-800 p-8">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={user?.firstName}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div>
            <p className="text-[1.125rem] font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[0.875rem] text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <EditButton onClick={() => navigate("/dashboard/settings")} />
      </section>

      {/* Personal details */}
      <section className="mt-8 rounded-md border border-richblack-700 bg-richblack-800 p-8">
        <div className="flex items-center justify-between">
          <p className="text-[1.125rem] font-semibold">Personal Details</p>
          <EditButton onClick={() => navigate("/dashboard/settings")} />
        </div>

        <div className="mt-6 grid max-w-[600px] grid-cols-2 gap-x-8 gap-y-6">
          <Field label="First Name" value={user?.firstName} />
          <Field label="Last Name" value={user?.lastName} />
          <Field label="Email" value={user?.email} />
          <Field label="Phone Number" value={details?.contactNumber} />
          <Field label="Gender" value={details?.gender} />
          <Field label="Date of Birth" value={details?.dateOfBirth} />
        </div>

        {details?.about && (
          <div className="mt-6 max-w-[600px]">
            <p className="text-[0.875rem] text-richblack-500">About</p>
            <p className="mt-1 text-[0.875rem]">{details.about}</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default MyProfile
