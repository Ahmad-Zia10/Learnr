import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from "../Home/CTAButton"
import { IoMdArrowRoundForward } from 'react-icons/io'

const InstructorSection = () => {
  return (
    <div className='mt-16'>
      <div className='flex flex-col-reverse sm:flex-row gap-20 items-center'>

        <div className='w-[50%] relative z-10'>
            <img
                src={Instructor}
                alt=""
                className='shadow-white'
            />

            <div className='absolute inset-0 -translate-5 -z-10 bg-white'/>
        </div>

        <div className='w-[50%] flex flex-col gap-10'>
            <div className='text-4xl font-semobold w-[50%]'>
                Become an
                <HighlightText text={" Instructor"} />
            </div>

            <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
            Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
            </p>

            <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}>
                    <div className='flex flex-row gap-2 items-center'>
                        Start Learning Today
                        <IoMdArrowRoundForward />
                    </div>
                </CTAButton>
            </div>


        </div>

      </div>
    </div>
  )
}

export default InstructorSection
