import React, {useState} from 'react'
import { NavLink, Link, Links } from 'react-router-dom'
import logo from '../../../assets/Logo/Logo-Full-Light.png'
import {NavbarLinks} from '../../../data/navbar-links.js'
import { useSelector } from 'react-redux'
import { IoSearchSharp } from "react-icons/io5";
import { BsCart3 } from "react-icons/bs";
import { apiConnector } from '../../../services/apiConnector.js'
import { courseEndpoints } from '../../../services/apis.js'
import { useEffect } from 'react'
import { RiArrowDropDownLine } from "react-icons/ri";
import axios from 'axios'

function Header() {

  const {token} = useSelector((state) => state.auth);
  const {user} = useSelector( (state) => state.profile );
  const {totalItems} = useSelector( (state) => state.cart );

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => { 

  try {
    const result = await apiConnector("GET", courseEndpoints.COURSE_CATEGORIES_API);
    console.log("Axios full response:", result.data); // Logs full object
    console.log("Categories:", result.data.data);    // Logs just the array
    setCategories(result.data.data);                 // Set only the array
  } catch (error) {
    console.log("Error while fetching categories", error.message);
  }


    // try {
    // const response = await fetch('/api/v1/courses/show-all-categories')
    // const data = response.json();

    // console.log("Categories data fetched successfully", data)
    // } catch (error) {
    //   console.log("Error while fetching caegories", error.message);
    // }

  }

  useEffect(() => {
    fetchCategories();
  }
  ,[])


  return (
    <>
    <div className='h-14 flex border-b-[1px] border-b-richblack-700 justify-between items-center px-10 mx-auto'>
      <div className='w-11/12 flex max-w-maxContent items-center justify-between'>
        {/* Image */}
        <Link to={'/'}>
        <img src={logo} alt="Logo" width={160} height={42} loading='lazy' />    
        </Link>

        {/* Nav links */}
        <nav>
          <ul className='hidden sm:flex sm:gap-6 text-richblack-25'>

            {
              NavbarLinks.map( (element) => {
                return (
                  element.title === 'Catalog' ? (
                    <div className='group relative flex items-center gap-1 self-center' key={element.title}>
                      <p>{element.title}</p>
                      <RiArrowDropDownLine />

                      {/* Drop Down div */}
                      <div className='invisible absolute left-[50%] translate-x-[-50%] translate-y-[40%] top-[0]
                      flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all
                      duration-200 group-hover:visible group-hover:opacity-100 lg:w-[200px] z-20'>

                        {/* The triangular div */}
                        <div className='absolute left-[50%] top-0 translate-x-[80%] translate-y-[-45%] 
                        h-6 w-6 rotate-45 rounded bg-richblack-5'/>

                        {
                          categories.length ? categories.map((category) => {
                            return (
                              <Link to={category.name} key={category._id}>
                                {category.name}
                              </Link>
                            )
                          }) : null
                        }

                      </div>
                    </div>
                  ) : (
                    <li key={element.title}>
                      <NavLink
                      to={element.path}
                      className={({isActive}) => `${isActive ? "text-yellow-25" : "text-richblack-25"}`}
                      >
                        {element.title}
                      </NavLink>
                    </li>
                  )

                )
              } )
            }

          </ul>
        </nav>

        {/* Login & Signup Or Cart & Profile buttons */}

        {
          token === null ? (
            <div className='flex flex-row items-center gap-x-4'>
              <Link to={'/login'} className='border border-richblack-700 bg-richblack-800 px-[12px] py-[4px] 
              text-richblack-100 rounded-md'>
                Login
              </Link>
              <Link to={'/signup'} className='border border-richblack-700 bg-richblack-800 px-[12px] py-[4px] 
              text-richblack-100 rounded-md'>
                Sign Up
              </Link>
            </div>
          ) : (
              user && user?.accountType !== "Instructor" && (
                <Link to={'/dashboard/cart'} className='flex relative flex-row items-center gap-x-4'>
                  <BsCart3 className=' text-richblack-200'/>
                  {totalItems > 0 && (
                    <span className='absolute text-richblack-25 bg-red-500 rounded-full w-[15px] flex justify-center 
                    text-[10px] -top-3 -right-3'>
                      {totalItems}
                    </span>
                  )}
                </Link>
              )
          )
        }
      </div>
    </div>
    </>
  )
}

export default Header