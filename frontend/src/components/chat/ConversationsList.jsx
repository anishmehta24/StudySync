const ConversationsList = ({ conversations, activeId, onSelect, myId }) => {
  const getInitials = (name = '') => {
    const parts = String(name).trim().split(/\s+/)
    if (!parts.length) return 'C'
    const first = parts[0]?.[0] || ''
    const second = parts[1]?.[0] || ''
    return (first + second).toUpperCase() || first.toUpperCase() || 'C'
  }

  const formatTime = (d) => {
    try {
      const date = new Date(d)
      const hh = date.getHours()
      const mm = String(date.getMinutes()).padStart(2, '0')
      const ampm = hh >= 12 ? 'PM' : 'AM'
      const h = ((hh + 11) % 12) + 1
      return `${h}:${mm} ${ampm}`
    } catch { return '' }
  }

  const getAvatarUrl = (profile) => profile?.avatarUrl || profile?.avatar || profile?.profileImage || profile?.photo || ''

  return (
    <div className="overflow-y-auto h-full">
      {conversations.map((c) => {
        const isActive = c._id === activeId
        let title = 'Conversation'
        if (c.type === 'group') {
          title = c.name || 'Unnamed Group Chat'
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
        // prefer backend computed unreadCount, fallback to simple calc
        const unread = typeof c.unreadCount === 'number' ? c.unreadCount : (last && Array.isArray(last.readBy) && !last.readBy.includes(myId) && String(last.senderId) !== String(myId) ? 1 : 0)
        const time = last ? formatTime(last.createdAt) : ''

        // avatar initial
        let avatarInitial = 'C'
        let avatarUrl = ''
        if (c.type === 'group') {
          avatarInitial = getInitials(title)
        } else {
          const others = c.participantProfiles?.filter(p => p && p._id !== myId)
          const other = others && others[0]
          avatarInitial = other?.name ? getInitials(other.name) : (other?.email?.[0] || 'U').toUpperCase()
          avatarUrl = getAvatarUrl(other)
        }
        return (
          <div
            key={c._id}
            onClick={() => onSelect(c._id)}
            className={`p-3 cursor-pointer border-b border-gray-100 ${isActive ? 'bg-secondary-light/40' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt={title} className={`w-10 h-10 rounded-full object-cover ${c.type === 'group' ? 'ring-2 ring-purple-300' : ''}`} />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${c.type === 'group' ? 'bg-purple-500' : 'bg-primary-light'}`}>
                  {c.type === 'group' ? '👥' : avatarInitial}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-primary-dark truncate">{title}</div>
                  {time && <div className="text-xs text-gray-500 whitespace-nowrap">{time}</div>}
                </div>
                <div className="text-sm text-gray-600 truncate">{subtitle}</div>
              </div>
              {unread > 0 && (
                <div className="ml-2 min-w-6 h-6 px-2 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {unread}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ConversationsList
