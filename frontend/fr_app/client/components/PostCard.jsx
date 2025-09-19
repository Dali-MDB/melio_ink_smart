import { Link, useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'
import { transformPost } from '../lib/utils'
import { useAuth } from '../context/AuthContext'

export default function PostCard({
  id,
  title,
  summary,
  author,
  featuredImage,
  tags,
  likes,
  comments,
  isLiked = false,
  isBookmarked = false,
  publishedAt,
  onBookmarkChange
}) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [liked, setLiked] = useState(isLiked)
  const [bookmarked, setBookmarked] = useState(isBookmarked)
  const [likeCount, setLikeCount] = useState(likes)
  const [isLoading, setIsLoading] = useState(false)

  // Sync state with props when they change
  useEffect(() => {
    console.log('PostCard isLiked prop changed:', isLiked)
    setLiked(isLiked)
  }, [isLiked])

  useEffect(() => {
    console.log('PostCard isBookmarked prop changed:', isBookmarked)
    setBookmarked(isBookmarked)
  }, [isBookmarked])

  useEffect(() => {
    console.log('PostCard likes prop changed:', likes)
    setLikeCount(likes)
  }, [likes])

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      navigate('/login')
      return
    }
    
    console.log('Like button clicked. Current state:', { liked, likeCount, isLoading })
    
    if (isLoading) {
      console.log('Action prevented: Already processing like')
      return
    }
    
    // Optimistic update
    const wasLiked = liked
    const previousLikes = likeCount
    const newLikedState = !wasLiked
    const newLikeCount = wasLiked ? likeCount - 1 : likeCount + 1
    
    console.log('Updating UI optimistically:', { 
      from: { liked, likeCount },
      to: { liked: newLikedState, likeCount: newLikeCount }
    })
    
    setLiked(newLikedState)
    setLikeCount(newLikeCount)
    setIsLoading(true)
    
    try {
      // Toggle like
      await apiClient.likePost(id)
      
      // Verify the server state matches our optimistic update
      const postData = await apiClient.getPost(id)
      const transformedPost = transformPost(postData)
      
      // Only update if server state is different from our optimistic update
      if (transformedPost.isLiked !== !wasLiked || transformedPost.likes !== (wasLiked ? previousLikes - 1 : previousLikes + 1)) {
        setLiked(transformedPost.isLiked)
        setLikeCount(transformedPost.likes)
      }
    } catch (error) {
      console.error('Failed to like post:', error)
      // Revert optimistic update on error
      setLiked(wasLiked)
      setLikeCount(previousLikes)
      
      // Show error to user (you might want to use a toast notification here)
      alert('Failed to update like. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookmark = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      navigate('/login')
      return
    }
    
    if (isLoading) return
    
    // Optimistic update
    const wasBookmarked = bookmarked
    setBookmarked(!wasBookmarked)
    setIsLoading(true)
    
    try {
      await apiClient.savePost(id)
      
      // Verify the server state
      const postData = await apiClient.getPost(id)
      const transformedPost = transformPost(postData)
      
      // Only update if server state is different from our optimistic update
      if (transformedPost.isBookmarked !== !wasBookmarked) {
        setBookmarked(transformedPost.isBookmarked)
      }

      // Notify parent lists (e.g., Bookmarks page) to refresh
      if (typeof onBookmarkChange === 'function') {
        onBookmarkChange()
      }
    } catch (error) {
      console.error('Failed to bookmark post:', error)
      // Revert optimistic update on error
      setBookmarked(wasBookmarked)
      
      // Show error to user
      alert('Failed to update bookmark. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  console.log('Rendering PostCard:', { id, liked, likeCount, isLiked, likes })
  
  return (
    <Link to={`/post/${id}`} className="group">
      <article className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-blog-gray/10 dark:border-white/10 hover:border-blog-green/30 hover:shadow-lg transition-all duration-300">
        {/* Featured Image */}
        {featuredImage && (
          <div className="aspect-video overflow-hidden">
            <img 
              src={featuredImage} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              {author.avatar ? (
                <img 
                  src={author.avatar} 
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blog-green/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-blog-green" />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <p className="font-medium text-blog-gray">{author.name}</p>
              <p className="text-sm text-blog-gray/60">{publishedAt}</p>
            </div>
          </div>

          {/* Content */}
          <h2 className="font-serif font-bold text-xl text-blog-gray mb-3 group-hover:text-blog-green transition-colors line-clamp-2">
            {title}
          </h2>
          
          <p className="text-blog-gray/80 mb-4 line-clamp-3 leading-relaxed">
            {summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 text-xs font-medium bg-blog-green/10 text-blog-green rounded-full hover:bg-blog-green/20 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-blog-gray/10">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLike}
                disabled={isLoading}
                className={`flex items-center space-x-1 transition-colors ${
                  liked ? 'text-red-500' : 'text-blog-gray/60 hover:text-red-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart 
                  className="w-4 h-4"
                  fill={liked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={2}
                  data-testid={`heart-icon-${id}`}
                  data-liked={liked}
                />
                <span className="text-sm">
                  {likeCount}
                </span>
              </button>
              
              <div className="flex items-center space-x-1 text-blog-gray/60">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{comments}</span>
              </div>
            </div>

            <button 
              onClick={handleBookmark}
              disabled={isLoading}
              className={`transition-colors ${
                bookmarked ? 'text-blog-sage' : 'text-blog-gray/60 hover:text-blog-sage'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </article>
    </Link>
  )
}
