import { useState } from 'react'
import { Bookmark, Search, Filter, SortDesc } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'

const BOOKMARKED_POSTS = [
  {
    id: '1',
    title: 'The Art of Mindful Writing: Finding Your Voice in a Noisy World',
    summary: 'In our fast-paced digital age, the practice of mindful writing offers a sanctuary for authentic expression. This post explores techniques for cultivating presence and authenticity in your writing practice.',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop',
    tags: ['Writing', 'Mindfulness', 'Creativity'],
    likes: 42,
    comments: 8,
    publishedAt: '2 days ago',
    isLiked: false,
    isBookmarked: true,
    bookmarkedAt: '1 day ago'
  },
  {
    id: '4',
    title: 'Rediscovering Wonder: A Walk Through Tokyo\'s Hidden Gardens',
    summary: 'Sometimes the most profound experiences happen in the quietest places. Join me on a journey through Tokyo\'s secret gardens and the unexpected lessons they teach about slowing down.',
    author: {
      name: 'Kenji Tanaka',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    featuredImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop',
    tags: ['Travel', 'Nature', 'Photography'],
    likes: 134,
    comments: 31,
    publishedAt: '5 days ago',
    isLiked: true,
    isBookmarked: true,
    bookmarkedAt: '3 days ago'
  },
  {
    id: '6',
    title: 'From Burnout to Balance: Lessons from a Reformed Workaholic',
    summary: 'My journey from 80-hour weeks to finding sustainable success. The tools, mindset shifts, and daily practices that helped me reclaim my life without sacrificing my ambitions.',
    author: {
      name: 'David Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
    },
    tags: ['Work-Life Balance', 'Mental Health', 'Productivity'],
    likes: 203,
    comments: 45,
    publishedAt: '4 days ago',
    isLiked: true,
    isBookmarked: true,
    bookmarkedAt: '2 days ago'
  },
  {
    id: '9',
    title: 'The Power of Vulnerability in Leadership',
    summary: 'After years of trying to be the "perfect" leader, I learned that showing vulnerability actually makes you stronger. Here\'s how authentic leadership transformed my team and company culture.',
    author: {
      name: 'Dr. Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=40&h=40&fit=crop&crop=face'
    },
    tags: ['Leadership', 'Vulnerability', 'Management'],
    likes: 89,
    comments: 27,
    publishedAt: '1 week ago',
    isLiked: false,
    isBookmarked: true,
    bookmarkedAt: '5 days ago'
  },
  {
    id: '10',
    title: 'Digital Minimalism: Reclaiming Your Attention in the Age of Distraction',
    summary: 'In a world designed to steal our focus, practicing digital minimalism isn\'t just helpful—it\'s essential. My 30-day experiment with intentional technology use and what I learned.',
    author: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    tags: ['Digital Wellness', 'Productivity', 'Mindfulness'],
    likes: 156,
    comments: 38,
    publishedAt: '1 week ago',
    isLiked: true,
    isBookmarked: true,
    bookmarkedAt: '1 week ago'
  },
  {
    id: '11',
    title: 'The Science of Habit Formation: Why Willpower Isn\'t Enough',
    summary: 'Research shows that willpower is overrated when it comes to building lasting habits. Here\'s what actually works, backed by neuroscience and behavioral psychology.',
    author: {
      name: 'Morgan Kim',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    },
    tags: ['Psychology', 'Habits', 'Science'],
    likes: 267,
    comments: 52,
    publishedAt: '2 weeks ago',
    isLiked: false,
    isBookmarked: true,
    bookmarkedAt: '1 week ago'
  }
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Bookmarked' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'title', label: 'Title A-Z' }
]

export default function Bookmarks() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('All')
  const [sortBy, setSortBy] = useState('recent')
  const [posts] = useState(BOOKMARKED_POSTS)

  const allTags = ['All', ...Array.from(new Set(posts.flatMap(post => post.tags)))]

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag)
      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.bookmarkedAt || b.publishedAt).getTime() - new Date(a.bookmarkedAt || a.publishedAt).getTime()
        case 'oldest':
          return new Date(a.bookmarkedAt || a.publishedAt).getTime() - new Date(b.bookmarkedAt || b.publishedAt).getTime()
        case 'popular':
          return b.likes - a.likes
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blog-sage/20 rounded-full flex items-center justify-center">
              <Bookmark className="w-8 h-8 text-blog-sage fill-current" />
            </div>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-blog-gray mb-4">
            Your Bookmarks
          </h1>
          <p className="text-xl text-blog-gray/70 max-w-2xl mx-auto">
            All the stories you've saved for later reading. Your personal collection of insights and inspiration.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-8 border border-blog-gray/10">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blog-gray/50" />
                <input
                  type="text"
                  placeholder="Search your bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50 focus:border-blog-green"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SortDesc className="w-4 h-4 text-blog-gray/60" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/50 border border-blog-gray/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tag Filter */}
          <div className="mt-4 pt-4 border-t border-blog-gray/10">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-blog-gray/60" />
              <span className="text-sm text-blog-gray/60">Filter by tag:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTag === tag
                      ? 'bg-blog-green text-white'
                      : 'bg-white/60 text-blog-gray hover:bg-blog-green/10 hover:text-blog-green border border-blog-gray/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold text-blog-gray">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'bookmark' : 'bookmarks'}
            {selectedTag !== 'All' && ` in ${selectedTag}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </h2>
          
          {posts.length > 0 && (
            <div className="text-sm text-blog-gray/60">
              Total saved: {posts.length} posts
            </div>
          )}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {filteredPosts.map(post => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          /* Empty State - No Bookmarks */
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 text-blog-gray/30 mx-auto mb-6" />
            <h3 className="font-serif text-2xl font-bold text-blog-gray mb-4">No bookmarks yet</h3>
            <p className="text-blog-gray/60 text-lg mb-8 max-w-md mx-auto">
              Start saving posts that inspire you. Click the bookmark icon on any post to add it to your collection.
            </p>
            <button className="bg-blog-green text-white px-6 py-3 rounded-lg hover:bg-blog-green/90 transition-colors">
              Explore Posts
            </button>
          </div>
        ) : (
          /* No Results for Search/Filter */
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-blog-gray/30 mx-auto mb-6" />
            <h3 className="font-serif text-2xl font-bold text-blog-gray mb-4">No results found</h3>
            <p className="text-blog-gray/60 text-lg mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `No bookmarks match "${searchQuery}". Try a different search term.`
                : `No bookmarks found in ${selectedTag}. Try selecting a different tag.`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-blog-green hover:underline"
                >
                  Clear search
                </button>
              )}
              {selectedTag !== 'All' && (
                <button 
                  onClick={() => setSelectedTag('All')}
                  className="text-blog-green hover:underline"
                >
                  Show all bookmarks
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tips */}
        {posts.length > 0 && (
          <div className="bg-blog-green/5 border border-blog-green/20 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-blog-gray mb-2">💡 Tip</h3>
            <p className="text-blog-gray/70">
              Use bookmarks to create your personal reading list. You can search through them and filter by topic to find exactly what you're looking for.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
