import axios from 'axios'

// Assumes axios.defaults.withCredentials is already true (set in AppContext)

const base = '' // relative to Vite dev server; proxy sends /api to backend

export const ChatApi = {
  listConversations: async () => {
    const { data } = await axios.get(`${base}/api/chat/conversations`)
    return data
  },
  createOrGetDirect: async (recipientId) => {
    const { data } = await axios.post(`${base}/api/chat/conversations/direct`, { recipientId })
    return data
  },
  createGroup: async ({ name, participantIds, adminIds }) => {
    const { data } = await axios.post(`${base}/api/chat/conversations/group`, { name, participantIds, adminIds })
    return data
  },
  updateGroup: async (payload) => {
    const { data } = await axios.put(`${base}/api/chat/group`, payload)
    return data
  },
  getMessages: async (conversationId, page = 1, limit = 30) => {
    const { data } = await axios.get(`${base}/api/chat/messages/${conversationId}?page=${page}&limit=${limit}`)
    return data
  },
  sendMessage: async ({ conversationId, content, attachments }) => {
    const { data } = await axios.post(`${base}/api/chat/messages`, { conversationId, content, attachments })
    return data
  },
  markAsRead: async ({ conversationId, messageIds }) => {
    const { data } = await axios.post(`${base}/api/chat/read`, { conversationId, messageIds })
    return data
  },
  uploadAttachments: async (files) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    const { data } = await axios.post(`${base}/api/chat/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
    return data
  },
  searchUsers: async (query) => {
    const { data } = await axios.get(`${base}/api/user/search?query=${encodeURIComponent(query)}`)
    return data
  }
}
