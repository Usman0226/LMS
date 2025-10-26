import React, { useState, useEffect, useRef } from 'react'
import { useMessaging } from '../context/MessagingContext'
import { useAuth } from '../context/AuthContext'
import {
  PaperAirplaneIcon,
  UserIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const MessageBubble = ({ message, isOwn }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwn
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}>
        <p className="text-sm">{message.content}</p>
        <div className={`text-xs mt-1 ${
          isOwn ? 'text-primary-100' : 'text-gray-500'
        }`}>
          {formatTime(message.createdAt)}
          {message.read && isOwn && (
            <span className="ml-1">✓</span>
          )}
        </div>
      </div>
    </div>
  )
}

const ConversationList = ({ onSelectConversation }) => {
  const { conversations, loading, unreadCounts } = useMessaging()
  const { currentUser } = useAuth()

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== currentUser._id)
  }

  const formatLastMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>No conversations yet</p>
          <p className="text-sm">Start a conversation to begin messaging</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {conversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation)
            const unreadCount = unreadCounts[conversation._id] || 0

            return (
              <div
                key={conversation._id}
                onClick={() => onSelectConversation(conversation)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {otherParticipant?.role === 'teacher' ? (
                      <AcademicCapIcon className="h-10 w-10 text-primary-600" />
                    ) : (
                      <UserIcon className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {otherParticipant?.name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end">
                    <p className="text-xs text-gray-500">
                      {formatLastMessageTime(conversation.updatedAt)}
                    </p>
                    {unreadCount > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-1">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e) => {
    setMessage(e.target.value)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex items-end space-x-3">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}

const ChatWindow = () => {
  const { activeConversation, messages, sendMessage, loading } = useMessaging()
  const { currentUser } = useAuth()
  const messagesEndRef = useRef(null)

  const conversationMessages = messages[activeConversation?._id] || []

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationMessages])

  const handleSendMessage = async (content) => {
    if (activeConversation) {
      try {
        await sendMessage(activeConversation._id, content)
      } catch (error) {
        console.error('Failed to send message:', error)
        // Could show toast notification here
      }
    }
  }

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Select a conversation to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <UserIcon className="h-8 w-8 text-gray-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {activeConversation.participants
                .find(p => p._id !== currentUser._id)?.name || 'Unknown User'}
            </h3>
            <p className="text-xs text-gray-500">
              {conversationMessages.length} messages
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <ChatBubbleLeftIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          conversationMessages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={msg.senderId === currentUser._id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={loading}
      />
    </div>
  )
}

const StartConversationModal = ({ isOpen, onClose, onStartConversation }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const { searchUsers, searchResults, searchLoading } = useMessaging()

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      await searchUsers(query)
    }
  }

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev =>
      prev.find(u => u._id === user._id)
        ? prev.filter(u => u._id !== user._id)
        : [...prev, user]
    )
  }

  const handleStartChat = async () => {
    if (selectedUsers.length > 0) {
      try {
        const participantIds = selectedUsers.map(u => u._id)
        await onStartConversation(participantIds)
        onClose()
        setSearchQuery('')
        setSelectedUsers([])
      } catch (error) {
        console.error('Failed to start conversation:', error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Start New Conversation</h3>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="max-h-64 overflow-y-auto mb-4">
            {searchLoading ? (
              <div className="text-center py-4">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => toggleUserSelection(user)}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedUsers.find(u => u._id === user._id)
                        ? 'bg-primary-100 text-primary-900'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {user.role === 'teacher' ? (
                        <AcademicCapIcon className="h-5 w-5 text-primary-600" />
                      ) : (
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">({user.role})</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-4 text-gray-500">No users found</div>
            ) : null}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleStartChat}
              disabled={selectedUsers.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ChatBubbleLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

export {
  ChatWindow,
  ConversationList,
  StartConversationModal,
  MessageBubble,
  MessageInput
}

export default ChatWindow
