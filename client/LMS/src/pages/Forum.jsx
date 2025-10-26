import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { forumAPI } from '../services/api';

// Mock data for forum posts
const mockPosts = [
  {
    id: 1,
    title: 'Assignment 1 Clarification',
    content: 'I have a question about the requirements for Assignment 1. Are we allowed to use external libraries?',
    author: 'Alex Johnson',
    authorId: 3,
    authorAvatar: 'AJ',
    courseId: 1,
    courseName: 'CS101 - Introduction to Computer Science',
    createdAt: '2025-03-10T14:30:00Z',
    updatedAt: '2025-03-10T14:30:00Z',
    isPinned: true,
    isClosed: false,
    tags: ['assignment', 'question'],
    replies: [
      {
        id: 101,
        content: 'Yes, you can use external libraries as long as you properly document them in your submission.',
        author: 'Dr. Sarah Johnson',
        authorId: 2,
        authorAvatar: 'SJ',
        isInstructor: true,
        createdAt: '2025-03-10T15:15:00Z',
        likes: 5,
        isLiked: false,
        replies: [
          {
            id: 103,
            content: 'Thank you for the clarification!',
            author: 'Alex Johnson',
            authorId: 3,
            authorAvatar: 'AJ',
            createdAt: '2025-03-10T15:30:00Z',
            likes: 2,
            isLiked: true,
          }
        ]
      },
      {
        id: 102,
        content: 'I was wondering the same thing. Also, is there a specific format you want us to follow for the documentation?',
        author: 'Taylor Smith',
        authorId: 4,
        authorAvatar: 'TS',
        createdAt: '2025-03-10T15:45:00Z',
        likes: 3,
        isLiked: false,
      }
    ]
  },
  {
    id: 2,
    title: 'Study Group for Midterm',
    content: 'Anyone interested in forming a study group for the upcoming midterm? We can meet in the library on Friday at 2 PM.',
    author: 'Jordan Lee',
    authorId: 5,
    authorAvatar: 'JL',
    courseId: 1,
    courseName: 'CS101 - Introduction to Computer Science',
    createdAt: '2025-03-08T09:15:00Z',
    updatedAt: '2025-03-08T09:15:00Z',
    isPinned: false,
    isClosed: false,
    tags: ['study-group', 'midterm'],
    replies: [
      {
        id: 201,
        content: 'I\'d love to join! I\'ll be there.',
        author: 'Casey Kim',
        authorId: 6,
        authorAvatar: 'CK',
        createdAt: '2025-03-08T10:30:00Z',
        likes: 1,
        isLiked: true,
      },
      {
        id: 202,
        content: 'Count me in too!',
        author: 'Riley Chen',
        authorId: 7,
        authorAvatar: 'RC',
        createdAt: '2025-03-08T11:45:00Z',
        likes: 0,
        isLiked: false,
      }
    ]
  },
  {
    id: 3,
    title: 'Important: Office Hours Changed',
    content: 'Just a reminder that my office hours for this week have been moved to Thursday 2-4 PM due to a department meeting.',
    author: 'Dr. Sarah Johnson',
    authorId: 2,
    authorAvatar: 'SJ',
    courseId: 1,
    courseName: 'CS101 - Introduction to Computer Science',
    createdAt: '2025-03-05T16:20:00Z',
    updatedAt: '2025-03-05T16:20:00Z',
    isPinned: true,
    isClosed: true,
    tags: ['office-hours'],
    replies: []
  }
];

// Mock courses for the filter dropdown
const mockCourses = [
  { id: 1, code: 'CS101', name: 'Introduction to Computer Science' },
  { id: 2, code: 'MATH201', name: 'Linear Algebra' },
  { id: 3, code: 'ENG150', name: 'Academic Writing' }
];

// Avatar component
const Avatar = ({ initials, isInstructor = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-medium text-white ${
      isInstructor ? 'bg-purple-600' : 'bg-primary-600'
    }`}>
      {initials}
    </div>
  );
};

// TimeAgo component
const TimeAgo = ({ date }) => {
  const now = new Date();
  const postDate = new Date(date);
  const seconds = Math.floor((now - postDate) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
  
  return 'just now';
};

// Tag component
const Tag = ({ label, color = 'gray' }) => {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {label}
    </span>
  );
};

// Reply component
const Reply = ({ reply, onLike, onReply, isNested = false }) => {
  const { currentUser } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      // In a real app, we would call the API here
      // await forumAPI.addReply(reply.id, { content: replyContent });
      
      // For demo purposes, we'll just show a success message
      alert('Reply submitted successfully!');
      setReplyContent('');
      setShowReplyForm(false);
      
      // In a real app, we would refresh the replies or update the state
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex ${isNested ? 'ml-8 mt-4' : 'mt-4'}`}>
      <div className="flex-shrink-0 mr-3">
        <Avatar 
          initials={reply.authorAvatar} 
          isInstructor={reply.isInstructor}
          size="sm"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-900">
                {reply.author}
                {reply.isInstructor && (
                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    Instructor
                  </span>
                )}
              </p>
              <span className="mx-1 text-gray-500">·</span>
              <p className="text-xs text-gray-500">
                <TimeAgo date={reply.createdAt} />
              </p>
            </div>
            <button
              onClick={() => onLike(reply.id)}
              className={`text-sm flex items-center ${reply.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg
                className="h-4 w-4 mr-1"
                fill={reply.isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {reply.likes}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-700">{reply.content}</p>
          
          {!isNested && (
            <div className="mt-2 flex items-center text-xs space-x-4">
              <button 
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-gray-500 hover:text-gray-700"
              >
                Reply
              </button>
              {currentUser?.id === reply.authorId && (
                <button className="text-gray-500 hover:text-gray-700">
                  Edit
                </button>
              )}
            </div>
          )}
        </div>

        {showReplyForm && (
          <form onSubmit={handleSubmitReply} className="mt-2">
            <div className="flex">
              <div className="flex-1">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Write a reply..."
                  required
                />
              </div>
              <div className="ml-2 flex-shrink-0">
                <button
                  type="submit"
                  disabled={isSubmitting || !replyContent.trim()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Nested replies */}
        {reply.replies && reply.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {reply.replies.map((nestedReply) => (
              <Reply 
                key={nestedReply.id} 
                reply={nestedReply} 
                onLike={onLike}
                onReply={onReply}
                isNested={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function Forum() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    courseId: '',
    tags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available tags for the tag selector
  const availableTags = [
    { id: 'question', name: 'Question', color: 'blue' },
    { id: 'discussion', name: 'Discussion', color: 'green' },
    { id: 'assignment', name: 'Assignment', color: 'yellow' },
    { id: 'study-group', name: 'Study Group', color: 'indigo' },
    { id: 'resource', name: 'Resource', color: 'pink' },
  ];

  // Filter posts based on selected filters
  const filteredPosts = posts.filter(post => {
    // Filter by course
    if (selectedCourse !== 'all' && post.courseId.toString() !== selectedCourse) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !post.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === 'my-posts' && post.authorId !== currentUser?.id) {
      return false;
    } else if (activeTab === 'unanswered' && (post.replies.length > 0 || post.authorId === currentUser?.id)) {
      return false;
    } else if (activeTab === 'pinned' && !post.isPinned) {
      return false;
    }
    
    return true;
  });

  // Sort posts: pinned first, then by most recent
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch this from the API
        // const response = await forumAPI.getPosts();
        // setPosts(response.data);
        
        // For now, we'll use mock data
        setTimeout(() => {
          setPosts(mockPosts);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle like on a post or reply
  const handleLike = async (postId, replyId = null) => {
    try {
      // In a real app, we would call the API to like/unlike
      // await forumAPI.likePost(postId, replyId);
      
      // For demo, we'll just update the local state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          // If it's a reply
          if (replyId) {
            const updateReplies = (replies) => 
              replies.map(reply => {
                if (reply.id === replyId) {
                  return {
                    ...reply,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    isLiked: !reply.isLiked
                  };
                }
                // Check nested replies
                if (reply.replies && reply.replies.length > 0) {
                  return {
                    ...reply,
                    replies: updateReplies(reply.replies)
                  };
                }
                return reply;
              });
            
            return {
              ...post,
              replies: updateReplies(post.replies)
            };
          } 
          // If it's a post
          else {
            return {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            };
          }
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handle creating a new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.courseId) return;
    
    setIsSubmitting(true);
    try {
      // In a real app, we would call the API to create the post
      // const response = await forumAPI.createPost(newPost);
      
      // For demo, we'll just add it to the local state
      const newPostObj = {
        id: Date.now(), // Temporary ID
        title: newPost.title,
        content: newPost.content,
        author: currentUser?.name || 'Current User',
        authorId: currentUser?.id || 1,
        authorAvatar: (currentUser?.name || 'CU').split(' ').map(n => n[0]).join('').toUpperCase(),
        courseId: parseInt(newPost.courseId),
        courseName: mockCourses.find(c => c.id === parseInt(newPost.courseId))?.name || 'Unknown Course',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
        isClosed: false,
        tags: newPost.tags,
        replies: [],
        likes: 0,
        isLiked: false,
      };
      
      setPosts([newPostObj, ...posts]);
      setNewPost({
        title: '',
        content: '',
        courseId: '',
        tags: []
      });
      setIsCreatePostOpen(false);
      
      // Show success message
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle tag selection
  const toggleTag = (tagId) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Forum</h1>
          <p className="mt-2 text-gray-600">
            Ask questions, share resources, and collaborate with your peers
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button
            type="button"
            onClick={() => setIsCreatePostOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Post
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-md">
            <label htmlFor="search" className="sr-only">
              Search posts
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full sm:w-64">
            <label htmlFor="course-filter" className="sr-only">
              Filter by course
            </label>
            <select
              id="course-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="all">All Courses</option>
              {mockCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setActiveTab('my-posts')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-posts'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Posts
            </button>
            <button
              onClick={() => setActiveTab('unanswered')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'unanswered'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Unanswered
            </button>
            <button
              onClick={() => setActiveTab('pinned')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pinned'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pinned
            </button>
          </nav>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
            <div key={post.id} className="bg-white shadow overflow-hidden rounded-lg">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <Avatar 
                      initials={post.authorAvatar} 
                      isInstructor={post.author === 'Dr. Sarah Johnson'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {post.title}
                          {post.isPinned && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.5 3.5a2 2 0 100 4h9a2 2 0 100-4h-9z" />
                                <path fillRule="evenodd" d="M12.5 3.5a1 1 0 011 1v11.5a1 1 0 01-1 1h-9a1 1 0 01-1-1V4.5a1 1 0 011-1h9z" clipRule="evenodd" />
                              </svg>
                              Pinned
                            </span>
                          )}
                          {post.isClosed && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Closed
                            </span>
                          )}
                        </h3>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span>{post.author}</span>
                            {post.author === 'Dr. Sarah Johnson' && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                Instructor
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span><TimeAgo date={post.createdAt} /></span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span>{post.courseName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`p-2 rounded-full ${post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-gray-500'}`}
                        >
                          <svg
                            className="h-5 w-5"
                            fill={post.isLiked ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-700 space-y-4">
                      <p>{post.content}</p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map((tag) => {
                            const tagInfo = availableTags.find(t => t.id === tag);
                            return tagInfo ? (
                              <Tag key={tag} label={tagInfo.name} color={tagInfo.color} />
                            ) : null;
                          })}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                          >
                            <svg className="h-5 w-5 mr-1.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                            </svg>
                            {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                          >
                            <svg className="h-5 w-5 mr-1.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            1.2k views
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                            onClick={() => {
                              // Scroll to the reply form at the bottom of the post
                              document.getElementById(`post-${post.id}`)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Replies */}
              {post.replies && post.replies.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
                  </h4>
                  
                  <div className="space-y-4">
                    {post.replies.map((reply) => (
                      <Reply 
                        key={reply.id} 
                        reply={reply} 
                        onLike={(replyId) => handleLike(post.id, replyId)}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Reply Form */}
              <div id={`post-${post.id}`} className="bg-white px-6 py-4 border-t border-gray-200">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const content = formData.get('reply');
                  if (content.trim()) {
                    // In a real app, we would call the API to add the reply
                    const newReply = {
                      id: Date.now(),
                      content,
                      author: currentUser?.name || 'Current User',
                      authorId: currentUser?.id || 1,
                      authorAvatar: (currentUser?.name || 'CU').split(' ').map(n => n[0]).join('').toUpperCase(),
                      isInstructor: currentUser?.role === 'teacher',
                      createdAt: new Date().toISOString(),
                      likes: 0,
                      isLiked: false,
                      replies: []
                    };
                    
                    setPosts(posts.map(p => 
                      p.id === post.id 
                        ? { ...p, replies: [...p.replies, newReply] } 
                        : p
                    ));
                    
                    // Reset the form
                    e.target.reset();
                  }
                }}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <Avatar 
                        initials={(currentUser?.name || 'CU').split(' ').map(n => n[0]).join('').toUpperCase()}
                        isInstructor={currentUser?.role === 'teacher'}
                        size="sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor={`reply-${post.id}`} className="sr-only">
                        Reply to post
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="reply"
                          id={`reply-${post.id}`}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Write a reply..."
                        />
                        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                          <button
                            type="submit"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'my-posts'
                ? "You haven't created any posts yet."
                : activeTab === 'unanswered'
                ? 'All questions have been answered!'
                : activeTab === 'pinned'
                ? 'No pinned posts found.'
                : 'No posts match your current filters.'}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsCreatePostOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Post
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsCreatePostOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Create New Post
                  </h3>
                  <div className="mt-4">
                    <form onSubmit={handleCreatePost}>
                      <div className="mb-4">
                        <label htmlFor="post-title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          id="post-title"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Enter a title for your post"
                          value={newPost.title}
                          onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="post-content" className="block text-sm font-medium text-gray-700">
                          Content
                        </label>
                        <textarea
                          id="post-content"
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="What would you like to post?"
                          value={newPost.content}
                          onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="post-course" className="block text-sm font-medium text-gray-700">
                          Course
                        </label>
                        <select
                          id="post-course"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={newPost.courseId}
                          onChange={(e) => setNewPost({...newPost, courseId: e.target.value})}
                          required
                        >
                          <option value="">Select a course</option>
                          {mockCourses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.code} - {course.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags (Optional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableTags.map((tag) => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => toggleTag(tag.id)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                newPost.tags.includes(tag.id)
                                  ? `bg-${tag.color}-100 text-${tag.color}-800`
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {tag.name}
                              {newPost.tags.includes(tag.id) && (
                                <svg className="ml-1.5 -mr-0.5 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          disabled={isSubmitting || !newPost.title || !newPost.content || !newPost.courseId}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Posting...' : 'Create Post'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          onClick={() => setIsCreatePostOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
