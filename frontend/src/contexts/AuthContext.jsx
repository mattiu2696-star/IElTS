import { createContext, useContext, useState } from 'react'
import { authApi } from '../lib/api'

const AuthContext = createContext()

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
    const { data } = await authApi.login(email, password)
    const { user, accessToken, refreshToken } = data
    setUser(user)
    localStorage.setItem('ielts_user',    JSON.stringify(user))
    localStorage.setItem('access_token',  accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    return user
  }

  const signup = async (name, email, password) => {
    const { data } = await authApi.signup(name, email, password)
    const { user, accessToken, refreshToken } = data
    setUser(user)
    localStorage.setItem('ielts_user',    JSON.stringify(user))
    localStorage.setItem('access_token',  accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    return user
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    try { await authApi.logout(refreshToken) } catch {}
    setUser(null)
    localStorage.removeItem('ielts_user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('ielts_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
