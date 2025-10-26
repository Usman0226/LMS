import axios from 'axios'

// Create axios instance for messaging API
const messagingAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/messaging`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
messagingAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
messagingAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Messaging API functions
export const messaging = {
  // Get conversations for current user
  getConversations: async () => {
    const response = await messagingAPI.get('/conversations')
    return response.data
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId, page = 1, limit = 50) => {
    const response = await messagingAPI.get(`/conversations/${conversationId}/messages`, {
      params: { page, limit }
    })
    return response.data
  },

  // Send a message
  sendMessage: async (conversationId, messageData) => {
    const response = await messagingAPI.post(`/conversations/${conversationId}/messages`, {
      content: messageData.content,
      type: messageData.type || 'text',
    })
    return response.data
  },

  // Create a new conversation
  createConversation: async (participantIds) => {
    const response = await messagingAPI.post('/conversations', {
      participants: participantIds,
    })
    return response.data
  },

  // Mark messages as read
  markAsRead: async (conversationId, messageIds) => {
    const response = await messagingAPI.patch(`/conversations/${conversationId}/read`, {
      messageIds,
    })
    return response.data
  },

  // Get unread message count
  getUnreadCount: async () => {
    const response = await messagingAPI.get('/unread-count')
    return response.data
  },

  // Search users for starting conversations
  searchUsers: async (query) => {
    const response = await messagingAPI.get('/users/search', {
      params: { q: query }
    })
    return response.data
  },

  // Delete a conversation
  deleteConversation: async (conversationId) => {
    const response = await messagingAPI.delete(`/conversations/${conversationId}`)
    return response.data
  },

  // Archive/unarchive conversation
  toggleArchive: async (conversationId) => {
    const response = await messagingAPI.patch(`/conversations/${conversationId}/archive`)
    return response.data
  },
}

export default messaging
