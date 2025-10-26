import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { useWebSocket } from './WebSocketContext'
import messagingAPI from '../services/messagingAPI'

const MessagingContext = createContext(null)

export const useMessaging = () => {
  const context = useContext(MessagingContext)
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider')
  }
  return context
}

export const MessagingProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const { emitEvent, isConnected } = useWebSocket()

  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState({})
  const [loading, setLoading] = useState(false)
  const [unreadCounts, setUnreadCounts] = useState({})
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true)
      const response = await messagingAPI.getConversations()
      if (response.success) {
        setConversations(response.data)
      }
    } catch (error) {
      // Silently fail for messaging features during development
      if (process.env.NODE_ENV === 'development') {
        console.log('Messaging feature not available yet - conversations')
        setConversations([])
      } else {
        console.error('Failed to load conversations:', error)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const loadUnreadCounts = useCallback(async () => {
    try {
      const response = await messagingAPI.getUnreadCount()
      if (response.success) {
        setUnreadCounts(response.data)
      }
    } catch (error) {
      // Silently fail for messaging features during development
      if (process.env.NODE_ENV === 'development') {
        console.log('Messaging feature not available yet - unread counts')
        setUnreadCounts({ count: 0 })
      } else {
        console.error('Failed to load unread counts:', error)
      }
    }
  }, [])

  // Load conversations when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadConversations()
      loadUnreadCounts()
    } else {
      // Reset state when user logs out
      setConversations([])
      setActiveConversation(null)
      setMessages({})
      setUnreadCounts({})
    }
  }, [currentUser, loadConversations, loadUnreadCounts])

  // WebSocket message handling
  useEffect(() => {
    if (isConnected && currentUser) {
      // Listen for real-time messages
      const handleNewMessage = (message) => {
        // Add message to appropriate conversation
        setMessages(prev => ({
          ...prev,
          [message.conversationId]: [
            ...(prev[message.conversationId] || []),
            message
          ]
        }))

        // Update conversation last message
        setConversations(prev =>
          prev.map(conv =>
            conv._id === message.conversationId
              ? { ...conv, lastMessage: message, updatedAt: new Date() }
              : conv
          )
        )

        // Update unread count if message is from another user
        if (message.senderId !== currentUser._id && activeConversation?._id !== message.conversationId) {
          setUnreadCounts(prev => ({
            ...prev,
            [message.conversationId]: (prev[message.conversationId] || 0) + 1
          }))
        }
      }

      const handleMessageRead = (data) => {
        // Update read status in messages
        if (messages[data.conversationId]) {
          setMessages(prev => ({
            ...prev,
            [data.conversationId]: prev[data.conversationId].map(msg =>
              data.messageIds.includes(msg._id)
                ? { ...msg, read: true, readAt: new Date() }
                : msg
            )
          }))
        }
      }

      // Set up WebSocket event listeners through the WebSocket context
      emitEvent('join_user_room', { userId: currentUser._id })
    }
  }, [isConnected, currentUser, activeConversation, emitEvent])


  const selectConversation = async (conversation) => {
    setActiveConversation(conversation)

    // Load messages if not already loaded
    if (!messages[conversation._id]) {
      try {
        const response = await messagingAPI.getMessages(conversation._id)
        if (response.success) {
          setMessages(prev => ({
            ...prev,
            [conversation._id]: response.data
          }))
        }
      } catch (error) {
        console.error('Failed to load messages:', error)
      }
    }

    // Mark conversation as read
    if (unreadCounts[conversation._id] > 0) {
      try {
        await messagingAPI.markAsRead(conversation._id, [])
        setUnreadCounts(prev => ({
          ...prev,
          [conversation._id]: 0
        }))
      } catch (error) {
        console.error('Failed to mark conversation as read:', error)
      }
    }
  }

  const sendMessage = async (conversationId, content, type = 'text') => {
    try {
      const response = await messagingAPI.sendMessage(conversationId, {
        content,
        type
      })

      if (response.success) {
        const newMessage = response.data

        // Add to local state immediately
        setMessages(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), newMessage]
        }))

        // Update conversation last message
        setConversations(prev =>
          prev.map(conv =>
            conv._id === conversationId
              ? { ...conv, lastMessage: newMessage, updatedAt: new Date() }
              : conv
          )
        )

        // Emit via WebSocket for real-time delivery
        emitEvent('send_message', {
          conversationId,
          message: newMessage
        })

        return newMessage
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  const startConversation = async (participantIds) => {
    try {
      const response = await messagingAPI.createConversation(participantIds)
      if (response.success) {
        const newConversation = response.data

        // Add to conversations list
        setConversations(prev => [newConversation, ...prev])

        // Set as active conversation
        setActiveConversation(newConversation)

        return newConversation
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
      throw error
    }
  }

  const searchUsers = async (query) => {
    try {
      setSearchLoading(true)
      const response = await messagingAPI.searchUsers(query)
      if (response.success) {
        setSearchResults(response.data)
        return response.data
      }
    } catch (error) {
      console.error('Failed to search users:', error)
      throw error
    } finally {
      setSearchLoading(false)
    }
  }

  const deleteConversation = async (conversationId) => {
    try {
      await messagingAPI.deleteConversation(conversationId)

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv._id !== conversationId))

      // Clear active conversation if it was deleted
      if (activeConversation?._id === conversationId) {
        setActiveConversation(null)
      }

      // Remove messages
      setMessages(prev => {
        const newMessages = { ...prev }
        delete newMessages[conversationId]
        return newMessages
      })
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      throw error
    }
  }

  const markConversationAsRead = async (conversationId) => {
    try {
      const conversationMessages = messages[conversationId] || []
      const unreadMessageIds = conversationMessages
        .filter(msg => !msg.read && msg.senderId !== currentUser._id)
        .map(msg => msg._id)

      if (unreadMessageIds.length > 0) {
        await messagingAPI.markAsRead(conversationId, unreadMessageIds)

        // Update local state
        setMessages(prev => ({
          ...prev,
          [conversationId]: prev[conversationId].map(msg =>
            unreadMessageIds.includes(msg._id)
              ? { ...msg, read: true, readAt: new Date() }
              : msg
          )
        }))

        setUnreadCounts(prev => ({
          ...prev,
          [conversationId]: 0
        }))
      }
    } catch (error) {
      console.error('Failed to mark conversation as read:', error)
    }
  }

  const contextValue = {
    // State
    conversations,
    activeConversation,
    messages,
    loading,
    unreadCounts,
    searchResults,
    searchLoading,

    // Actions
    selectConversation,
    sendMessage,
    startConversation,
    searchUsers,
    deleteConversation,
    markConversationAsRead,
    loadConversations,
    loadUnreadCounts,
  }

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  )
}
