import { Link } from 'react-router-dom'
import { BookOpen, User, Menu, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldDark = stored ? stored === 'dark' : prefersDark
    setIsDark(shouldDark)
    document.documentElement.classList.toggle('dark', shouldDark)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <nav className="sticky top-0 z-50 bg-blog-ivory/95 dark:bg-[#0e140f]/90 backdrop-blur-sm border-b border-blog-gray/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blog-green" />
            <span className="font-serif font-bold text-xl text-blog-gray">ThoughtThread</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-blog-gray hover:text-blog-green transition-colors">
              Home
            </Link>
            <Link to="/create" className="text-blog-gray hover:text-blog-green transition-colors">
              Write
            </Link>
            <Link to="/bookmarks" className="text-blog-gray hover:text-blog-green transition-colors">
              Bookmarks
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-blog-gray/10 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-blog-gray/10 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button 
              className="p-2 text-blog-gray hover:text-blog-green transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blog-gray/10 dark:border-white/10 mt-2 pt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-blog-gray hover:text-blog-green transition-colors">
                Home
              </Link>
              <Link to="/create" className="text-blog-gray hover:text-blog-green transition-colors">
                Write
              </Link>
              <Link to="/bookmarks" className="text-blog-gray hover:text-blog-green transition-colors">
                Bookmarks
              </Link>
              <Link to="/profile" className="text-blog-gray hover:text-blog-green transition-colors">
                Profile
              </Link>
              <div className="pt-4 border-t border-blog-gray/10 dark:border-white/10">
                <MobileAuthArea />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function MobileAuthArea() {
  const { user, signOut } = useAuth()
  if (user) {
    return (
      <div className="flex gap-2">
        <Link to="/profile" className="flex-1 border border-blog-gray/20 text-blog-gray px-4 py-2 rounded-lg hover:bg-white/50 transition-colors text-center">Profile</Link>
        <button onClick={signOut} className="flex-1 bg-blog-green text-white px-4 py-2 rounded-lg hover:bg-blog-green/90 transition-colors">Sign Out</button>
      </div>
    )
  }
  return (
    <Link to="/login" className="w-full inline-block text-center bg-blog-green text-white px-4 py-2 rounded-lg hover:bg-blog-green/90 transition-colors">
      Sign In
    </Link>
  )
}

function AuthButtons() {
  const { user, signOut } = useAuth()
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/profile"
          className="p-2 text-blog-gray hover:text-blog-green transition-colors"
        >
          <User className="h-5 w-5" />
        </Link>
        <button
          onClick={signOut}
          className="border border-blog-green text-blog-green px-4 py-2 rounded-lg hover:bg-blog-green/5 transition-colors"
        >
          Sign Out
        </button>
      </div>
    )
  }
  return (
    <Link to="/login" className="bg-blog-green text-white px-4 py-2 rounded-lg hover:bg-blog-green/90 transition-colors">
      Sign In
    </Link>
  )
}
