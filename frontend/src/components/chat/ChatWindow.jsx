import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ChatApi } from '../../api/chatApi'
import { SocketContext } from '../../context/SocketContext'

const ChatWindow = ({ conversationId, conversation, myId, onActivity, onBack }) => {
  const { socket, joinConversation, leaveConversation, sendSocketMessage, setTyping } = useContext(SocketContext)
  const [messages, setMessages] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [typingUsers, setTypingUsers] = useState({}) // { userId: timeoutId }
  const listRef = useRef(null)
  const topSentinelRef = useRef(null)

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
      if (cid !== conversationId || String(userId) === String(myId)) return
      setTypingUsers((prev) => {
        const next = { ...prev }
        if (isTyping) {
          // clear any existing timeout
          if (next[userId]?.t) clearTimeout(next[userId].t)
          next[userId] = { t: setTimeout(() => {
            setTypingUsers((p2) => { const n = { ...p2 }; delete n[userId]; return n })
          }, 2000) }
        } else {
          if (next[userId]?.t) clearTimeout(next[userId].t)
          delete next[userId]
        }
        return next
      })
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

  const loadMore = () => { if (hasMore) loadMessages(page + 1) }

  // Infinite scroll: when top sentinel is visible, load more
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const handler = () => {
      if (el.scrollTop <= 16 && hasMore) loadMore()
    }
    el.addEventListener('scroll', handler)
    return () => el.removeEventListener('scroll', handler)
  }, [hasMore, page])

  // Mark-as-read when viewing latest messages
  useEffect(() => {
    if (!messages.length) return
    const unreadIds = messages.filter(m => String(m.senderId) !== String(myId) && !(m.readBy||[]).includes(myId)).map(m => m._id)
    if (!unreadIds.length) return
    // fire and forget
    ChatApi.markAsRead({ conversationId, messageIds: unreadIds }).catch(() => {})
  }, [messages, conversationId, myId])

  const headerTitle = useMemo(() => {
    if (!conversation) return 'Conversation'
    if (conversation.type === 'group') return conversation.name || 'Group Chat'
    const others = conversation.participantProfiles?.filter?.(p => p && p._id !== myId)
    return others?.[0]?.name || others?.[0]?.email || 'Direct Chat'
  }, [conversation, myId])

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 font-semibold text-primary-dark bg-white/70 flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="md:hidden mr-1 px-2 py-1 rounded border hover:bg-gray-50" aria-label="Back to conversations">
            ←
          </button>
        )}
        <div className="truncate">{headerTitle}</div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gradient-to-b from-white/70 to-secondary-light/40" ref={listRef}>
        {hasMore && (
          <div className="text-center text-xs text-gray-500 mb-2">Scroll up to load earlier…</div>
        )}
        <MessageList messages={messages} conversation={conversation} myId={myId} />
        {Object.keys(typingUsers).length > 0 && (
          <div className="italic text-gray-500 mt-2 text-sm">
            {Object.keys(typingUsers).length === 1 ? 'Someone is typing…' : 'Several people are typing…'}
          </div>
        )}
      </div>
      <div className="px-3 py-3 border-t border-gray-200 flex flex-wrap gap-2 bg-white/70">
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); setTyping(conversationId, true) }}
          onBlur={() => setTyping(conversationId, false)}
          placeholder="Type a message"
          className="min-w-0 flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
        <AttachmentButton onFiles={handleUpload} />
        <button onClick={handleSend} disabled={sending} className="px-4 py-2 border rounded-md hover:bg-primary-light hover:text-white disabled:opacity-60">Send</button>
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

  return (
    <div className={`flex flex-col ${mine ? 'items-end' : 'items-start'} my-2`}>
      {senderProfile?.name && (
        <div className="text-xs text-gray-600 mb-1">
          {senderProfile.name}
          {senderProfile.email && conversation?.type === 'group' ? ` · ${senderProfile.email}` : ''}
        </div>
      )}
      {m.content && (
        <div className={`rounded-xl px-3 py-2 max-w-[70%] shadow ${mine ? 'bg-green-100 border border-green-200' : 'bg-white border border-gray-200'}`}>
          {m.content}
        </div>
      )}
      {m.attachments?.length ? (
        <div className="mt-1 flex gap-2 flex-wrap">
          {m.attachments.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noreferrer" className="text-xs text-blue-700 hover:underline">{a.name || a.type}</a>
          ))}
        </div>
      ) : null}
      <div className="text-[11px] text-gray-500 mt-1">{formatTimeOnly(m.createdAt)}</div>
    </div>
  )
}

// Date grouping list
const MessageList = ({ messages, conversation, myId }) => {
  const groups = []
  let lastKey = ''
  for (const m of messages) {
    const k = dateKey(m.createdAt)
    if (k !== lastKey) {
      groups.push({ type: 'separator', key: k })
      lastKey = k
    }
    groups.push({ type: 'message', data: m })
  }
  return (
    <>
      {groups.map((g, idx) => g.type === 'separator' ? (
        <DateSeparator key={`sep-${g.key}-${idx}`} date={g.key} />
      ) : (
        <MessageBubble key={g.data._id} message={g.data} conversation={conversation} myId={myId} />
      ))}
    </>
  )
}

const DateSeparator = ({ date }) => (
  <div className="flex items-center my-3">
    <div className="flex-1 h-px bg-gray-200" />
    <div className="px-3 text-xs text-gray-600">{humanDate(date)}</div>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
)

const dateKey = (d) => {
  const x = new Date(d)
  const y = x.getFullYear()
  const m = String(x.getMonth() + 1).padStart(2, '0')
  const dd = String(x.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}
const todayKey = () => dateKey(new Date())
const yesterdayKey = () => {
  const t = new Date()
  t.setDate(t.getDate() - 1)
  return dateKey(t)
}
const humanDate = (key) => {
  if (key === todayKey()) return 'Today'
  if (key === yesterdayKey()) return 'Yesterday'
  // Convert key back to Date at local midnight for display
  const [y, m, d] = key.split('-').map(Number)
  const local = new Date(y, (m || 1) - 1, d || 1)
  return local.toLocaleDateString()
}
const formatTimeOnly = (d) => {
  try {
    const date = new Date(d)
    const hh = date.getHours()
    const mm = String(date.getMinutes()).padStart(2, '0')
    const ampm = hh >= 12 ? 'PM' : 'AM'
    const h = ((hh + 11) % 12) + 1
    return `${h}:${mm} ${ampm}`
  } catch { return '' }
}

const AttachmentButton = ({ onFiles }) => {
  const inputRef = useRef(null)
  const click = () => inputRef.current?.click()
  const onChange = (e) => onFiles?.(e)
  return (
    <>
      <button type="button" onClick={click} className="px-3 py-2 border rounded-md hover:bg-gray-50" aria-label="Add attachment" title="Add attachment">
        📎
      </button>
      <input ref={inputRef} type="file" multiple onChange={onChange} className="hidden" />
    </>
  )
}
