import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  markAsRead,
  getUnreadCount,
  searchUsers,
  deleteConversation,
  toggleArchive
} from '../controllers/messagingController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

// All messaging routes require authentication
router.use(authenticate);

// Get conversations for current user
router.get('/conversations', getConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId/messages', getMessages);

// Send a message
router.post('/conversations/:conversationId/messages', sendMessage);

// Create a new conversation
router.post('/conversations', createConversation);

// Mark messages as read
router.patch('/conversations/:conversationId/read', markAsRead);

// Get unread message count
router.get('/unread-count', getUnreadCount);

// Search users for starting conversations
router.get('/users/search', searchUsers);

// Delete a conversation
router.delete('/conversations/:conversationId', deleteConversation);

// Archive/unarchive conversation (placeholder)
router.patch('/conversations/:conversationId/archive', toggleArchive);

export default router;
