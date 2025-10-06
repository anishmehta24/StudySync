import { httpClient } from './httpClient'

// Chat API wrapper using centralized httpClient (env-aware base URL)
export const ChatApi = {
  listConversations: async () => {
    const { data } = await httpClient.get('/api/chat/conversations')
    return data
  },
  createOrGetDirect: async (recipientId) => {
    const { data } = await httpClient.post('/api/chat/conversations/direct', { recipientId })
    return data
  },
  createGroup: async ({ name, participantIds, adminIds }) => {
    const { data } = await httpClient.post('/api/chat/conversations/group', { name, participantIds, adminIds })
    return data
  },
  updateGroup: async (payload) => {
    const { data } = await httpClient.put('/api/chat/group', payload)
    return data
  },
  getMessages: async (conversationId, page = 1, limit = 30) => {
    const { data } = await httpClient.get(`/api/chat/messages/${conversationId}?page=${page}&limit=${limit}`)
    return data
  },
  sendMessage: async ({ conversationId, content, attachments }) => {
    const { data } = await httpClient.post('/api/chat/messages', { conversationId, content, attachments })
    return data
  },
  markAsRead: async ({ conversationId, messageIds }) => {
    const { data } = await httpClient.post('/api/chat/read', { conversationId, messageIds })
    return data
  },
  uploadAttachments: async (files) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    const { data } = await httpClient.post('/api/chat/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    return data
  },
  searchUsers: async (query) => {
    const { data } = await httpClient.get(`/api/user/search?query=${encodeURIComponent(query)}`)
    return data
  }
}

