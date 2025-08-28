import { useState } from 'react'
import { Edit, Settings, Calendar, Heart, MessageCircle, BookOpen } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'

const USER_PROFILE = {
  name: 'Sarah Chen',
  username: 'sarahwrites',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face',
  bio: 'Writer, mindfulness teacher, and advocate for authentic expression. Author of "The Quiet Revolution." Passionate about helping others find their voice through mindful writing practices.',
  location: 'San Francisco, CA',
  joinedDate: 'March 2023',
  website: 'www.sarahchen.com',
  stats: {
    posts: 24,
    likes: 1283,
    followers: 456,
    following: 123
  }
}

const USER_POSTS = [
  {
    id: '1',
    title: 'The Art of Mindful Writing: Finding Your Voice in a Noisy World',
    summary: 'In our fast-paced digital age, the practice of mindful writing offers a sanctuary for authentic expression. This post explores techniques for cultivating presence and authenticity in your writing practice.',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    tags: ['Writing', 'Mindfulness', 'Creativity'],
    likes: 42,
    comments: 8,
    publishedAt: '2 days ago',
    isLiked: false,
    isBookmarked: true
  },
  {
    id: '7',
    title: 'Morning Pages: The Simple Practice That Changed My Life',
    summary: 'Three pages of longhand writing every morning, about anything and everything. This simple practice, popularized by Julia Cameron, has been my anchor for over two years.',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    tags: ['Writing', 'Habits', 'Morning Routine'],
    likes: 78,
    comments: 15,
    publishedAt: '1 week ago',
    isLiked: true,
    isBookmarked: false
  },
  {
    id: '8',
    title: 'The Beauty of Imperfect First Drafts',
    summary: 'Why your first draft doesn\'t need to be perfect, and how embracing the mess can lead to breakthrough moments in your writing journey.',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    tags: ['Writing', 'Process', 'Creativity'],
    likes: 95,
    comments: 22,
    publishedAt: '2 weeks ago',
    isLiked: false,
    isBookmarked: true
  }
]

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts')
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const tabs = [
    { id: 'posts', label: 'Posts', count: USER_PROFILE.stats.posts },
    { id: 'bookmarks', label: 'Bookmarks', count: 12 },
    { id: 'comments', label: 'Comments', count: 34 }
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 mb-8 border border-blog-gray/10">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img 
                src={USER_PROFILE.avatar} 
                alt={USER_PROFILE.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-blog-gray mb-1">
                    {USER_PROFILE.name}
                  </h1>
                  <p className="text-blog-gray/60 mb-2">@{USER_PROFILE.username}</p>
                  <div className="flex items-center text-sm text-blog-gray/50 space-x-4">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {USER_PROFILE.joinedDate}</span>
                    </span>
                    {USER_PROFILE.location && (
                      <span>{USER_PROFILE.location}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4 sm:mt-0">
                  <button 
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center space-x-2 bg-blog-green text-white px-4 py-2 rounded-lg hover:bg-blog-green/90 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button type="button" className="p-2 border border-blog-gray/20 rounded-lg hover:bg-blog-gray/5 transition-colors">
                    <Settings className="w-4 h-4 text-blog-gray" />
                  </button>
                </div>
              </div>

              <p className="text-blog-gray/80 leading-relaxed mb-6 max-w-2xl">
                {USER_PROFILE.bio}
              </p>

              {USER_PROFILE.website && (
                <a 
                  href={`https://${USER_PROFILE.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blog-green hover:underline"
                >
                  {USER_PROFILE.website}
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-blog-gray/10">
            <div className="text-center">
              <div className="font-bold text-2xl text-blog-gray mb-1">{USER_PROFILE.stats.posts}</div>
              <div className="text-blog-gray/60 text-sm">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-blog-gray mb-1">{USER_PROFILE.stats.likes}</div>
              <div className="text-blog-gray/60 text-sm">Likes Received</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-blog-gray mb-1">{USER_PROFILE.stats.followers}</div>
              <div className="text-blog-gray/60 text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-blog-gray mb-1">{USER_PROFILE.stats.following}</div>
              <div className="text-blog-gray/60 text-sm">Following</div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/40 p-1 rounded-lg border border-blog-gray/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blog-green text-white shadow-sm'
                    : 'text-blog-gray/70 hover:text-blog-gray hover:bg-white/50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeTab === tab.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blog-gray/10 text-blog-gray/60'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'posts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold text-blog-gray">My Posts</h2>
                <button type="button" className="bg-blog-green text-white px-4 py-2 rounded-lg hover:bg-blog-green/90 transition-colors flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Write New Post</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {USER_POSTS.map(post => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-blog-gray/30 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-blog-gray mb-2">Your Bookmarks</h3>
              <p className="text-blog-gray/60 mb-6">Posts you've saved will appear here</p>
              <button type="button" className="text-blog-green hover:underline">Browse posts to bookmark →</button>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-blog-gray/30 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-blog-gray mb-2">Your Comments</h3>
              <p className="text-blog-gray/60 mb-6">Comments you've made on posts will appear here</p>
              <button type="button" className="text-blog-green hover:underline">Join the conversation →</button>
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-blog-ivory rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif text-xl font-bold text-blog-gray mb-4">Edit Profile</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blog-gray mb-2">Name</label>
                  <input 
                    type="text" 
                    defaultValue={USER_PROFILE.name}
                    className="w-full p-3 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blog-gray mb-2">Username</label>
                  <input 
                    type="text" 
                    defaultValue={USER_PROFILE.username}
                    className="w-full p-3 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blog-gray mb-2">Bio</label>
                  <textarea 
                    defaultValue={USER_PROFILE.bio}
                    rows={4}
                    className="w-full p-3 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blog-gray mb-2">Website</label>
                  <input 
                    type="text" 
                    defaultValue={USER_PROFILE.website}
                    className="w-full p-3 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blog-gray mb-2">Location</label>
                  <input 
                    type="text" 
                    defaultValue={USER_PROFILE.location}
                    className="w-full p-3 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                  />
                </div>
              </form>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 bg-blog-green text-white py-2 rounded-lg hover:bg-blog-green/90 transition-colors"
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 border border-blog-gray/20 py-2 rounded-lg hover:bg-blog-gray/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
