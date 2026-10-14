import { useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  apiClient,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  AUTH_UNAUTHORIZED_EVENT,
} from '@/shared/api/client'
import { AuthContext } from './auth-context-def'
import type { AuthContextValue, AuthResponse, User } from '../types'

export { AuthContext } from './auth-context-def'

interface AuthProviderProps {
  children: ReactNode
}

function getInitialAuthState(): { token: string | null; user: User | null } {
  try {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)
    const storedUser = localStorage.getItem(AUTH_USER_KEY)

    if (storedToken && storedUser) {
      return {
        token: storedToken,
        user: JSON.parse(storedUser) as User,
      }
    }

    if (storedToken) {
      return {
        token: storedToken,
        user: null,
      }
    }
  } catch {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  }

  return { token: null, user: null }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [initialState] = useState(getInitialAuthState)
  const [user, setUser] = useState<User | null>(initialState.user)
  const [token, setToken] = useState<string | null>(initialState.token)
  const [isLoading] = useState(false)

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  // Listen to 401 unauthorized events dispatched by apiClient
  useEffect(() => {
    const handleUnauthorized = () => {
      logout()
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    }
  }, [logout])

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.postWithResponse<AuthResponse>(
      '/users/sign_in',
      {
        user: { email, password },
      },
      { skipAuth: true },
    )

    // Devise-JWT returns token in the Authorization header: "Bearer <token>"
    const rawAuthHeader = response.headers.get('Authorization')
    const extractedToken = rawAuthHeader
      ? rawAuthHeader.replace(/^Bearer\s+/i, '')
      : null

    const resolvedToken =
      extractedToken ||
      ((response.data as unknown as { token?: string }).token ?? null)

    const resolvedUser: User = response.data?.user ||
      (response.data as unknown as { data?: { user?: User } })?.data?.user || {
        id: 'current',
        email,
      }

    if (resolvedToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, resolvedToken)
      setToken(resolvedToken)
    }

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(resolvedUser))
    setUser(resolvedUser)
  }, [])

  const register = useCallback(
    async (email: string, password: string, passwordConfirmation: string) => {
      const response = await apiClient.postWithResponse<AuthResponse>(
        '/users',
        {
          user: {
            email,
            password,
            password_confirmation: passwordConfirmation,
          },
        },
        { skipAuth: true },
      )

      const rawAuthHeader = response.headers.get('Authorization')
      const extractedToken = rawAuthHeader
        ? rawAuthHeader.replace(/^Bearer\s+/i, '')
        : null

      const resolvedToken =
        extractedToken ||
        ((response.data as unknown as { token?: string }).token ?? null)

      const resolvedUser: User = response.data?.user ||
        (response.data as unknown as { data?: { user?: User } })?.data
          ?.user || {
          id: 'current',
          email,
        }

      if (resolvedToken) {
        localStorage.setItem(AUTH_TOKEN_KEY, resolvedToken)
        setToken(resolvedToken)
      }

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(resolvedUser))
      setUser(resolvedUser)
    },
    [],
  )

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
