import { Conversation } from '../models/conversation.model.js'
import { Message } from '../models/conversation.model.js'
import User from '../models/user.model.js'
import { io } from '../server.js'

// Get conversations for current user
export const getConversations = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: true, data: [] })
    }

    const conversations = await Conversation.find({
      participants: req.user._id
    })
    .populate('participants', 'name email')
    .populate('lastMessage.sender', 'name')
    .sort({ updatedAt: -1 })

    res.json({ success: true, data: conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch conversations' })
  }
}

// Get messages for a conversation from the present socket
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    const { page = 1, limit = 50 } = req.query

    if (!req.user) {
      return res.json({ success: true, data: [], pagination: { total: 0, page: 1, totalPages: 0, limit: 50 } })
    }

    // Check if user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    })

    if (!conversation) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Message.countDocuments({ conversation: conversationId })

    res.json({
      success: true,
      data: messages.reverse(),
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch messages' })
  }
}

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params
    const { content, type = 'text' } = req.body

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    // Check if user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    })

    if (!conversation) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content,
      type
    })

    // Update conversation's last message
    conversation.lastMessage = {
      content,
      sender: req.user._id,
      timestamp: new Date()
    }
    conversation.updatedAt = new Date()
    await conversation.save()

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name')

    // Emit real-time message to other participants
    conversation.participants.forEach(participantId => {
      if (participantId.toString() !== req.user._id.toString()) {
        io.to(participantId.toString()).emit('newMessage', populatedMessage);
      }
    });

    res.status(201).json({ success: true, data: populatedMessage })
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ success: false, message: 'Failed to send message' })
  }
}

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { participants } = req.body

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    // Add current user to participants
    const allParticipants = [req.user._id, ...participants]

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: allParticipants, $size: allParticipants.length }
    })

    if (existingConversation) {
      return res.json({ success: true, data: existingConversation })
    }

    const conversation = await Conversation.create({
      participants: allParticipants
    })

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name email')

    res.status(201).json({ success: true, data: populatedConversation })
  } catch (error) {
    console.error('Error creating conversation:', error)
    res.status(500).json({ success: false, message: 'Failed to create conversation' })
  }
}

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: true, data: { count: 0 } })
    }

    const conversations = await Conversation.find({
      participants: req.user._id
    })

    let totalUnread = 0

    for (const conversation of conversations) {
      const unreadMessages = await Message.countDocuments({
        conversation: conversation._id,
        sender: { $ne: req.user._id },
        'readBy.user': { $ne: req.user._id }
      })
      totalUnread += unreadMessages
    }

    res.json({ success: true, data: { count: totalUnread } })
  } catch (error) {
    console.error('Error fetching unread count:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch unread count' })
  }
}

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params
    const { messageIds } = req.body

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    const readUpdates = messageIds.map(messageId => ({
      updateOne: {
        filter: { _id: messageId, conversation: conversationId },
        update: {
          $addToSet: {
            readBy: {
              user: req.user._id,
              readAt: new Date()
            }
          }
        }
      }
    }))

    await Message.bulkWrite(readUpdates)

    res.json({ success: true, message: 'Messages marked as read' })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    res.status(500).json({ success: false, message: 'Failed to mark messages as read' })
  }
}

// Search users for starting conversations
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query

    if (!req.user) {
      return res.json({ success: true, data: [] })
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude current user
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
    .select('name email role')
    .limit(10)

    res.json({ success: true, data: users })
  } catch (error) {
    console.error('Error searching users:', error)
    res.status(500).json({ success: false, message: 'Failed to search users' })
  }
}

// Delete a conversation
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    })

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' })
    }

    // Check if user is the only participant or allow deletion
    // For simplicity, allow if user is participant
    await Conversation.findByIdAndDelete(conversationId)

    // Optionally delete associated messages
    await Message.deleteMany({ conversation: conversationId })

    res.json({ success: true, message: 'Conversation deleted' })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    res.status(500).json({ success: false, message: 'Failed to delete conversation' })
  }
}

// Archive/unarchive conversation
export const toggleArchive = async (req, res) => {
  try {
    const { conversationId } = req.params

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    })

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' })
    }

    // Toggle archived status (assuming there's an archived field)
    conversation.archived = !conversation.archived
    await conversation.save()

    res.json({ success: true, message: 'Conversation archive status updated' })
  } catch (error) {
    console.error('Error toggling archive:', error)
    res.status(500).json({ success: false, message: 'Failed to update conversation' })
  }
}
