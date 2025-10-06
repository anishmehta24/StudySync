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

    // Derive socket URL from env (fallback to backend URL or current origin for dev).
    const rawSocket = (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || window.location.origin).trim()
    const socketUrl = rawSocket.replace(/\/$/, '') || '/'
    // eslint-disable-next-line no-console
    console.log('[Socket] connecting to', socketUrl)
    const s = io(socketUrl, {
      withCredentials: true,
      path: '/socket.io',
      // Explicit transports to avoid upgrade issues behind some proxies
      transports: ['websocket', 'polling']
    })
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
