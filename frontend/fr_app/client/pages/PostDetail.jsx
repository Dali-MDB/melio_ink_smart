import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, Share2, User, ThumbsUp, Reply, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { apiClient } from '../lib/api'
import { transformPost, formatDate } from '../lib/utils'
import { useAuth } from '../context/AuthContext'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [rawSummary, setRawSummary] = useState('')
  const [comments, setComments] = useState([])
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const [expandedComments, setExpandedComments] = useState({})
  const [showSummary, setShowSummary] = useState(false)

  // Transform comments data to match our format (hoisted via function declaration)
  function transformComments(commentsData) {
    console.log('Raw comments data received:', commentsData);
    
    let commentsArray = [];
    
    if (!commentsData) {
      console.warn('No comments data received');
      return [];
    }
    
    if (Array.isArray(commentsData)) {
      commentsArray = commentsData;
    } else if (commentsData.results) {
      commentsArray = commentsData.results;
    } else if (commentsData.data) {
      commentsArray = Array.isArray(commentsData.data) 
        ? commentsData.data 
        : [commentsData.data];
    } else if (typeof commentsData === 'object' && !Array.isArray(commentsData)) {
      commentsArray = Object.values(commentsData);
    }
    
    console.log('Processed comments array:', commentsArray);
    
    const mapNode = (node) => {
      if (!node) return null;
      const childSource = node.replies || node.children || node.sub_comments || [];
      const mapped = {
        id: node.id,
        author: {
          name: (node.owner?.first_name || node.owner?.last_name)
                  ? `${node.owner?.first_name || ''} ${node.owner?.last_name || ''}`.trim()
                  : (node.owner?.username || node.user?.username || 'Anonymous'),
          avatar: node.owner?.profile?.pfp || node.owner?.profile?.avatar || node.user?.avatar || null
        },
        content: node.content || node.text || '',
        likes: node.likes_count || node.likes?.length || 0,
        isLiked: node.is_liked || node.liked_by_me || false,
        publishedAt: formatDate(node.created_at || node.date_created || node.timestamp),
        replies: Array.isArray(childSource) ? childSource.map(mapNode).filter(Boolean) : []
      };
      return mapped;
    };
    
    return commentsArray.map(mapNode).filter(Boolean);
  }

  // Update replies for any comment/reply id within the nested comments tree
  function updateRepliesForCommentId(targetId, newRepliesArray) {
    setComments(prev => prev.map(c => replaceRepliesRecursive(c)) )
    function replaceRepliesRecursive(node) {
      if (!node) return node
      if (node.id === targetId) {
        return { ...node, replies: newRepliesArray }
      }
      if (Array.isArray(node.replies) && node.replies.length > 0) {
        return { ...node, replies: node.replies.map(child => replaceRepliesRecursive(child)) }
      }
      return node
    }
  }

  // Recursive reply renderer
  const ReplyItem = ({ reply, depth = 1 }) => {
    return (
      <div className={`rounded-lg p-4 border ${reply.isLiked ? 'bg-blog-green/5 border-blog-green/40' : 'border-blog-gray/10'} ${depth === 1 ? (reply.isLiked ? '' : 'bg-white/40') : (reply.isLiked ? '' : 'bg-white/30')} ${depth > 1 ? 'ml-8 mt-3' : ''}`}>
        <div className="flex items-center space-x-3 mb-3">
          {reply.author?.avatar ? (
            <img 
              src={reply.author.avatar} 
              alt={reply.author.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blog-green/20 flex items-center justify-center">
              <User className="w-3 h-3 text-blog-green" />
            </div>
          )}
          <div className="flex-grow">
            <p className="font-medium text-blog-gray text-sm">{reply.author?.name || 'Anonymous'}</p>
            <p className="text-xs text-blog-gray/60">{reply.publishedAt}</p>
          </div>
        </div>
        <p className="text-blog-gray/80 text-sm leading-relaxed mb-3">{reply.content}</p>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => handleCommentLike(reply.id, reply.isLiked)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md ${reply.isLiked ? 'text-blog-green bg-blog-green/10' : 'text-blog-gray/60 hover:text-blog-green'} transition-colors text-sm`}
            disabled={submittingComment || submittingReply}
          >
            <ThumbsUp className="w-4 h-4" fill={reply.isLiked ? 'currentColor' : 'none'} stroke="currentColor" />
            <span>{reply.likes}</span>
          </button>
          <button 
            type="button"
            onClick={() => startReply(reply.id)}
            className="flex items-center space-x-1 text-blog-gray/60 hover:text-blog-green transition-colors text-sm"
          >
            <Reply className="w-4 h-4" />
            <span>Reply</span>
          </button>
          {Array.isArray(reply.replies) && (
            <button
              type="button"
              onClick={async () => {
                if (!expandedComments[reply.id] && (!reply.replies || reply.replies.length === 0)) {
                  try {
                    const full = await apiClient.getComment(id, reply.id)
                    updateRepliesForCommentId(reply.id, transformComments({ data: full.sub_comments }))
                  } catch (e) {
                    console.error('Failed to fetch replies for reply', reply.id, e)
                  }
                }
                setExpandedComments(prev => ({ ...prev, [reply.id]: !prev[reply.id] }))
              }}
              className="text-blog-gray/60 hover:text-blog-green transition-colors text-sm"
            >
              {expandedComments[reply.id] 
                ? `Hide replies (${reply.replies?.length || 0})` 
                : `View replies (${reply.replies?.length || 0})`}
            </button>
          )}
        </div>
        {replyingTo === reply.id && (
          <div className="mt-3 ml-4 border-l-2 border-blog-green/20 pl-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-3 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50 focus:border-blog-green bg-white/50 resize-none text-sm"
              rows={3}
              disabled={submittingReply}
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                type="button"
                onClick={cancelReply}
                className="px-3 py-1 text-sm text-blog-gray/70 hover:text-blog-gray"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleReplySubmit(e, reply.id)}
                disabled={!replyText.trim() || submittingReply}
                className="px-3 py-1 text-sm bg-blog-green text-white rounded-md hover:bg-blog-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submittingReply ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Posting...
                  </>
                ) : 'Post Reply'}
              </button>
            </div>
          </div>
        )}
        {Array.isArray(reply.replies) && expandedComments[reply.id] && (
          <div className="mt-2">
            {reply.replies.map(child => (
              <ReplyItem key={child.id} reply={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Fetch post and comments
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch post details
        const postData = await apiClient.getPost(id)
        console.log('Fetched post data:', postData)
        
        const transformedPost = transformPost(postData)
        console.log('Transformed post:', transformedPost)
        
        setPost(transformedPost)
        setRawSummary(postData?.summary || '')
        setLiked(transformedPost.isLiked)
        setBookmarked(transformedPost.isBookmarked)
        setLikeCount(transformedPost.likes)
        
        // Fetch comments
        const commentsData = await apiClient.getPostComments(id)
        console.log('Fetched comments data:', commentsData)
        
        // Handle paginated comments response
        let commentsArray = commentsData
        if (commentsData && typeof commentsData === 'object' && !Array.isArray(commentsData)) {
          if (commentsData.results) {
            commentsArray = commentsData.results
          } else if (commentsData.data) {
            commentsArray = commentsData.data
          } else {
            commentsArray = Object.values(commentsData)
          }
        }
        
        console.log('Comments array after processing:', commentsArray)
        const transformedComments = transformComments(commentsData)
        setComments(transformedComments)
        
      } catch (err) {
        console.error('Failed to fetch post data:', err)
        setError('Failed to load post. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPostData()
    }
  }, [id])

  // Handle like on a comment
  const handleCommentLike = async (commentId, isLiked) => {
    try {
      // Optimistic update
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !isLiked,
              likes: isLiked ? comment.likes - 1 : comment.likes + 1
            };
          }
          
          // Also update replies
          if (comment.replies) {
            const updatedReplies = comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLiked: !isLiked,
                  likes: isLiked ? reply.likes - 1 : reply.likes + 1
                };
              }
              return reply;
            });
            
            return {
              ...comment,
              replies: updatedReplies
            };
          }
          
          return comment;
        })
      );
      
      // Make the API call
      const response = await apiClient.likeComment(id, commentId);
      
      // If the API returns the updated comment, use that data
      if (response) {
        // Refresh comments to get the latest state
        const commentsData = await apiClient.getPostComments(id);
        setComments(transformComments(commentsData));
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
      setError('Failed to like comment. Please try again.');
      
      // Revert optimistic update on error
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: isLiked, // Revert to previous state
              likes: isLiked ? comment.likes : comment.likes - 1 // Revert like count
            };
          }
          
          // Also revert replies
          if (comment.replies) {
            const revertedReplies = comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLiked: isLiked,
                  likes: isLiked ? reply.likes : reply.likes - 1
                };
              }
              return reply;
            });
            
            return {
              ...comment,
              replies: revertedReplies
            };
          }
          
          return comment;
        })
      );
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/post/${id}` } })
      return
    }
    
    try {
      await apiClient.likePost(id)
      
      // Refresh post data to get updated like status and count
      const postData = await apiClient.getPost(id)
      const transformedPost = transformPost(postData)
      
      setLiked(transformedPost.isLiked)
      setLikeCount(transformedPost.likes)
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/post/${id}` } })
      return
    }
    
    try {
      await apiClient.savePost(id)
      
      // Refresh post data to get updated bookmark status
      const postData = await apiClient.getPost(id)
      const transformedPost = transformPost(postData)
      
      setBookmarked(transformedPost.isBookmarked)
    } catch (error) {
      console.error('Failed to bookmark post:', error)
    }
  }

  

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    
    if (!newComment.trim() || submittingComment) return
    
    setSubmittingComment(true)
    setError(null)
    
    try {
      const commentData = {
        content: newComment.trim()
      }
      
      // Add parent_comment_id if this is a reply
      if (replyingTo) {
        commentData.parent_comment_id = replyingTo;
      }
      
      console.log('Submitting comment with data:', { id, commentData, parentId: replyingTo });
      const response = await apiClient.createComment(id, commentData, replyingTo);
      console.log('Comment submission response:', response);
      
      // Refresh comments
      const commentsData = await apiClient.getPostComments(id);
      console.log('Fetched comments after submission:', commentsData);
      
      const transformedComments = transformComments(commentsData);
      console.log('Transformed comments:', transformedComments);
      
      setComments(transformedComments);
      
      // Clear the comment input and reset reply state
      setNewComment('');
      if (replyingTo) {
        setReplyingTo(null);
        setReplyText('');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      setError(error.response?.data?.detail || 'Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  }

  // Handle reply submission
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault()
    
    if (!replyText.trim() || submittingReply) return
    
    setSubmittingReply(true)
    setError(null)
    
    try {
      const replyData = {
        content: replyText.trim(),
        parent_comment_id: commentId
      }
      
      console.log('Submitting reply with data:', { postId: id, commentData: replyData, parentId: commentId });
      const response = await apiClient.createComment(id, replyData, commentId);
      console.log('Reply submission response:', response);
      
      // Refresh comments
      const commentsData = await apiClient.getPostComments(id);
      console.log('Fetched comments after reply:', commentsData);
      
      const transformedComments = transformComments(commentsData);
      console.log('Transformed comments after reply:', transformedComments);
      
      setComments(transformedComments);
      setExpandedComments(prev => ({ ...prev, [commentId]: true }));
      
      // Clear the reply input and reset reply state
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to post reply:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      setError(error.response?.data?.detail || 'Failed to post reply. Please try again.');
    } finally {
      setSubmittingReply(false);
    }
  }

  const startReply = (commentId) => {
    setReplyingTo(commentId)
    setReplyText('')
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setReplyText('')
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blog-green" />
            <span className="text-blog-gray">Loading post...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-blog-gray mb-4">
              {error || 'Post not found'}
            </h1>
            <p className="text-blog-gray/60">
              {error || 'The post you\'re looking for doesn\'t exist or has been removed.'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-blog-gray mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-6">
            {post.author.avatar ? (
              <img 
                src={post.author.avatar} 
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blog-green/20 flex items-center justify-center">
                <User className="w-6 h-6 text-blog-green" />
              </div>
            )}
            <div className="flex-grow">
              <p className="font-semibold text-blog-gray">{post.author.name}</p>
              <p className="text-blog-gray/60">{post.publishedAt}</p>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-sm font-medium bg-blog-green/10 text-blog-green rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between py-4 border-y border-blog-gray/10">
            <div className="flex items-center space-x-6">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  liked ? 'text-red-500' : 'text-blog-gray/60 hover:text-red-500'
                }`}
              >
                <Heart 
                  className="w-5 h-5"
                  fill={liked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={2}
                />
                <span>{likeCount}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-blog-gray/60">
                <MessageCircle className="w-5 h-5" />
                <span>{comments.length}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBookmark}
                className={`transition-colors ${
                  bookmarked ? 'text-blog-sage' : 'text-blog-gray/60 hover:text-blog-sage'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <button className="text-blog-gray/60 hover:text-blog-green transition-colors">
                <Share2 className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setShowSummary(prev => !prev)}
                className="px-3 py-1 text-sm rounded-md border border-blog-gray/20 text-blog-gray/70 hover:text-blog-green hover:border-blog-green/40 transition-colors"
              >
                Summary
              </button>
            </div>
          </div>
        </header>

        {showSummary && (
          <div className="mb-8 p-4 rounded-lg border border-blog-gray/10 bg-white/60">
            <h4 className="font-semibold text-blog-gray mb-2">Post Summary</h4>
            {rawSummary && rawSummary.trim() ? (
              <p className="text-blog-gray/80 leading-relaxed">{rawSummary}</p>
            ) : (
              <p className="text-blog-gray/60"><em>the summary is not available yet</em></p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-blog-gray/80 leading-relaxed mb-6">
            {post.content}
          </p>
        </div>

        {/* Comments Section */}
        <section className="border-t border-blog-gray/10 pt-8">
          <h3 className="font-serif text-2xl font-bold text-blog-gray mb-6">
            {loading ? 'Loading comments...' : comments.length > 0 ? `Comments (${comments.length})` : 'No comments yet'}
          </h3>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50 focus:border-blog-green bg-white/50 resize-none disabled:opacity-70"
              rows={4}
              disabled={submittingComment || loading}
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={!newComment.trim() || submittingComment || loading}
                className="bg-blog-green text-white px-6 py-2 rounded-lg hover:bg-blog-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submittingComment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : 'Post Comment'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blog-green" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-blog-gray/60">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-blog-gray/20" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map(comment => (
              <div key={comment.id} className={`rounded-lg p-6 border ${comment.isLiked ? 'bg-blog-green/5 border-blog-green/40' : 'bg-white/40 border-blog-gray/10'}`}>
                {/* Comment Header */}
                <div className="flex items-center space-x-3 mb-4">
                  {comment.author.avatar ? (
                    <img 
                      src={comment.author.avatar} 
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blog-green/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-blog-green" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="font-medium text-blog-gray">{comment.author.name}</p>
                    <p className="text-sm text-blog-gray/60">{comment.publishedAt}</p>
                  </div>
                </div>

                {/* Comment Content */}
                <p className="text-blog-gray/80 leading-relaxed mb-4">{comment.content}</p>

                {/* Comment Actions */}
                <div className="flex items-center space-x-4 text-sm">
                  <button 
                    onClick={() => handleCommentLike(comment.id, comment.isLiked)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-md ${comment.isLiked ? 'text-blog-green bg-blog-green/10' : 'text-blog-gray/60 hover:text-blog-green'} transition-colors`}
                    disabled={submittingComment || submittingReply}
                  >
                    <ThumbsUp className="w-4 h-4" fill={comment.isLiked ? 'currentColor' : 'none'} stroke="currentColor" />
                    <span>{comment.likes}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center space-x-1 text-blog-gray/60 hover:text-blog-green transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                  {comment.replies.length > 0 && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!expandedComments[comment.id] && (!comment.replies || comment.replies.length === 0)) {
                          try {
                            const full = await apiClient.getComment(id, comment.id)
                            setComments(prev => prev.map(c => c.id === comment.id ? {
                              ...c,
                              replies: transformComments({ data: full.sub_comments })
                            } : c))
                          } catch (e) {
                            console.error('Failed to fetch replies for comment', comment.id, e)
                          }
                        }
                        setExpandedComments(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))
                      }}
                      className="text-blog-gray/60 hover:text-blog-green transition-colors"
                    >
                      {expandedComments[comment.id] ? `Hide replies (${comment.replies.length})` : `View replies (${comment.replies.length})`}
                    </button>
                  )}
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="mt-4 ml-4 border-l-2 border-blog-green/20 pl-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-3 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50 focus:border-blog-green bg-white/50 resize-none text-sm"
                      rows={3}
                      disabled={submittingReply}
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="px-3 py-1 text-sm text-blog-gray/70 hover:text-blog-gray"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleReplySubmit(e, comment.id)}
                        disabled={!replyText.trim() || submittingReply}
                        className="px-3 py-1 text-sm bg-blog-green text-white rounded-md hover:bg-blog-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {submittingReply ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Posting...
                          </>
                        ) : 'Post Reply'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies.length > 0 && expandedComments[comment.id] && (
                  <div className="ml-8 mt-4 space-y-4">
                    {comment.replies.map(reply => (
                      <ReplyItem key={reply.id} reply={reply} />
                    ))}
                  </div>
                )}
                </div>
              ))
            )}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  )
}

export default PostDetail;
