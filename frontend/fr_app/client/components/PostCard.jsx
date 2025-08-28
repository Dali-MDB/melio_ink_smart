import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'
import { transformPost } from '../lib/utils'

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
  publishedAt
}) {
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
    
    if (isLoading) return
    
    setIsLoading(true)
    try {
      await apiClient.likePost(id)
      
      // Refresh post data to get updated like status and count
      const postData = await apiClient.getPost(id)
      const transformedPost = transformPost(postData)
      
      setLiked(transformedPost.isLiked)
      setLikeCount(transformedPost.likes)
    } catch (error) {
      console.error('Failed to like post:', error)
      // Revert the optimistic update
      setLiked(liked)
      setLikeCount(likes)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookmark = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    try {
      await apiClient.savePost(id)
      
      // Refresh post data to get updated bookmark status
      const postData = await apiClient.getPost(id)
      const transformedPost = transformPost(postData)
      
      setBookmarked(transformedPost.isBookmarked)
    } catch (error) {
      console.error('Failed to bookmark post:', error)
      // Revert the optimistic update
      setBookmarked(bookmarked)
    } finally {
      setIsLoading(false)
    }
  }

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
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likeCount}</span>
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
