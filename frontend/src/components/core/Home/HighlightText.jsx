import React from 'react'

function HighlightText({text}) {
  return (
    <span className='font-bold bg-gradient-to-r from-[#3ED5F4] to-[#8EF5E8] bg-clip-text text-transparent'>
        {text}
    </span>
  )
}

export default HighlightText