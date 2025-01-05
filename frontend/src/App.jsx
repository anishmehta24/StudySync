import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Notes from './components/notes/notes'
import Uploadnotes from './components/notes/uploadnotes'
import Aigenerator from './components/ai-notes-generation/Aigenerator'
import theme from './theme'
import { ThemeProvider } from '@mui/material'
import Community from './components/Community/Community'
import Group from './components/groups/Group'
import NoticeBoard from './components/noticeboard/Notice'
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import EmailVerification from './components/EmailVerification';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadPost from './components/Community/UploadPost';
import PostDetails from './components/Community/PostDetails';


function App() {

  return (
    <ThemeProvider theme={theme}>
    <Router>
      <ToastContainer/>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<EmailVerification/>} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notes" element={<Notes/>} />
      <Route path="/community" element={<Community/>} />
      <Route path="/community/new-post" element={<UploadPost/>} />
      <Route path="/community/post/:id" element={<PostDetails/>} />
      <Route path="/groups" element={<Group/>} />
      {/* <Route path="/chat" element={<Chat/>} /> */}
      <Route path="/noticeboard" element={<NoticeBoard/>} />
      <Route path="/ai-note-generation" element={<Aigenerator/>} />
      <Route path="/notes/upload" element={<Uploadnotes/>} />
    </Routes>
  </Router>
  </ThemeProvider>
  // <div>
  //   <Navbar/>
  // </div>
  )
}

export default App
