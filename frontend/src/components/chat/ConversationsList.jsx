const ConversationsList = ({ conversations, activeId, onSelect, myId }) => {
  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      {conversations.map((c) => {
        const isActive = c._id === activeId
        let title = 'Conversation'
        if (c.type === 'group') {
          title = c.name || 'Unnamed Group'
        } else if (Array.isArray(c.participantProfiles)) {
          // Show the other user in a direct chat
          const others = c.participantProfiles.filter(p => p && p._id !== myId)
          title = others[0]?.name || others[0]?.email || 'Direct Chat'
        }
        const last = c.lastMessage
        let subtitle = ''
        if (last) {
          const mine = String(last.senderId || '') === String(myId || '')
          const text = last.content && last.content.length ? last.content : '[Attachment]'
          subtitle = `${mine ? 'You: ' : ''}${text}`
        }
        return (
          <div key={c._id} onClick={() => onSelect(c._id)} style={{ padding: 12, cursor: 'pointer', background: isActive ? '#f4f6f8' : 'transparent', borderBottom: '1px solid #f2f2f2' }}>
            <div style={{ fontWeight: 600 }}>{title}</div>
            <div style={{ color: '#666', fontSize: 13 }}>{subtitle}</div>
          </div>
        )
      })}
    </div>
  )
}

export default ConversationsList
