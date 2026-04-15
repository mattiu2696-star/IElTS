import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

// Mock user — replace with real API calls later
const MOCK_USER = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex@example.com',
  level: 'Intermediate',
  bandScore: 6.5,
  avatar: null,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const login = async (email, password) => {
    // Mock login — accepts any credentials
    const u = { ...MOCK_USER, email }
    setUser(u)
    localStorage.setItem('ielts_user', JSON.stringify(u))
    return u
  }

  const signup = async (name, email, password) => {
    const u = { ...MOCK_USER, name, email }
    setUser(u)
    localStorage.setItem('ielts_user', JSON.stringify(u))
    return u
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ielts_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
