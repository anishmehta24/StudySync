import './App.css'
import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Notes from './components/notes/notes'
import Uploadnotes from './components/notes/uploadnotes'
import Aigenerator from './components/ai-notes-generation/Aigenerator'
import theme from './theme'
import { ThemeProvider } from '@mui/material'
import NoticeBoard from './components/noticeboard/Notice'
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import EmailVerification from './components/EmailVerification';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './context/SocketContext';

// Lazy-load heavier routes to reduce initial bundle size
const Chat = React.lazy(() => import('./components/chat/Chat'))
const Community = React.lazy(() => import('./components/Community/Community'))
const UploadPost = React.lazy(() => import('./components/Community/UploadPost'))
const PostDetails = React.lazy(() => import('./components/Community/PostDetails'))


function App() {

  return (
    <ThemeProvider theme={theme}>
    <SocketProvider>
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
      <Route path="/community" element={
        <Suspense fallback={<div className="p-6 text-center">Loading community…</div>}>
          <Community/>
        </Suspense>
      } />
      <Route path="/community/new-post" element={
        <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
          <UploadPost/>
        </Suspense>
      } />
      <Route path="/community/post/:id" element={
        <Suspense fallback={<div className="p-6 text-center">Loading post…</div>}>
          <PostDetails/>
        </Suspense>
      } />
  {/* Groups route removed; chat is the single entry point */}
  <Route path="/chat" element={
    <Suspense fallback={<div className="p-6 text-center">Loading chat…</div>}>
      <Chat/>
    </Suspense>
  } />
      <Route path="/noticeboard" element={<NoticeBoard/>} />
      <Route path="/ai-note-generation" element={<Aigenerator/>} />
      <Route path="/notes/upload" element={<Uploadnotes/>} />
    </Routes>
  </Router>
  </SocketProvider>
  </ThemeProvider>
  // <div>
  //   <Navbar/>
  // </div>
  )
}

export default App
