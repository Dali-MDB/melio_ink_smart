import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth_user')
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  const signIn = async ({ email }) => {
    const fakeUser = { id: 'u_1', name: email.split('@')[0], email }
    setUser(fakeUser)
    localStorage.setItem('auth_user', JSON.stringify(fakeUser))
    return fakeUser
  }

  const signUp = async ({ name, email }) => {
    const fakeUser = { id: 'u_' + Math.random().toString(36).slice(2, 8), name: name || email.split('@')[0], email }
    setUser(fakeUser)
    localStorage.setItem('auth_user', JSON.stringify(fakeUser))
    return fakeUser
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
