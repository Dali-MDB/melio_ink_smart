import { useState } from 'react'
import { PenTool, Star, TrendingUp, Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'

const SAMPLE_POSTS = [
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
    isBookmarked: true
  },
  {
    id: '2',
    title: 'Building Sustainable Habits: A Developer\'s Journey to Work-Life Balance',
    summary: 'After burning out three times in five years, I finally learned how to build sustainable coding habits. Here\'s what worked, what didn\'t, and the surprising insights along the way.',
    author: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    tags: ['Productivity', 'Mental Health', 'Career'],
    likes: 89,
    comments: 15,
    publishedAt: '1 week ago',
    isLiked: true,
    isBookmarked: false
  },
  {
    id: '3',
    title: 'The Philosophy of Code: What Programming Taught Me About Life',
    summary: 'Ten years of coding has taught me more about problem-solving, patience, and persistence than any philosophy book. A reflection on the unexpected life lessons hidden in our daily work.',
    author: {
      name: 'Morgan Kim',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    },
    featuredImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
    tags: ['Philosophy', 'Programming', 'Reflection'],
    likes: 67,
    comments: 23,
    publishedAt: '3 days ago',
    isLiked: false,
    isBookmarked: false
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
    isBookmarked: true
  },
  {
    id: '5',
    title: 'The Science of Creativity: How Constraints Fuel Innovation',
    summary: 'Counterintuitively, limitations often spark our most creative solutions. Exploring the psychology and neuroscience behind why constraints can be creativity\'s best friend.',
    author: {
      name: 'Dr. Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=40&h=40&fit=crop&crop=face'
    },
    featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    tags: ['Science', 'Creativity', 'Psychology'],
    likes: 76,
    comments: 12,
    publishedAt: '1 week ago',
    isLiked: false,
    isBookmarked: false
  },
  {
    id: '6',
    title: 'From Burnout to Balance: Lessons from a Reformed Workaholic',
    summary: 'My journey from 80-hour weeks to finding sustainable success. The tools, mindset shifts, and daily practices that helped me reclaim my life without sacrificing my ambitions.',
    author: {
      name: 'David Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
    },
    featuredImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
    tags: ['Work-Life Balance', 'Mental Health', 'Productivity'],
    likes: 203,
    comments: 45,
    publishedAt: '4 days ago',
    isLiked: true,
    isBookmarked: true
  }
]

const ALL_TAGS = ['All', 'Writing', 'Programming', 'Travel', 'Science', 'Philosophy', 'Mental Health', 'Productivity', 'Creativity']

export default function Index() {
  const [selectedTag, setSelectedTag] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [posts] = useState(SAMPLE_POSTS)

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag)
      return matchesSearch && matchesTag
    })

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-blog-gray mb-6">
              Welcome to{' '}
              <span className="text-blog-green">ThoughtThread</span>
            </h1>
            <p className="text-xl md:text-2xl text-blog-gray/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Where thoughtful minds gather to share stories, insights, and ideas that matter. 
              Join a community of writers and readers who believe in the power of authentic expression.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-blog-green text-white px-8 py-3 rounded-lg hover:bg-blog-green/90 transition-colors flex items-center space-x-2">
                <PenTool className="w-5 h-5" />
                <span>Start Writing</span>
              </button>
              <button className="border border-blog-green text-blog-green px-8 py-3 rounded-lg hover:bg-blog-green/5 transition-colors">
                Explore Stories
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-8 text-blog-green/20 hidden lg:block">
          <Star className="w-8 h-8" />
        </div>
        <div className="absolute top-1/3 right-12 text-blog-sage/30 hidden lg:block">
          <TrendingUp className="w-6 h-6" />
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blog-gray/10">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blog-gray/50" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50 focus:border-blog-green"
            />
          </div>
        </div>
      </section>

      {/* Tag Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-blog-green text-white'
                  : 'bg-white/60 text-blog-gray hover:bg-blog-green/10 hover:text-blog-green'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-blog-gray">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : selectedTag === 'All'
                ? 'Latest Stories'
                : `Stories about ${selectedTag}`
            }
          </h2>
          <p className="text-blog-gray/60">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-blog-gray/60 text-lg mb-4">
              {searchQuery
                ? `No stories found matching "${searchQuery}".`
                : `No stories found for ${selectedTag}.`
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
                  View all stories
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
