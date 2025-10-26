import React, { useState } from 'react'
import { useMessaging } from '../context/MessagingContext'
import { useAuth } from '../context/AuthContext'
import {
  ChatWindow,
  ConversationList,
  StartConversationModal
} from '../components/ChatWindow'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'

export default function Messages() {
  const { currentUser } = useAuth()
  const {
    conversations,
    activeConversation,
    selectConversation,
    startConversation,
    searchUsers,
    loading
  } = useMessaging()

  const [showStartChatModal, setShowStartChatModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleStartConversation = async (participantIds) => {
    try {
      await startConversation(participantIds)
    } catch (error) {
      console.error('Failed to start conversation:', error)
      // Could show error toast here
    }
  }

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true

    const otherParticipant = conv.participants.find(p => p._id !== currentUser._id)
    return otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <button
              onClick={() => setShowStartChatModal(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Chat
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-hidden">
          <ConversationList
            conversations={filteredConversations}
            onSelectConversation={selectConversation}
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatWindow />
      </div>

      {/* Start Conversation Modal */}
      <StartConversationModal
        isOpen={showStartChatModal}
        onClose={() => setShowStartChatModal(false)}
        onStartConversation={handleStartConversation}
      />
    </div>
  )
}
