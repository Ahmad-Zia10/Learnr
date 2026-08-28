import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import * as VscIcons from "react-icons/vsc"
import { sidebarLinks } from "../../data/dashboard-links"
import { setToken } from "../../store/authSlice"
import { setProfile } from "../../store/profileSlice"

function SidebarLink({ link }) {
  const Icon = VscIcons[link.icon] ?? VscIcons.VscCircleFilled

  return (
    <NavLink
      to={link.path}
      className={({ isActive }) =>
        `relative flex items-center gap-x-2 px-8 py-2 text-[0.875rem] ${
          isActive
            ? "bg-yellow-800 text-yellow-50"
            : "bg-transparent text-richblack-300"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
          <Icon size={18} />
          {link.name}
        </>
      )}
    </NavLink>
  )
}

function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  //Show only the links that belong to this account type.
  const links = sidebarLinks.filter(
    (link) => !link.type || link.type === user?.accountType
  )

  const handleLogout = () => {
    dispatch(setToken(null))
    dispatch(setProfile(null))
    navigate("/login")
  }

  return (
    <aside className="flex min-w-[220px] flex-col border-r border-richblack-700 py-10">
      <div className="flex flex-col">
        {links.map((link) => (
          <SidebarLink key={link.id} link={link} />
        ))}
        <SidebarLink
          link={{ name: "Cart", path: "/dashboard/cart", icon: "VscArchive" }}
        />
      </div>

      <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

      <div className="flex flex-col">
        <SidebarLink
          link={{ name: "Settings", path: "/dashboard/settings", icon: "VscSettingsGear" }}
        />
        <button
          type="button"
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-x-2 px-8 py-2 text-[0.875rem] text-richblack-300"
        >
          <VscIcons.VscSignOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
