import React, { useState, useEffect } from 'react'
import { useWebSocket } from '../context/WebSocketContext'
import {
  XMarkIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'

const NotificationToast = ({ notification, onClose, onMarkRead }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100)

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose()
      if (!notification.read) {
        onMarkRead(notification.id)
      }
    }, 300)
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'assignment':
        return <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600" />
      case 'grade':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'forum':
        return <ChatBubbleLeftIcon className="h-5 w-5 text-orange-600" />
      default:
        return <BellIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getBorderColor = () => {
    switch (notification.type) {
      case 'assignment':
        return 'border-l-blue-500'
      case 'grade':
        return 'border-l-green-500'
      case 'forum':
        return 'border-l-orange-500'
      default:
        return 'border-l-gray-500'
    }
  }

  return (
    <div
      className={`
        fixed top-4 right-4 max-w-sm w-full bg-white border-l-4 shadow-lg rounded-lg z-50 transform transition-all duration-300 ease-in-out
        ${getBorderColor()}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {notification.message}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const NotificationSystem = () => {
  const { notifications, markNotificationAsRead, clearNotification } = useWebSocket()

  return (
    <div className="fixed top-0 right-0 z-50">
      {notifications.slice(0, 3).map((notification, index) => (
        <div
          key={notification.id || `${notification.type}-${index}`}
          style={{ transform: `translateY(${index * 10}px)` }}
        >
          <NotificationToast
            notification={{
              ...notification,
              id: notification.id || `${notification.type}-${Date.now()}-${index}`,
            }}
            onClose={() => clearNotification(notification.id)}
            onMarkRead={markNotificationAsRead}
          />
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem
