import './App.css'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Signup from './components/Signup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import Notes from './components/notes/notes'
import Uploadnotes from './components/notes/uploadnotes'
import Aigenerator from './components/ai-notes-generation/Aigenerator'
import theme from './theme'
import { ThemeProvider } from '@mui/material'
import Community from './components/Community/Community'

import Group from './components/groups/Group'
import NoticeBoard from './components/noticeboard/Notice'


function App() {

  return (
    <ThemeProvider theme={theme}>
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notes" element={<Notes/>} />
      <Route path="/community" element={<Community/>} />
      <Route path="/groups" element={<Group/>} />
      {/* <Route path="/chat" element={<Chat/>} /> */}
      <Route path="/noticeboard" element={<NoticeBoard/>} />
      <Route path="/ai-note-generation" element={<Aigenerator/>} />
      <Route path="/notes/upload" element={<Uploadnotes/>} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
  </ThemeProvider>
  // <div>
  //   <Navbar/>
  // </div>
  )
}

export default App
