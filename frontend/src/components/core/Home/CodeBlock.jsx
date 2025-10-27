import React from 'react'
import CTAButton from './CTAButton.jsx'
import { IoMdArrowRoundForward } from "react-icons/io";
import { TypeAnimation } from 'react-type-animation'


function CodeBlock({
    flexPosition,
    heading,
    subHeading,
    ctaBtn1,
    ctaBtn2,
    codeBlock,
    codeGradientColor
}) {
  return (
    <div className={`w-full flex ${flexPosition} sm:justify-between items-center gap-9 mt-16 mb-10 flex-col`}>

        {/* Section 1 */}
        <div className='w-[50%] flex flex-col gap-8 '>
            {heading}
            <div className='text-richblack-300 font-bold '>
                {subHeading}
            </div>

            <div className='flex gap-7 mt-7'>
                <CTAButton active={ctaBtn1.active} linkTo={ctaBtn1.linkTo}>
                    <div className='flex gap-2 items-center'>
                        {ctaBtn1.btnText}
                        <IoMdArrowRoundForward/>
                    </div>
                </CTAButton>

                <CTAButton active={ctaBtn2.active} linkTo={ctaBtn2.linkTo}>  
                        {ctaBtn2.btnText}
                </CTAButton>
            </div>
        </div>

        {/* Section 2 */}
        <div className=' w-1/2 flex h-fit text-10 py-4 bg-richblack-800/20 outline-1 outline-richblack-800 relative'>

            {/* bf-gradient */}
            <div className={`absolute w-[70%] h-[80%] ${codeGradientColor}  top-1 left-0 -z-10 rounded-full blur-2xl `}>

            </div>
            
            {/* Indexing */}
            <div className='items-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>

            {/* Code blocks */}
            <div className='flex flex-col w-[90%] font-mono pr-2 font-bold gap-2 overflow-auto no-scrollbar'>
                <TypeAnimation
                sequence={[codeBlock, 2000, ""]}
                className={'text-wrap'}
                repeat={Infinity}
                cursor={true}
                
                style = {
                    {
                        whiteSpace: "pre",
                        display:"block",
                    }
                }
                speed={50}
                omitDeletionAnimation={true}
                />
            </div>
        </div>
    </div>
  )
}

export default CodeBlock