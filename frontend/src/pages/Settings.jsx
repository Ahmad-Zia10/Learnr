import ChangeProfilePicture from "../components/core/Dashboard/Settings/ChangeProfilePicture"
import EditProfile from "../components/core/Dashboard/Settings/EditProfile"
import UpdatePasswordSection from "../components/core/Dashboard/Settings/UpdatePasswordSection"
import DeleteAccount from "../components/core/Dashboard/Settings/DeleteAccount"
import { useGetUserDetailsQuery } from "../services/profileApi"

function Settings() {
  const { data: user, isFetching } = useGetUserDetailsQuery()

  if (isFetching) {
    return <p className="text-richblack-100">Loading settings...</p>
  }

  return (
    <div className="text-richblack-5">
      <p className="text-[0.875rem] text-richblack-300">
        Home / Dashboard / <span className="text-yellow-25">Settings</span>
      </p>
      <h1 className="mt-2 mb-8 text-[1.875rem] font-semibold">Edit Profile</h1>

      <ChangeProfilePicture user={user} />
      <EditProfile user={user} />
      <UpdatePasswordSection />
      <DeleteAccount />
    </div>
  )
}

export default Settings
