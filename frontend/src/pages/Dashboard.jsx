import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import Sidebar from "../components/common/Sidebar"
import { useGetUserDetailsQuery } from "../services/profileApi"
import { setProfile } from "../store/profileSlice"

//Shell for every /dashboard/* route: sidebar plus the active page.
function Dashboard() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  //Only the token survives a refresh, so re-hydrate the profile from the API.
  const { data: user } = useGetUserDetailsQuery(undefined, { skip: !token })

  useEffect(() => {
    if (user) dispatch(setProfile(user))
  }, [user, dispatch])

  if (!token) return <Navigate to="/login" replace />

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="h-full flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
