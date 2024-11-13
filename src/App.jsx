import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Signup from './components/Signup'

function App() {

  return (
   <div>
      <LandingPage/>
      {/* <Login/> */}
      {/* <Signup/> */}
   </div>
  )
}

export default App
