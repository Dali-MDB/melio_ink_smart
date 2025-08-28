import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, Share2, User, ThumbsUp, Reply, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { apiClient } from '../lib/api'
import { transformPost, formatDate } from '../lib/utils'

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
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
        
        // Transform comments
        const transformedComments = commentsArray.map(comment => ({
          id: comment.id,
          author: {
            name: comment.owner?.first_name && comment.owner?.last_name 
              ? `${comment.owner.first_name} ${comment.owner.last_name}`
              : comment.owner?.username || 'Anonymous',
            avatar: comment.owner?.profile?.avatar || null
          },
          content: comment.content,
          likes: 0, // Backend doesn't have comment likes yet
          publishedAt: formatDate(comment.created_at),
          replies: comment.sub_comments?.map(reply => ({
            id: reply.id,
            author: {
              name: reply.owner?.first_name && reply.owner?.last_name 
                ? `${reply.owner.first_name} ${reply.owner.last_name}`
                : reply.owner?.username || 'Anonymous',
              avatar: reply.owner?.profile?.avatar || null
            },
            content: reply.content,
            likes: 0,
            publishedAt: formatDate(reply.created_at)
          })) || []
        }))
        
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

  const handleLike = async () => {
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

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    try {
      setSubmittingComment(true)
      await apiClient.createComment(id, { content: newComment })
      
      // Refresh comments
      const commentsData = await apiClient.getPostComments(id)
      
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
      
      const transformedComments = commentsArray.map(comment => ({
        id: comment.id,
        author: {
          name: comment.owner?.first_name && comment.owner?.last_name 
            ? `${comment.owner.first_name} ${comment.owner.last_name}`
            : comment.owner?.username || 'Anonymous',
          avatar: comment.owner?.profile?.avatar || null
        },
        content: comment.content,
        likes: 0,
        publishedAt: formatDate(comment.created_at),
        replies: comment.sub_comments?.map(reply => ({
          id: reply.id,
          author: {
            name: reply.owner?.first_name && reply.owner?.last_name 
              ? `${reply.owner.first_name} ${reply.owner.last_name}`
              : reply.owner?.username || 'Anonymous',
            avatar: reply.owner?.profile?.avatar || null
          },
          content: reply.content,
          likes: 0,
          publishedAt: formatDate(reply.created_at)
        })) || []
      }))
      
      setComments(transformedComments)
      setNewComment('')
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return
    
    try {
      setSubmittingReply(true)
      await apiClient.createComment(id, { content: replyText }, commentId)
      
      // Refresh comments
      const commentsData = await apiClient.getPostComments(id)
      
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
      
      const transformedComments = commentsArray.map(comment => ({
        id: comment.id,
        author: {
          name: comment.owner?.first_name && comment.owner?.last_name 
            ? `${comment.owner.first_name} ${comment.owner.last_name}`
            : comment.owner?.username || 'Anonymous',
          avatar: comment.owner?.profile?.avatar || null
        },
        content: comment.content,
        likes: 0,
        publishedAt: formatDate(comment.created_at),
        replies: comment.sub_comments?.map(reply => ({
          id: reply.id,
          author: {
            name: reply.owner?.first_name && reply.owner?.last_name 
              ? `${reply.owner.first_name} ${reply.owner.last_name}`
              : reply.owner?.username || 'Anonymous',
            avatar: reply.owner?.profile?.avatar || null
          },
          content: reply.content,
          likes: 0,
          publishedAt: formatDate(reply.created_at)
        })) || []
      }))
      
      setComments(transformedComments)
      setReplyText('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Failed to post reply:', error)
    } finally {
      setSubmittingReply(false)
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
          {post.tags.length > 0 && (
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
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
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
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-blog-gray/80 leading-relaxed mb-6">
            {post.content}
          </p>
        </div>

        {/* Comments Section */}
        <section className="border-t border-blog-gray/10 pt-8">
          <h3 className="font-serif text-2xl font-bold text-blog-gray mb-6">
            Comments ({comments.length})
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50 focus:border-blog-green bg-white/50 resize-none"
              rows={4}
              disabled={submittingComment}
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={!newComment.trim() || submittingComment}
                className="bg-blog-green text-white px-6 py-2 rounded-lg hover:bg-blog-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submittingComment && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{submittingComment ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className="bg-white/40 rounded-lg p-6">
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
                  <button className="flex items-center space-x-1 text-blog-gray/60 hover:text-blog-green transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </button>
                  <button 
                    onClick={() => startReply(comment.id)}
                    className="flex items-center space-x-1 text-blog-gray/60 hover:text-blog-green transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
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
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={cancelReply}
                        disabled={submittingReply}
                        className="px-3 py-1 text-sm text-blog-gray/60 hover:text-blog-gray transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReply(comment.id)}
                        disabled={!replyText.trim() || submittingReply}
                        className="px-3 py-1 text-sm bg-blog-green text-white rounded hover:bg-blog-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        {submittingReply && <Loader2 className="w-3 h-3 animate-spin" />}
                        <span>{submittingReply ? 'Posting...' : 'Reply'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-4">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="bg-blog-ivory/50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          {reply.author.avatar ? (
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
                            <p className="font-medium text-blog-gray text-sm">{reply.author.name}</p>
                            <p className="text-xs text-blog-gray/60">{reply.publishedAt}</p>
                          </div>
                        </div>
                        <p className="text-blog-gray/80 text-sm leading-relaxed mb-3">{reply.content}</p>
                        <button className="flex items-center space-x-1 text-blog-gray/60 hover:text-blog-green transition-colors text-xs">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  )
}
