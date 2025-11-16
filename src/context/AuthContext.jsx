import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// PRODUCTION: Hardcoded admin users for authentication
// In a real production system, this would be stored in Google Sheets or a secure backend
const ADMIN_USERS = [
  {
    id: 'admin-1',
    email: 'pack182tech@gmail.com',
    password: 'pack182admin',
    role: 'admin',
    name: 'Pack 182 Admin'
  }
]

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const foundUser = ADMIN_USERS.find(u => u.email === email && u.password === password)

    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name
      }
      setUser(userSession)
      localStorage.setItem('currentUser', JSON.stringify(userSession))
      return { success: true, user: userSession }
    }

    return { success: false, error: 'Invalid email or password' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isScout = () => {
    return user?.role === 'scout'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isScout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
