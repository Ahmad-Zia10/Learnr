import React from 'react'
import { Link } from 'react-router-dom'

function CTAButton({
    children,
    linkTo,
    active
}) {
  return (
    <Link to={linkTo}>
        <div className={`text-center text-[15px] px-5 py-2 rounded-md font-bold shadow-md
        ${active ? "bg-yellow-50 text-black shadow-yellow-50":" bg-richblack-800 shadow-richblack-700"}
        hover:scale-95 transition-all duration-200 `}>
            {children}
        </div>
    </Link>
  )
}

export default CTAButton