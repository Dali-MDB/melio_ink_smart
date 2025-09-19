import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Settings, Calendar, Heart, MessageCircle, BookOpen, Loader2, User, Camera, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'
import { apiClient, API_BASE_URL } from '../lib/api'
import { transformPost, formatDate } from '../lib/utils'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('posts')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [userPosts, setUserPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [userComments, setUserComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    age: '',
    phone: '',
    accept_notifications: true
  })
  const [saving, setSaving] = useState(false)
  const [uploadingPfp, setUploadingPfp] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [showPfpModal, setShowPfpModal] = useState(false)
  const fileInputRef = useRef(null)
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    avatar: null,
    first_name: '',
    last_name: '',
    age: '',
    phone: '',
    accept_notifications: true,
    stats: {
      posts: 0,
      likes: 0,
      followers: 0,
      following: 0
    }
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
  }, [user, navigate])

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        setError(null)
        
        // Fetch user profile
        const userData = await apiClient.getCurrentUser()
        console.log('User data:', userData)
        
        // Get user ID for fetching posts
        const userId = userData.id
        
        // Fetch full profile data
        try {
          const profileData = await apiClient.getCurrentUserProfile()
          console.log('Profile data:', profileData)
          
          setProfileData({
            name: profileData.first_name && profileData.last_name 
              ? `${profileData.first_name} ${profileData.last_name}` 
              : profileData.user?.username || 'User',
            username: profileData.user?.username || 'user',
            avatar: profileData.pfp
              ? (profileData.pfp.startsWith('http')
                  ? profileData.pfp
                  : `${API_BASE_URL}${profileData.pfp}`)
              : null,
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            age: profileData.age || '',
            phone: profileData.phone || '',
            accept_notifications: profileData.accept_notifications !== false,
            stats: {
              posts: 0, // Will be updated when we fetch posts
              likes: 0,
              followers: 0,
              following: 0
            }
          })
        } catch (profileError) {
          console.error('Failed to fetch profile:', profileError)
          // Fallback to basic user data
          setProfileData({
            name: userData.username || 'User',
            username: userData.username || 'user',
            avatar: null,
            first_name: '',
            last_name: '',
            age: '',
            phone: '',
            accept_notifications: true,
            stats: {
              posts: 0,
              likes: 0,
              followers: 0,
              following: 0
            }
          })
        }
        
        // Fetch user posts
        const postsData = await apiClient.getPosts({ author: userId })
        console.log('User posts:', postsData)
        
        let postsArray = postsData
        if (postsData && typeof postsData === 'object' && !Array.isArray(postsData)) {
          if (postsData.results) {
            postsArray = postsData.results
          } else if (postsData.data) {
            postsArray = postsData.data
          }
        }
        
        const transformedPosts = postsArray.map(post => transformPost(post))
        setUserPosts(transformedPosts)
        
        // Update stats with actual post count
        setProfileData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            posts: transformedPosts.length
          }
        }))
        
        // Fetch saved posts
        const savedData = await apiClient.getSavedPosts()
        console.log('Saved posts:', savedData)
        
        let savedArray = savedData
        if (savedData && typeof savedData === 'object' && !Array.isArray(savedData)) {
          if (savedData.results) {
            savedArray = savedData.results
          } else if (savedData.data) {
            savedArray = savedData.data
          }
        }
        
        const transformedSavedPosts = savedArray.map(post => transformPost(post))
        setSavedPosts(transformedSavedPosts)
        
        // Fetch user comments
        const commentsData = await apiClient.getUserComments()
        console.log('User comments:', commentsData)
        
        let commentsArray = commentsData
        if (commentsData && typeof commentsData === 'object' && !Array.isArray(commentsData)) {
          if (commentsData.results) {
            commentsArray = commentsData.results
          } else if (commentsData.data) {
            commentsArray = commentsData.data
          }
        }
        
        const transformedComments = commentsArray.map(comment => ({
          id: comment.id,
          content: comment.content,
          publishedAt: formatDate(comment.created_at),
          post_title: comment.post?.title || 'Unknown Post',
          post_id: comment.post?.id
        }))
        setUserComments(transformedComments)
        
      } catch (err) {
        console.error('Failed to fetch user data:', err)
        setError('Failed to load profile data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  // Handle edit profile form submission
  const handleEditProfile = async (e) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)
      
      const response = await apiClient.updateProfile(editForm)
      console.log('Profile updated:', response)
      
      // Update local state with new data
      setProfileData(prev => ({
        ...prev,
        name: response.first_name && response.last_name 
          ? `${response.first_name} ${response.last_name}` 
          : response.user?.username || 'User',
        first_name: response.first_name || '',
        last_name: response.last_name || '',
        age: response.age || '',
        phone: response.phone || '',
        accept_notifications: response.accept_notifications !== false
      }))
      
      setIsEditingProfile(false)
      
    } catch (err) {
      console.error('Failed to update profile:', err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Initialize edit form when opening modal
  const openEditModal = () => {
    setEditForm({
      first_name: profileData.name.split(' ')[0] || '',
      last_name: profileData.name.split(' ').slice(1).join(' ') || '',
      age: profileData.age || '',
      phone: profileData.phone || '',
      accept_notifications: profileData.accept_notifications !== false
    })
    setIsEditingProfile(true)
  }

  // Handle profile picture selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setShowPfpModal(true)
      setError(null)
    }
  }

  // Open profile picture modal
  const openPfpModal = () => {
    fileInputRef.current?.click()
  }

  // Handle profile picture upload
  const handleUploadPfp = async () => {
    if (!selectedFile) return
    
    try {
      setUploadingPfp(true)
      setError(null)
      
      console.log('Uploading profile picture:', selectedFile)
      const response = await apiClient.uploadProfilePicture(selectedFile)
      console.log('Profile picture uploaded:', response)
      
      // Update local state with new profile picture
      const newProfileData = await apiClient.getCurrentUserProfile()
      console.log('Updated profile data:', newProfileData)
      setProfileData(prev => ({
        ...prev,
        avatar: newProfileData.pfp
          ? (newProfileData.pfp.startsWith('http')
              ? newProfileData.pfp
              : `${API_BASE_URL}${newProfileData.pfp}`)
          : null
      }))
      
      // Close modal and clear selection
      setShowPfpModal(false)
      setSelectedFile(null)
      setPreviewUrl(null)
      
    } catch (err) {
      console.error('Failed to upload profile picture:', err)
      setError('Failed to upload profile picture. Please try again.')
    } finally {
      setUploadingPfp(false)
    }
  }

  // Handle profile picture removal
  const handleRemovePfp = async () => {
    try {
      setUploadingPfp(true)
      setError(null)
      
      await apiClient.removeProfilePicture()
      console.log('Profile picture removed')
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        avatar: null
      }))
      
    } catch (err) {
      console.error('Failed to remove profile picture:', err)
      setError('Failed to remove profile picture. Please try again.')
    } finally {
      setUploadingPfp(false)
    }
  }

  // Cancel profile picture selection
  const handleCancelPfp = () => {
    setShowPfpModal(false)
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const tabs = [
    { id: 'posts', label: 'Posts', count: profileData.stats.posts },
    { id: 'bookmarks', label: 'Bookmarks', count: savedPosts.length },
    { id: 'comments', label: 'Comments', count: userComments.length }
  ]

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blog-green" />
            <span className="text-blog-gray">Loading profile...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-blog-gray mb-4">
              {error}
            </h1>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blog-green text-white px-6 py-2 rounded-lg hover:bg-blog-green/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 mb-8 border border-blog-gray/10">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0 relative group">
              {profileData.avatar ? (
                <div className="relative">
                  <img 
                    src={profileData.avatar} 
                    alt={profileData.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-2">
                      <button
                        onClick={openPfpModal}
                        className="bg-blog-green text-white p-2 rounded-full hover:bg-blog-green/90 transition-colors"
                        title="Change photo"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleRemovePfp}
                        disabled={uploadingPfp}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                        title="Remove photo"
                      >
                        {uploadingPfp ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-blog-green/20 flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="w-12 h-12 md:w-16 md:h-16 text-blog-green" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={openPfpModal}
                      className="bg-blog-green text-white p-2 rounded-full hover:bg-blog-green/90 transition-colors"
                      title="Add photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-blog-gray mb-1">
                    {profileData.name}
                  </h1>
                  <p className="text-blog-gray/60 mb-2">@{profileData.username}</p>
                  <div className="flex items-center text-sm text-blog-gray/50 space-x-4">
                    {profileData.accept_notifications && (
                      <span>🔔 Notifications enabled</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4 sm:mt-0">
                  <button 
                    type="button"
                    onClick={openEditModal}
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

              {profileData.phone && (
                <p className="text-blog-gray/80 leading-relaxed mb-6 max-w-2xl">
                  📞 {profileData.phone}
                </p>
              )}

              {profileData.age && (
                <p className="text-blog-gray/80 leading-relaxed mb-6 max-w-2xl">
                  🎂 {profileData.age} years old
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-blog-gray/10">
            <div className="text-center">
              <div className="font-bold text-2xl text-blog-gray mb-1">{profileData.stats.posts}</div>
              <div className="text-blog-gray/60 text-sm">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-blog-gray mb-1">{profileData.stats.likes}</div>
              <div className="text-blog-gray/60 text-sm">Likes Received</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-blog-gray mb-1">{profileData.stats.followers}</div>
              <div className="text-blog-gray/60 text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-blog-gray mb-1">{profileData.stats.following}</div>
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
                <button 
                  type="button" 
                  onClick={() => navigate('/create-post')}
                  className="bg-blog-green text-white px-4 py-2 rounded-lg hover:bg-blog-green/90 transition-colors flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Write New Post</span>
                </button>
              </div>
              
              {userPosts.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-16 h-16 text-blog-gray/30 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-blog-gray mb-2">No Posts Yet</h3>
                  <p className="text-blog-gray/60 mb-6">Start sharing your thoughts with the world</p>
                  <button 
                    type="button"
                    onClick={() => navigate('/create-post')}
                    className="bg-blog-green text-white px-6 py-2 rounded-lg hover:bg-blog-green/90 transition-colors"
                  >
                    Write Your First Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPosts.map(post => (
                    <PostCard key={post.id} {...post} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div>
              <h2 className="font-serif text-xl font-bold text-blog-gray mb-6">Your Bookmarks</h2>
              
              {savedPosts.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-16 h-16 text-blog-gray/30 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-blog-gray mb-2">No Bookmarks Yet</h3>
                  <p className="text-blog-gray/60 mb-6">Posts you've saved will appear here</p>
                  <button 
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-blog-green hover:underline"
                  >
                    Browse posts to bookmark →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPosts.map(post => (
                    <PostCard key={post.id} {...post} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <h2 className="font-serif text-xl font-bold text-blog-gray mb-6">Your Comments</h2>
              
              {userComments.length === 0 ? (
                <div className="text-center py-16">
                  <MessageCircle className="w-16 h-16 text-blog-gray/30 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-blog-gray mb-2">No Comments Yet</h3>
                  <p className="text-blog-gray/60 mb-6">Comments you've made on posts will appear here</p>
                  <button 
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-blog-green hover:underline"
                  >
                    Join the conversation →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userComments.map(comment => (
                    <div key={comment.id} className="bg-white/40 rounded-lg p-4">
                      <p className="text-blog-gray/80 mb-2">{comment.content}</p>
                      <div className="flex items-center justify-between text-sm text-blog-gray/60">
                        <span>On: {comment.post_title}</span>
                        <span>{comment.publishedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-blog-ivory rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif text-xl font-bold text-blog-gray mb-4">Edit Profile</h3>
              
              <form id="edit-profile-form" onSubmit={handleEditProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blog-gray mb-2">First Name</label>
                  <input 
                    type="text" 
                    value={editForm.first_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full p-3 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blog-gray mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={editForm.last_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full p-3 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blog-gray mb-2">Age</label>
                  <input 
                    type="number" 
                    value={editForm.age}
                    onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full p-3 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blog-gray mb-2">Phone</label>
                  <input 
                    type="tel" 
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-3 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    id="accept_notifications"
                    checked={editForm.accept_notifications}
                    onChange={(e) => setEditForm(prev => ({ ...prev, accept_notifications: e.target.checked }))}
                    className="w-4 h-4 text-blog-green bg-gray-100 border-gray-300 rounded focus:ring-blog-green focus:ring-2"
                  />
                  <label htmlFor="accept_notifications" className="text-sm font-medium text-blog-gray">
                    Accept notifications
                  </label>
                </div>
              </form>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  type="submit"
                  form="edit-profile-form"
                  disabled={saving}
                  className="flex-1 bg-blog-green text-white py-2 rounded-lg hover:bg-blog-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  disabled={saving}
                  className="flex-1 border border-blog-gray/20 py-2 rounded-lg hover:bg-blog-gray/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Profile Picture Upload Modal */}
      {showPfpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Upload Profile Picture</h3>
            
            {previewUrl && (
              <div className="mb-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blog-gray/20"
                />
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={handleUploadPfp}
                disabled={uploadingPfp || !selectedFile}
                className="flex-1 bg-blog-green text-white py-2 px-4 rounded-lg hover:bg-blog-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploadingPfp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  'Upload Picture'
                )}
              </button>
              
              <button
                onClick={handleCancelPfp}
                disabled={uploadingPfp}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
