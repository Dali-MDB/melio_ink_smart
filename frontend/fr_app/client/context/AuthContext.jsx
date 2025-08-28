import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiClient } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        const refreshToken = localStorage.getItem('refresh_token')
        
        if (accessToken && refreshToken) {
          // Try to get current user info
          try {
            const userData = await apiClient.getCurrentUser()
            setUser(userData)
          } catch (error) {
            // If access token is expired, try to refresh it
            if (error.message.includes('401') || error.message.includes('403')) {
              try {
                const { access_token } = await apiClient.refreshToken(refreshToken)
                localStorage.setItem('access_token', access_token)
                const userData = await apiClient.getCurrentUser()
                setUser(userData)
              } catch (refreshError) {
                // If refresh fails, clear tokens and user
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                setUser(null)
              }
            } else {
              // Other error, clear tokens
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
              setUser(null)
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signIn = async ({ email, password }) => {
    try {
      const { access_token, refresh_token } = await apiClient.login(email, password)
      
      // Store tokens
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      
      // Get user data
      const userData = await apiClient.getCurrentUser()
      setUser(userData)
      
      return userData
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  }

  const signUp = async ({ username, email, password, first_name, last_name, bio, location, website, birth_date, gender }) => {
    try {
      const userData = {
        username,
        email,
        password,
        first_name: first_name || '',
        last_name: last_name || '',
        bio: bio || '',
        location: location || '',
        website: website || '',
        birth_date: birth_date || null,
        gender: gender || ''
      }
      
      const { access_token, refresh_token } = await apiClient.register(userData)
      
      // Store tokens
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      
      // Get user data
      const user = await apiClient.getCurrentUser()
      setUser(user)
      
      return user
    } catch (error) {
      throw new Error(error.message || 'Registration failed')
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  const value = useMemo(() => ({ 
    user, 
    signIn, 
    signUp, 
    signOut, 
    loading 
  }), [user, loading])
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
