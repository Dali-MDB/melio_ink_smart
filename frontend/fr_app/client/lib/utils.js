// Date formatting utility
export function formatDate(dateString) {
  if (!dateString) return 'Unknown date'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  }
  
  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
}

// Transform backend post data to frontend format
export function transformPost(post) {
  if (!post) return null
  
  // Handle owner data
  const owner = post.owner || {}
  const authorName = owner.first_name && owner.last_name 
    ? `${owner.first_name} ${owner.last_name}`
    : owner.username || 'Anonymous'
  
  // Handle content and summary
  const content = post.content || ''
  const summary = post.summary || (content.length > 150 ? content.substring(0, 150) + '...' : content)
  
  // Handle tags
  const tags = Array.isArray(post.tags) ? post.tags.map(tag => tag.name || tag) : []
  
  return {
    id: post.id,
    title: post.title || 'Untitled',
    summary: summary,
    author: {
      name: authorName,
      avatar: owner.avatar || null
    },
    featuredImage: post.image || null,
    tags: tags,
    likes: post.likes_count || 0,
    comments: post.comments_count || 0,
    isLiked: post.is_liked || false,
    isBookmarked: post.is_saved || false,
    publishedAt: formatDate(post.created_at),
    content: content,
    status: post.status || 'DRAFT',
    created_at: post.created_at
  }
}

// Transform multiple posts
export function transformPosts(posts) {
  if (!Array.isArray(posts)) {
    console.warn('transformPosts received non-array:', posts)
    return []
  }
  return posts.map(transformPost).filter(Boolean)
}

// Get unique tags from posts
export function getUniqueTags(posts) {
  if (!Array.isArray(posts)) return []
  const allTags = posts.flatMap(post => post.tags || [])
  return [...new Set(allTags)].sort()
}

// Filter posts by search query
export function filterPostsBySearch(posts, searchQuery) {
  if (!searchQuery.trim()) return posts
  
  const query = searchQuery.toLowerCase()
  return posts.filter(post => 
    post.title.toLowerCase().includes(query) ||
    post.summary.toLowerCase().includes(query) ||
    post.author.name.toLowerCase().includes(query) ||
    post.tags.some(tag => tag.toLowerCase().includes(query))
  )
}

// Filter posts by tag
export function filterPostsByTag(posts, selectedTag) {
  if (!selectedTag || selectedTag === 'All') return posts
  return posts.filter(post => post.tags.includes(selectedTag))
}


// Simplified cn utility for environments without clsx/tailwind-merge
export function cn(...inputs) {
  return inputs
    .filter(Boolean)
    .map(input => {
      if (typeof input === 'string') return input;
      if (typeof input === 'object' && input !== null) {
        return Object.entries(input)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}