import React from 'react'

const Container = function ({children}) {
  return (
    <div className='w-full min-h-full bg-richblack-900 font-inter mx-auto px-4'>{children}</div>
  )
}

export default Container