import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ChatApi } from '../../api/chatApi'
import { SocketContext } from '../../context/SocketContext'

const ChatWindow = ({ conversationId, conversation, myId, onActivity }) => {
  const { socket, joinConversation, leaveConversation, sendSocketMessage, setTyping } = useContext(SocketContext)
  const [messages, setMessages] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const listRef = useRef(null)

  const loadMessages = async (p = 1) => {
    const res = await ChatApi.getMessages(conversationId, p, 30)
    if (res.success) {
      setMessages((prev) => p === 1 ? res.messages : [...res.messages, ...prev])
      setHasMore(res.messages.length === 30)
      setPage(p)
    }
  }

  useEffect(() => {
    setMessages([])
    setPage(1)
    setHasMore(true)
    joinConversation(conversationId)
    loadMessages(1)
    return () => leaveConversation(conversationId)
  }, [conversationId])

  useEffect(() => {
    if (!socket) return
    const onNew = ({ conversationId: cid, message }) => {
      if (cid !== conversationId) return
      setMessages((prev) => [...prev, message])
      onActivity?.()
      scrollToBottom()
    }
    const onTyping = ({ conversationId: cid, userId, isTyping }) => {
      if (cid !== conversationId) return
      setIsTyping(!!isTyping)
      if (isTyping) setTimeout(() => setIsTyping(false), 2000)
    }
    const onRead = ({ conversationId: cid }) => {
      if (cid !== conversationId) return
      // Could update read receipts UI here
    }
    socket.on('message:new', onNew)
    socket.on('user:typing', onTyping)
    socket.on('message:read', onRead)
    return () => {
      socket.off('message:new', onNew)
      socket.off('user:typing', onTyping)
      socket.off('message:read', onRead)
    }
  }, [socket, conversationId])

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  const handleSend = async () => {
    if (!text.trim()) return
    setSending(true)
    sendSocketMessage({ conversationId, content: text }, (resp) => {
      setSending(false)
      if (resp?.ok) {
        setText('')
      }
    })
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const up = await ChatApi.uploadAttachments(files)
    if (up.success) {
      setSending(true)
      const { attachments } = up
      const res = await ChatApi.sendMessage({ conversationId, content: text.trim(), attachments })
      setSending(false)
      if (res.success) setText('')
    }
    e.target.value = ''
  }

  const loadMore = () => {
    if (hasMore) loadMessages(page + 1)
  }

  const headerTitle = useMemo(() => {
    if (!conversation) return 'Conversation'
    if (conversation.type === 'group') return conversation.name || 'Group'
    const others = conversation.participantProfiles?.filter?.(p => p && p._id !== myId)
    return others?.[0]?.name || others?.[0]?.email || 'Direct Chat'
  }, [conversation, myId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 12, borderBottom: '1px solid #eee', fontWeight: 600 }}>{headerTitle}</div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }} ref={listRef}>
        {hasMore && (
          <button onClick={loadMore} style={{ marginBottom: 12, padding: '6px 10px', border: '1px solid #ddd', borderRadius: 6 }}>Load earlier</button>
        )}
        {messages.map((m) => (
          <MessageBubble key={m._id} message={m} conversation={conversation} myId={myId} />
        ))}
        {isTyping && <div style={{ fontStyle: 'italic', color: '#777', marginTop: 8 }}>Typing…</div>}
      </div>
      <div style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); setTyping(conversationId, true) }}
          onBlur={() => setTyping(conversationId, false)}
          placeholder="Type a message"
          style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
        />
        <input type="file" multiple onChange={handleUpload} />
        <button onClick={handleSend} disabled={sending} style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: 6 }}>Send</button>
      </div>
    </div>
  )
}

export default ChatWindow

const MessageBubble = ({ message: m, conversation, myId }) => {
  const mine = String(m.senderId || '') === String(myId || '')
  const senderProfile = useMemo(() => {
    if (!conversation) return null
    if (conversation.type === 'group') {
      // For group, show sender name under/above
      const list = conversation.participantProfiles || []
      return list.find(p => p && String(p._id) === String(m.senderId)) || null
    } else {
      // For direct, show other user's name for received messages, 'You' for mine
      const list = conversation.participantProfiles || []
      if (mine) return { name: 'You' }
      const other = list.find(p => p && String(p._id) !== String(myId))
      return other || null
    }
  }, [conversation, m.senderId, myId, mine])

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: mine ? 'flex-end' : 'flex-start',
    margin: '10px 0',
  }
  const bubbleStyle = {
    background: mine ? '#dcf8c6' : '#fff',
    border: '1px solid #e6e6e6',
    borderRadius: 12,
    padding: '8px 10px',
    maxWidth: '70%',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
  }
  const nameStyle = { fontSize: 12, color: '#666', marginBottom: 4 }
  const timeStyle = { fontSize: 11, color: '#999', marginTop: 4 }

  return (
    <div style={wrapperStyle}>
      {senderProfile?.name && <div style={nameStyle}>{senderProfile.name}{senderProfile.email && conversation?.type === 'group' ? ` · ${senderProfile.email}` : ''}</div>}
      {m.content && <div style={bubbleStyle}>{m.content}</div>}
      {m.attachments?.length ? (
        <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {m.attachments.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#2b6cb0' }}>{a.name || a.type}</a>
          ))}
        </div>
      ) : null}
      <div style={timeStyle}>{new Date(m.createdAt).toLocaleString()}</div>
    </div>
  )
}
