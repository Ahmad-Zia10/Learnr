import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore.js';
import HighlightText from './HighlightText.jsx';
import { IoPeople } from "react-icons/io5";
import { TbBinaryTree2Filled } from "react-icons/tb";

function ExploreMore() {

  const tabsName = [
    "Free",
    "New To Coding",
    "Most Popular",
    "Skills Paths",
    "Career Paths",

  ];
  
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [currentCourse, setCurrentCourse] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.find((element) => element.tag === value);
    setCurrentCourse(result.courses);
    setCurrentCard(result.courses[0].heading);
  }

  return (
    <>
    <div className='w-full flex flex-col justify-center items-center relative '>
        <div className='text-4xl font-semibold text-center mt-40'>
        Unlock the 
        <HighlightText text={" Power of Code"} />
      </div>

      <p className='text-center text-richblack-300 text-sm text-[16px] mt-3'>
        Learn to build anything you can imagine
      </p>  

      <div className='mt-5 flex flex-col sm:flex-row sm:rounded-full bg-richblack-800 mb-10 
      border-richblack-100
      px-0.5 py-0.5'>
      {
        tabsName.map( (element) => {
            return (
                <div
                className={`text-[16px] flex flex-row items-center
                ${ currentTab === element ? "bg-richblack-900 text-richblack-10 font-medium" 
                : "text-richblack-200"} 
                rounded-full transition-all duration-200 cursor-pointer
                hover:bg-richblack-900 hover:text-richblack-5 px-4 py-1.5`}
                key={element.heading}
                onClick={() => setMyCards(element)}
                >
                {element}
                </div>
            )
        })
      }

      </div>

      {/* course card group */}
        <div className=' flex flex-col sm:flex-row gap-10 -mb-12 w-[90%]'>
            {
            currentCourse.map((element, index) => {
                return (
                    <>
                    <div className={`flex flex-col ${currentCard === element.heading ? "bg-white text-black"
                    :"bg-richblack-800 text-richblack-25"} min-h-[300px] justify-between`}
                    onClick={() => setCurrentCard(element.heading)}>

                        <div className={`flex flex-col gap-2 p-6
                         justify-center`}>
                            <div className='text-xl font-medium'>
                                {element.heading}
                            </div>
                            <p className='text-richblack-200'>
                                {element.description}
                            </p>
                        </div>

                        <div className='flex flex-col sm:flex-row px-6 py-3 justify-between border-t
                        border-richblack-200 border-dashed'>
                            <div className='flex flex-row items-center gap-2'>
                                <IoPeople className={`${currentCard === element.heading ? "text-blue-100" 
                                : "text-richblack-200"} text-2xl`}/>
                                <span className={`${currentCard === element.heading ? "text-blue-400"
                                : "text-richblack-200"} font-semibold`}>{element.level}</span>
                            </div>
                            <div className='flex flex-row items-center gap-2'>
                                <TbBinaryTree2Filled className={`${currentCard === element.heading ? "text-blue-100" 
                                : "text-richblack-200"} text-2xl`}/>
                                <span className={`${currentCard === element.heading ? "text-blue-400"
                                : "text-richblack-200"} font-semibold`}>{element.lessonNumber} Lessons</span>
                            </div>
                        </div>
                    </div>
                    </>     
                )
            }
            )
            }
        </div>
    </div>
    </>
  )
}

export default ExploreMore