import './global.css'

import { Toaster } from '@/components/ui/toaster'
import { createRoot } from 'react-dom/client'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import PostDetail from './pages/PostDetail'
import Profile from './pages/Profile'
import Bookmarks from './pages/Bookmarks'
import CreatePost from './pages/CreatePost'
import PlaceholderPage from './pages/PlaceholderPage'
import NotFound from './pages/NotFound'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { AuthProvider } from './context/AuthContext'

const queryClient = new QueryClient()

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<PlaceholderPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/admin" element={<PlaceholderPage />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<PlaceholderPage />} />
            <Route path="/guidelines" element={<PlaceholderPage />} />
            <Route path="/contact" element={<PlaceholderPage />} />
            <Route path="/privacy" element={<PlaceholderPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
)

const rootEl = document.getElementById('root')
if (rootEl) {
  createRoot(rootEl).render(<App />)
}
