import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { AuthProvider } from './AuthContext'
import { useAuth } from '../hooks/useAuth'
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  AUTH_UNAUTHORIZED_EVENT,
} from '@/shared/api/client'

function TestAuthConsumer() {
  const { user, token, isAuthenticated, isLoading, login, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'unauthenticated'}
      </div>
      <div data-testid="user-email">{user?.email ?? 'none'}</div>
      <div data-testid="token-val">{token ?? 'none'}</div>
      <button onClick={() => login('test@example.com', 'password123')}>
        Log In
      </button>
      <button onClick={logout}>Log Out</button>
    </div>
  )
}

describe('AuthContext and useAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('initializes as unauthenticated when localStorage is empty', () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent(
      'unauthenticated',
    )
    expect(screen.getByTestId('user-email')).toHaveTextContent('none')
    expect(screen.getByTestId('token-val')).toHaveTextContent('none')
  })

  it('restores user and token from localStorage on mount', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'saved-token')
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({ id: 1, email: 'restored@example.com' }),
    )

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'restored@example.com',
    )
    expect(screen.getByTestId('token-val')).toHaveTextContent('saved-token')
  })

  it('performs login, saves token and user, and updates state', async () => {
    const user = userEvent.setup()

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({ user: { id: 2, email: 'test@example.com' } }),
        {
          status: 200,
          headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-jwt-token-123',
          }),
        },
      ),
    )

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Log In' }))

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'test@example.com',
    )
    expect(screen.getByTestId('token-val')).toHaveTextContent(
      'mock-jwt-token-123',
    )
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('mock-jwt-token-123')
  })

  it('performs logout and clears state and localStorage', async () => {
    const user = userEvent.setup()
    localStorage.setItem(AUTH_TOKEN_KEY, 'active-token')
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({ id: 1, email: 'logout@example.com' }),
    )

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')

    await user.click(screen.getByRole('button', { name: 'Log Out' }))

    expect(screen.getByTestId('auth-status')).toHaveTextContent(
      'unauthenticated',
    )
    expect(screen.getByTestId('token-val')).toHaveTextContent('none')
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it('logs out automatically when 401 unauthorized event is dispatched', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'token-to-expire')
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({ id: 1, email: 'expire@example.com' }),
    )

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')

    act(() => {
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
    })

    expect(screen.getByTestId('auth-status')).toHaveTextContent(
      'unauthenticated',
    )
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })
})
