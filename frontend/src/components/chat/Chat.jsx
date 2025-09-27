import { useContext, useEffect, useMemo, useState } from 'react'
import { ChatApi } from '../../api/chatApi'
import ConversationsList from './ConversationsList'
import ChatWindow from './ChatWindow'
import GroupCreator from './GroupCreator'
import { AppContext } from '../../context/AppContext'
import { Box, Button, Divider } from '@mui/material'

const Chat = () => {
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [showGroup, setShowGroup] = useState(false)
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
    <Box display="flex" height="calc(100vh - 24px)">
      <Box width={340} borderRight="1px solid #eee" display="flex" flexDirection="column">
        <Box p={1.5} display="flex" gap={1}>
          <Button variant="outlined" size="small" onClick={() => setShowGroup(true)}>New Group</Button>
          <Button variant="outlined" size="small" onClick={loadConversations}>Refresh</Button>
        </Box>
        <Divider />
        <Box flex={1} minHeight={0}>
          <ConversationsList conversations={conversations} activeId={activeId} onSelect={setActiveId} myId={userData?.id} />
        </Box>
      </Box>
      <Box flex={1} minWidth={0}>
        {activeConversation ? (
          <ChatWindow conversationId={activeConversation._id} conversation={activeConversation} myId={userData?.id} onActivity={loadConversations} />
        ) : (
          <Box p={3}>Select a conversation or create a new one.</Box>
        )}
      </Box>

      {showGroup && (
        <GroupCreator onClose={() => setShowGroup(false)} onCreated={(c) => { setShowGroup(false); setConversations((prev) => [c, ...prev]); setActiveId(c._id) }} />
      )}
    </Box>
  )
}

export default Chat
