import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { AppContext } from './AppContext.jsx'

export const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { isLoggedin } = useContext(AppContext)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    if (!isLoggedin) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      setConnected(false)
      return
    }

    // Use relative URL so Vite proxy handles ws to backend
    const s = io('/', { withCredentials: true, path: '/socket.io' })
    socketRef.current = s
    s.on('connect', () => setConnected(true))
    s.on('disconnect', () => setConnected(false))

    return () => {
      s.disconnect()
      socketRef.current = null
      setConnected(false)
    }
  }, [isLoggedin])

  const value = useMemo(() => ({
    socket: socketRef.current,
    connected,
    joinConversation: (conversationId) => socketRef.current?.emit('conversation:join', { conversationId }),
    leaveConversation: (conversationId) => socketRef.current?.emit('conversation:leave', { conversationId }),
    sendSocketMessage: (payload, cb) => socketRef.current?.emit('message:send', payload, cb),
    setTyping: (conversationId, isTyping) => socketRef.current?.emit('message:typing', { conversationId, isTyping }),
  }), [connected])

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
