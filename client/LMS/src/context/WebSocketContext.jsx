import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'

const WebSocketContext = createContext(null)

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}

export const WebSocketProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState([])
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (currentUser?._id && !socket) {
      initializeSocket()
    } else if ((!currentUser || !currentUser._id) && socket) {
      console.log('Cleaning up WebSocket connection')
      socket.off() // Remove all event listeners
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
      setNotifications([])
    }
    
    // Cleanup function
    return () => {
      if (socket) {
        console.log('Cleaning up WebSocket on unmount')
        socket.off()
        socket.disconnect()
      }
    }
  }, [currentUser?.id]) // Only re-run if currentUser.id changes

  const initializeSocket = () => {
    try {
      // Don't initialize if we've exceeded max attempts
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.log('Max reconnection attempts reached, giving up on WebSocket')
        return
      }
      
      // Only initialize if we have a valid user
      if (!currentUser?._id) {
        console.log('No valid user, skipping WebSocket initialization')
        return
      }
      
      console.log('Initializing WebSocket connection...')
      
      // In production, this would be your actual WebSocket server URL
      const socketUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000'

      const newSocket = io(socketUrl, {
        auth: {
          userId: currentUser._id,
          userRole: currentUser.role,
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      })

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('WebSocket connected:', newSocket.id)
        setIsConnected(true)
        reconnectAttempts.current = 0
        setSocket(newSocket)
      })

      newSocket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason)
        setIsConnected(false)
        
        // Don't auto-reconnect if we're in development and there's no WebSocket server
        if (process.env.NODE_ENV === 'development' && reason === 'io server disconnect') {
          console.log('WebSocket server not available in development - disabling WebSocket')
          return
        }
        
        // Auto-reconnect logic
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = 1000 * Math.min(reconnectAttempts.current + 1, 5) // Max 5 second delay
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`)
          
          const timeout = setTimeout(() => {
            reconnectAttempts.current += 1
            initializeSocket()
          }, delay)
          
          // Cleanup timeout on component unmount
          return () => clearTimeout(timeout)
        } else {
          console.log('Max reconnection attempts reached, giving up on WebSocket')
        }
      })

      newSocket.on('connect_error', (error) => {
        console.log('WebSocket connection error:', error.message)
        setIsConnected(false)

        // In development, silently handle WebSocket connection failures
        if (process.env.NODE_ENV === 'development') {
          console.log('WebSocket feature not available yet - continuing without real-time updates')
        }
      })

      // Notification handlers
      newSocket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev])
      })

      newSocket.on('new_assignment', (assignment) => {
        setNotifications(prev => [{
          type: 'assignment',
          title: 'New Assignment',
          message: `${assignment.title} has been posted`,
          data: assignment,
          timestamp: new Date(),
        }, ...prev])
      })

      newSocket.on('assignment_graded', (data) => {
        setNotifications(prev => [{
          type: 'grade',
          title: 'Assignment Graded',
          message: `${data.assignmentTitle} has been graded`,
          data: data,
          timestamp: new Date(),
        }, ...prev])
      })

      newSocket.on('forum_reply', (data) => {
        setNotifications(prev => [{
          type: 'forum',
          title: 'New Forum Reply',
          message: `New reply in "${data.discussionTitle}"`,
          data: data,
          timestamp: new Date(),
        }, ...prev])
      })

      setSocket(newSocket)
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
    }
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    )

    // Emit to server if needed
    if (socket) {
      socket.emit('mark_notification_read', notificationId)
    }
  }

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))

    if (socket) {
      socket.emit('clear_notification', notificationId)
    }
  }

  const clearAllNotifications = () => {
    setNotifications([])

    if (socket) {
      socket.emit('clear_all_notifications')
    }
  }

  const emitEvent = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data)
    } else {
      console.warn('WebSocket not connected, cannot emit event:', event)
    }
  }

  const contextValue = {
    socket,
    isConnected,
    notifications,
    markNotificationAsRead,
    clearNotification,
    clearAllNotifications,
    emitEvent,
    reconnectAttempts: reconnectAttempts.current,
  }

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  )
}
