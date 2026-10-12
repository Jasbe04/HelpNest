import {
  createContext,useCallback,useContext,useEffect,useState,}  
  
from 'react'

import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [accessToken, setAccessToken] = useState(() =>
    sessionStorage.getItem('access_token'),
  )

  const logout = useCallback(() => {
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('refresh_token')

    setAccessToken(null)
    setUser(null)
  }, [])

  const login = useCallback(async (username, password) => {
    const response = await api.post('accounts/token/', {
      username,
      password,
    })

    const { access, refresh } = response.data

    sessionStorage.setItem('access_token', access)
    sessionStorage.setItem('refresh_token', refresh)

    setAccessToken(access)

    const userResponse = await api.get('accounts/me/', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })

    setUser(userResponse.data)

    return userResponse.data
  }, [])

  const register = useCallback(async (formData) => {
    await api.post('accounts/register/', formData)

  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      const token = sessionStorage.getItem('access_token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('accounts/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!cancelled) {
          setAccessToken(token)
          setUser(response.data)
        }
      } catch {
        if (!cancelled) {
          logout()
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [logout])

  const value = {
    user,
    accessToken,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: Boolean(user),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}