import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, Eye, EyeOff, Globe, MapPin, Calendar, UserCheck } from 'lucide-react'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    website: '',
    birth_date: '',
    gender: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(formData)
      navigate('/profile', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-3xl font-bold text-blog-gray mb-6">Create your account</h1>
        <form onSubmit={handleSubmit} className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-blog-gray/10 dark:border-white/10 rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-blog-gray mb-2">Username *</label>
            <div className="relative">
              <User className="w-4 h-4 text-blog-gray/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                placeholder="Choose a username"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blog-gray mb-2">Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-blog-gray/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blog-gray mb-2">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-blog-gray/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                placeholder="Create a password"
                disabled={loading}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blog-gray/60 hover:text-blog-gray"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blog-gray mb-2">First Name</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-blog-gray/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                  placeholder="First name"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blog-gray mb-2">Last Name</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-blog-gray/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                  placeholder="Last name"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blog-gray mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
              placeholder="Tell us about yourself..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blog-gray mb-2">Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-blog-gray/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                placeholder="Your location"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blog-gray mb-2">Website</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-blog-gray/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                placeholder="https://yourwebsite.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blog-gray mb-2">Birth Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-blog-gray/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blog-gray mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                disabled={loading}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blog-green text-white py-2 rounded-lg hover:bg-blog-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          <p className="text-sm text-blog-gray/60">
            Already have an account? <Link to="/login" className="text-blog-green hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  )
}
