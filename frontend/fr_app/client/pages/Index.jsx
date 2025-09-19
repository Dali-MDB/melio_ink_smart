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

  // Transform posts data to a consistent format
  const transformPosts = (postsData) => {
    if (!postsData) return [];
    
    // Handle different response structures
    let postsArray = Array.isArray(postsData) ? postsData : [];
    
    if (postsData && typeof postsData === 'object' && !Array.isArray(postsData)) {
      if (postsData.results) {
        postsArray = postsData.results;
      } else if (postsData.data) {
        postsArray = postsData.data;
      } else if (postsData.posts) {
        postsArray = postsData.posts;
      } else {
        postsArray = Object.values(postsData);
      }
    }
    
    return postsArray.map(post => ({
      id: post.id || post._id,
      title: post.title || 'Untitled',
      summary: post.summary || post.excerpt || '',
      content: post.content || post.body || '',
      author: {
        id: post.owner?.id || post.author?.id || post.author_id || null,
        name: post.owner?.name || 
              (post.owner?.first_name && post.owner?.last_name 
                ? `${post.owner.first_name} ${post.owner.last_name}` 
                : post.owner?.username || 'Anonymous'),
        avatar: post.owner?.avatar || null
      },
      featuredImage: post.featured_image || post.image || post.thumbnail || null,
      tags: post.tags || post.categories || [],
      likes: post.likes_count || post.likes?.length || 0,
      comments: post.comments_count || post.comments?.length || 0,
      isLiked: post.is_liked || false,
      isBookmarked: post.is_saved || false,
      status: post.status || 'PUBLISHED',
      createdAt: post.created_at || post.date_created || new Date().toISOString(),
      updatedAt: post.updated_at || post.date_updated || new Date().toISOString()
    }));
  };

  // Extract unique tags from posts
  const getUniqueTags = (posts) => {
    if (!Array.isArray(posts)) return [];
    
    const tagSet = new Set();
    
    posts.forEach(post => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            tagSet.add(tag.trim());
          } else if (tag && typeof tag === 'object' && tag.name) {
            tagSet.add(tag.name.trim());
          }
        });
      }
    });
    
    return Array.from(tagSet).filter(Boolean);
  };

  // Fetch posts from backend
  const fetchPosts = async (search = '', tag = 'All') => {
    try {
      setSearchLoading(true);
      setError(null);
      
      const params = {};
      
      // Add search parameter
      if (search.trim()) {
        params.search = search.trim();
      }
      
      // Add tag parameter
      if (tag && tag !== 'All') {
        params.tags = tag;
      }
      
      // Add pagination parameters
      params.page_size = 10; // Limit number of posts per page
      
      // Make the API request
      const response = await apiClient.getPosts(params);
      
      // Transform the response data
      const transformedPosts = transformPosts(response);
      
      // Filter to only show published posts
      const publishedPosts = transformedPosts.filter(post => 
        !post.status || post.status === 'PUBLISHED' || post.status === 'DRAFT'
      );
      
      setPosts(publishedPosts);
      
      // Extract unique tags (only on initial load)
      if (!search && tag === 'All') {
        const tags = getUniqueTags(publishedPosts);
        setAllTags(['All', ...tags]);
      }
      
      return publishedPosts;
      
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError(err.message || 'Failed to load posts. Please try again later.');
      setPosts([]); // Clear posts on error
      return [];
    } finally {
      setSearchLoading(false);
      setLoading(false);
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
