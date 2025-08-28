import { Link } from 'react-router-dom'
import { BookOpen, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white/30 dark:bg-white/5 border-t border-blog-gray/10 dark:border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-blog-green" />
              <span className="font-serif font-bold text-xl text-blog-gray">ThoughtThread</span>
            </Link>
            <p className="text-blog-gray/70 mb-4 max-w-md font-serif italic">
              "The art of writing is the art of discovering what you believe." — Gustave Flaubert
            </p>
            <p className="text-blog-gray/60 text-sm">
              A platform for thoughtful writing and meaningful conversations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-blog-gray mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blog-gray/70 hover:text-blog-green transition-colors">
                  Latest Posts
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-blog-gray/70 hover:text-blog-green transition-colors">
                  Write a Post
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-blog-gray/70 hover:text-blog-green transition-colors">
                  Your Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-blog-gray/70 hover:text-blog-green transition-colors">
                  Your Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-blog-gray mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-blog-gray/70 hover:text-blog-green transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-blog-gray/70 hover:text-blog-green transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-blog-gray/70 hover:text-blog-green transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-blog-gray/70 hover:text-blog-green transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blog-gray/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blog-gray/60 text-sm">
            © 2024 ThoughtThread. Made with <Heart className="inline h-4 w-4 text-blog-green" /> for writers.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-blog-gray/60 hover:text-blog-green transition-colors text-sm">
              Terms
            </a>
            <a href="#" className="text-blog-gray/60 hover:text-blog-green transition-colors text-sm">
              Privacy
            </a>
            <a href="#" className="text-blog-gray/60 hover:text-blog-green transition-colors text-sm">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
