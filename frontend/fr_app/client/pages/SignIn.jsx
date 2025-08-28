import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const from = (location.state && location.state.from) || '/profile'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-3xl font-bold text-blog-gray mb-6">Sign in</h1>
        <form onSubmit={handleSubmit} className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-blog-gray/10 dark:border-white/10 rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
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
                disabled={loading}
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
                placeholder="••••••••"
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blog-green text-white py-2 rounded-lg hover:bg-blog-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-sm text-blog-gray/60">
            Don't have an account? <Link to="/signup" className="text-blog-green hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  )
}
