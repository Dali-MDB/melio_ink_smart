import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp({ name, email, password })
      navigate('/profile', { replace: true })
    } catch (err) {
      setError('Failed to sign up. Please try again.')
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
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-blog-gray mb-2">Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-blog-gray/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white/50 dark:bg:white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                placeholder="Your name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blog-gray mb-2">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-blog-gray/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blog-gray mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-blog-gray/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-white/50 dark:bg-white/10 border border-blog-gray/20 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                placeholder="Create a password"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blog-gray/60 hover:text-blog-gray"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blog-green text-white py-2 rounded-lg hover:bg-blog-green/90 transition-colors disabled:opacity-50">
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
