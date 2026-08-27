import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/store.js'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import UpdatePassword from './pages/UpdatePassword.jsx'
import Catalog from './pages/Catalog.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import MyProfile from './pages/MyProfile.jsx'
import EnrolledCourses from './pages/EnrolledCourses.jsx'
import Settings from './pages/Settings.jsx'
import MyCourses from './pages/MyCourses.jsx'
import AddCourse from './pages/AddCourse.jsx'
import ViewCourse from './pages/ViewCourse.jsx'
import VideoDetails from './pages/VideoDetails.jsx'
import { Provider } from 'react-redux'


const router  = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element = {<App/>}>
      <Route path='/' element = {<Home/>}/>
      <Route path='/login' element = {<Login/>}/>
      <Route path='/signup' element = {<Signup/>}/>
      <Route path='/verify-email' element = {<VerifyEmail/>}/>
      <Route path='/forgot-password' element = {<ForgotPassword/>}/>
      <Route path='/update-password/:token' element = {<UpdatePassword/>}/>
      <Route path='/catalog/:catalogName' element = {<Catalog/>}/>
      <Route path='/courses/:courseId' element = {<CourseDetails/>}/>
      <Route path='/view-course/:courseId' element = {<ViewCourse/>}>
        <Route path='section/:sectionId/sub-section/:subSectionId' element = {<VideoDetails/>}/>
      </Route>
      <Route path='/dashboard' element = {<Dashboard/>}>
        <Route path='my-profile' element = {<MyProfile/>}/>
        <Route path='enrolled-courses' element = {<EnrolledCourses/>}/>
        <Route path='settings' element = {<Settings/>}/>
        <Route path='my-courses' element = {<MyCourses/>}/>
        <Route path='add-course' element = {<AddCourse/>}/>
        <Route path='edit-course/:courseId' element = {<AddCourse/>}/>
        <Route path='cart' element = {<Cart/>}/>
        <Route path='checkout' element = {<Checkout/>}/>
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
