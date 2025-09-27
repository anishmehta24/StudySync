import { useContext, useEffect, useMemo, useState } from 'react'
import { ChatApi } from '../../api/chatApi'
import ConversationsList from './ConversationsList'
import ChatWindow from './ChatWindow'
import GroupCreator from './GroupCreator'
import { AppContext } from '../../context/AppContext'
import Navbar from '../Navbar'
import NewDirectChat from './NewDirectChat'

const Chat = () => {
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [showGroup, setShowGroup] = useState(false)
  const [showDirect, setShowDirect] = useState(false)
  const { userData } = useContext(AppContext)

  const loadConversations = async () => {
    const res = await ChatApi.listConversations()
    if (res.success) {
      setConversations(res.conversations)
      if (!activeId && res.conversations.length) setActiveId(res.conversations[0]._id)
    }
  }

  useEffect(() => { loadConversations() }, [])

  const activeConversation = useMemo(() => conversations.find(c => c._id === activeId) || null, [conversations, activeId])

  return (
    <div className="min-h-screen bg-gradient-to-r from-background to-secondary-light">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pb-10 pt-6">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-primary-dark">Chat</h1>
          <p className="text-gray-700">Direct messages and group chats with your classmates.</p>
        </div>

        <div className="bg-white/90 rounded-xl shadow-lg shadow-current flex overflow-hidden min-h-[78vh]">
          {/* Conversations panel */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <div className="p-3 flex gap-2">
              <button className="px-3 py-2 border rounded-md hover:bg-gray-50" onClick={() => setShowDirect(true)}>New Chat</button>
              <button className="px-3 py-2 border rounded-md hover:bg-gray-50" onClick={() => setShowGroup(true)}>New Group Chat</button>
              <button className="px-3 py-2 border rounded-md hover:bg-gray-50" onClick={loadConversations}>Refresh</button>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex-1 min-h-0">
              <ConversationsList conversations={conversations} activeId={activeId} onSelect={setActiveId} myId={userData?.id} />
            </div>
          </div>

          {/* Active chat */}
          <div className="flex-1 min-w-0">
            {activeConversation ? (
              <ChatWindow
                conversationId={activeConversation._id}
                conversation={activeConversation}
                myId={userData?.id}
                onActivity={loadConversations}
              />
            ) : (
              <div className="p-6 text-gray-600">Select a conversation or create a new one.</div>
            )}
          </div>
        </div>
      </div>

      {showGroup && (
        <GroupCreator onClose={() => setShowGroup(false)} onCreated={(c) => { setShowGroup(false); setConversations((prev) => [c, ...prev]); setActiveId(c._id) }} />
      )}
      {showDirect && (
        <NewDirectChat onClose={() => setShowDirect(false)} onCreated={(c) => { setShowDirect(false); setConversations((prev) => [c, ...prev]); setActiveId(c._id) }} />
      )}
    </div>
  )
}

export default Chat
