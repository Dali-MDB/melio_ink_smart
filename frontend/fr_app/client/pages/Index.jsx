import { useState, useEffect, useCallback } from 'react'
import { PenTool, Star, TrendingUp, Search, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'
import { apiClient } from '../lib/api'
import { transformPosts, getUniqueTags } from '../lib/utils'

export default function Index() {
  const [selectedTag, setSelectedTag] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState([])
  const [allTags, setAllTags] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState(null)

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId
      return (query) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          fetchPosts(query, selectedTag)
        }, 300)
      }
    })(),
    [selectedTag]
  )

  // Fetch posts from backend
  const fetchPosts = async (search = '', tag = 'All') => {
    try {
      console.log('Starting fetchPosts with:', { search, tag })
      setSearchLoading(true)
      setError(null)
      
      const params = {}
      
      // Add search parameter
      if (search.trim()) {
        params.search = search.trim()
      }
      
      // Add tag parameter
      if (tag && tag !== 'All') {
        params.tags = tag
      }
      
      console.log('Calling apiClient.getPosts with params:', params)
      const postsData = await apiClient.getPosts(params)
      console.log('Received postsData:', postsData)
      
      // Handle different response structures
      let postsArray = postsData
      if (postsData && typeof postsData === 'object' && !Array.isArray(postsData)) {
        // If it's an object, check for common pagination fields
        if (postsData.results) {
          postsArray = postsData.results
        } else if (postsData.data) {
          postsArray = postsData.data
        } else if (postsData.posts) {
          postsArray = postsData.posts
        } else {
          // If it's not an array, try to convert it
          postsArray = Object.values(postsData)
        }
      }
      
      console.log('Posts array after processing:', postsArray)
      
      const transformedPosts = transformPosts(postsArray)
      console.log('Transformed posts:', transformedPosts)
      
      // Filter to only show published posts
      const publishedPosts = transformedPosts.filter(post => {
        // Show posts that are either PUBLISHED or don't have a status (for backward compatibility)
        return !post.status || post.status === 'PUBLISHED' || post.status === 'DRAFT'
      })
      console.log('Published posts:', publishedPosts)
      
      setPosts(publishedPosts)
      
      // Extract unique tags (only on initial load)
      if (!search && tag === 'All') {
        const tags = getUniqueTags(publishedPosts)
        console.log('Unique tags:', tags)
        setAllTags(['All', ...tags])
      }
      
    } catch (err) {
      console.error('Failed to fetch posts:', err)
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
      setError('Failed to load posts. Please try again later.')
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    console.log('Initial load effect triggered')
    fetchPosts()
  }, [])

  // Handle search changes
  useEffect(() => {
    console.log('Search effect triggered with query:', searchQuery)
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  // Handle tag changes
  useEffect(() => {
    console.log('Tag effect triggered with tag:', selectedTag)
    if (!loading) {
      fetchPosts(searchQuery, selectedTag)
    }
  }, [selectedTag])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleTagSelect = (tag) => {
    setSelectedTag(tag)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const viewAllStories = () => {
    setSelectedTag('All')
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blog-green" />
            <span className="text-blog-gray">Loading stories...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

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
              <Link to="/create" className="bg-blog-green text-white px-8 py-3 rounded-lg hover:bg-blog-green/90 transition-colors flex items-center space-x-2">
                <PenTool className="w-5 h-5" />
                <span>Start Writing</span>
              </Link>
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

      {/* Error Message */}
      {error && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blog-gray/10">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blog-gray/50" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50 focus:border-blog-green"
            />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blog-gray/50 animate-spin" />
            )}
          </div>
        </div>
      </section>

      {/* Tag Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
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
          <div className="flex items-center space-x-2">
            {searchLoading && <Loader2 className="w-4 h-4 animate-spin text-blog-green" />}
          <p className="text-blog-gray/60">
              {posts.length} {posts.length === 1 ? 'story' : 'stories'}
          </p>
          </div>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {posts.map(post => {
              console.log('Rendering PostCard with post data:', post)
              return <PostCard key={post.id} {...post} />
            })}
          </div>
        ) : (
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
                  onClick={clearSearch}
                  className="text-blog-green hover:underline"
                >
                  Clear search
                </button>
              )}
              {selectedTag !== 'All' && (
                <button
                  onClick={viewAllStories}
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
