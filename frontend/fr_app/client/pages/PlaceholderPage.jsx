import { useLocation } from 'react-router-dom'
import { Construction, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PlaceholderPage() {
  const location = useLocation()
  const pageName = location.pathname.slice(1) || 'page'
  
  const getPageTitle = (path) => {
    const titles = {
      'create': 'Create Post',
      'edit': 'Edit Post',
      'profile': 'User Profile',
      'bookmarks': 'Your Bookmarks',
      'admin': 'Admin Dashboard',
      'login': 'Login & Register',
      'about': 'About Us',
      'guidelines': 'Community Guidelines',
      'contact': 'Contact',
      'privacy': 'Privacy Policy'
    }
    return titles[path] || 'Page'
  }

  const getPageDescription = (path) => {
    const descriptions = {
      'create': 'Share your thoughts and stories with the ThoughtThread community.',
      'edit': 'Make changes to your existing posts and keep your content fresh.',
      'profile': 'Manage your account, view your posts, and customize your experience.',
      'bookmarks': 'Access all the posts you\'ve saved for later reading.',
      'admin': 'Manage users, posts, and platform settings.',
      'login': 'Sign in to your account or create a new one to join our community.',
      'about': 'Learn about our mission to create a thoughtful writing community.',
      'guidelines': 'Understand our community standards and best practices.',
      'contact': 'Get in touch with our team for support or feedback.',
      'privacy': 'Read about how we protect and handle your personal information.'
    }
    return descriptions[path] || 'This page is currently under development.'
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-blog-green/10 rounded-full flex items-center justify-center">
              <Construction className="w-12 h-12 text-blog-green" />
            </div>
          </div>

          {/* Content */}
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-blog-gray mb-4">
            {getPageTitle(pageName)}
          </h1>
          
          <p className="text-xl text-blog-gray/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            {getPageDescription(pageName)}
          </p>

          <div className="bg-blog-sage/10 border border-blog-sage/20 rounded-lg p-6 mb-8 max-w-lg mx-auto">
            <p className="text-blog-gray/80 mb-4">
              This page is coming soon! We're working hard to bring you the best possible experience.
            </p>
            <p className="text-sm text-blog-gray/60">
              Want to help us prioritize development? Let us know what features matter most to you.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/"
              className="flex items-center space-x-2 bg-blog-green text-white px-6 py-3 rounded-lg hover:bg-blog-green/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            
            <button className="border border-blog-green text-blog-green px-6 py-3 rounded-lg hover:bg-blog-green/5 transition-colors">
              Request Feature
            </button>
          </div>

          {/* Suggestion */}
          <div className="mt-12 pt-8 border-t border-blog-gray/10">
            <p className="text-blog-gray/60 mb-4">
              While you're here, why not explore some of our featured content?
            </p>
            <Link 
              to="/"
              className="text-blog-green hover:underline font-medium"
            >
              Discover amazing stories on our homepage →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
