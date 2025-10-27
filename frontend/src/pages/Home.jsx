import React from 'react'
import { IoMdArrowRoundForward } from "react-icons/io";
import { Link } from 'react-router-dom'
import HighlightText from '../components/core/Home/HighlightText';
import CTAButton from '../components/core/Home/CTAButton';
import banner from '../assets/Images/banner.mp4'
import CodeBlock from '../components/core/Home/CodeBlock.jsx';
import TimelineSection from '../components/core/Home/TimelineSection.jsx';
import LearningLanguageSection from '../components/core/Home/LearningLanguageSection.jsx';
import InstructorSection from '../components/core/Home/InstrcutorSection.jsx';
import ExploreMore from '../components/core/Home/ExploreMore.jsx';


function Home() {
  return (
    <>
      {/* {section 1} */}

      {/* Top Section */}

        <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center 
        text-white justify-between z-10 px-10'>

          {/* Become an Instructor - Button */}
          <Link to={"/signup"}>

            <div className=' group mt-16 p-1 mx-auto rounded-full bg-richblack-800 text-richblack-200
            transition-all duration-200 hover:scale-95 w-fit'>

              <div className='flex flex-row items-center gap-2 rounded-full px-8 py-[5px]
              transition-all duration-200 group-hover:bg-richblack-900 text-[21px]'>

                <p>Become an Instructor</p>
                <IoMdArrowRoundForward />
                  
              </div>
            </div>
    
          </Link>

          {/* Empower Text */}
          <div className='text-4xl text-center font-semibold mt-8'>
            Empower Your Future With
            <HighlightText text = {" Coding Skills"}/>
          </div>

          {/* Paragraph text */}
          <div className=' mt-7 w-[90%] text-center text-lg font-bold text-richblack-300'>
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
          </div>

          {/*  */}
          <div className='flex flex-row gap-7 mt-8'>
            <CTAButton active={true} linkto={"/signup"}> 
              Learn More
            </CTAButton>

            <CTAButton active={false} linkto={"/login"}> 
              Book a Demo
            </CTAButton>
          </div>

          {/* Video Element */}
          <div className='mx-3 my-14 relative w-full max-w-5xl'>

            <video
            className=''
            muted
            loop
            autoPlay
            >
            <source src={banner} type='video/mp4'/>
            </video>

            <div className='bg-white absolute z-[-1] inset-0 translate-x-5 translate-y-5 '/>

          </div>

          {/* Code Section 1 */}
          
          <CodeBlock
           flexPosition = {"sm:flex-row"}
           heading = {
            <div className='text-4xl font-semibold'>
              Unlock Your
              <HighlightText text={" Coding Potential "}/>
              With Our Online Courses
            </div>
           }
           subHeading = {
            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
          }
          ctaBtn1={
            {
            btnText: "Try It Yourself",
            linkTo: "/signup",
            active: true,
            }
          }
          ctaBtn2={
            {
            btnText: "Learn More",
            linkTo: "/login",
            active: false,
            }
          }
          codeBlock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n/head>\n`}
          codeGradientColor={"bg-gradient-to-r from-pink-400/30 via-yellow-400/30 to-yellow-200/30"}
          />

          {/* Code Section 2 */}
          <CodeBlock
           flexPosition = {"lg:flex-row-reverse"}
           heading = {
            <div className='text-4xl font-semibold'>
              Start 
              <HighlightText text={" Coding Potential "}/>
              Coding In Seconds
            </div>
           }
           subHeading = {
            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
          }
          ctaBtn1={
            {
            btnText: "Continue Lesson",
            linkTo: "/signup",
            active: true,
            }
          }
          ctaBtn2={
            {
            btnText: "Learn More",
            linkTo: "/login",
            active: false,
            }
          }
          codeBlock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n/head>\n`}
          codeGradientColor={"bg-gradient-to-r from-[#39D4F4] to-[#2FF5F3] opacity-25 "}
          />

          {/* Explore More */}

          <ExploreMore/>

        </div>

        {/*    */}

      {/* {section 2} */}
      <div className='bg-pure-greys-5 text-richblack-700 font-inter'>

        <div className='bg-[url(././assets/Images/bghome.svg))] h-[300px]'>
          <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
            <div className='h-[150px]'></div>
            <div className='flex flex-row gap-7 text-white '>
              <CTAButton active={true} linkto={"/signup"}>
                <div className='flex items-center gap-3' >
                  Explore Full Catalog
                  <IoMdArrowRoundForward />
                </div>
                  
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                <div>
                  Learn more
                </div>
              </CTAButton>
            </div>

          </div>
        </div>

        <div className='w-11/12 mx-auto flex flex-col items-center justify-between gap-7 max-w-[1100px]'>
          <div className='flex flex-row gap-5 mb-10 mt-[95px]'>

            <div className='text-4xl font-semibold w-[45%]'>
              Get the Skills you need for a
              <HighlightText text={" Job That Is In Demand"} />
            </div>

            <div className='flex flex-col gap-10 w-[40%] items-start'>
              <div className='text-[16px]'>
              The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
              </div>

              <CTAButton active={true} linkTo={"/signup"}>
                Learn More
              </CTAButton>

            </div>

          </div>

          <TimelineSection/>

          <LearningLanguageSection/>

        </div>

        
      </div>

      {/* {section 3} */}
      <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>

        <InstructorSection />

        <h2 className='text-center text-4xl font-semobold mt-10'>review from Other Learners</h2>
        {/* Review Slider here */}
      </div>
    </>
  )
}

export default Home