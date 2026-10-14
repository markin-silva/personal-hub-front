import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LoginPage } from './LoginPage'
import { GuestRoute } from '../components/GuestRoute'
import { AuthContext } from '../context/AuthContext'
import type { AuthContextValue } from '../types'
import '@/shared/i18n'

const mockLogin = vi.fn()
const mockRegister = vi.fn()
const mockLogout = vi.fn()

const defaultAuthContext: AuthContextValue = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: mockLogin,
  register: mockRegister,
  logout: mockLogout,
}

function renderLoginPage(authOverrides: Partial<AuthContextValue> = {}) {
  const contextValue = { ...defaultAuthContext, ...authOverrides }
  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

function renderLoginRoutes(authOverrides: Partial<AuthContextValue> = {}) {
  const contextValue = { ...defaultAuthContext, ...authOverrides }
  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route path="/" element={<p>Home page</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('LoginPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form elements properly', () => {
    renderLoginPage()

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })

  it('displays inline validation errors and prevents submit when inputs are empty or invalid', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(
      screen.getByText(/please enter a valid email address/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('does not enforce password length rules on login', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValueOnce(undefined)

    renderLoginPage()

    await user.type(screen.getByLabelText(/email/i), 'user@test.com')
    await user.type(screen.getByLabelText(/password/i), 'abc')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.queryByText(/at least 6 characters/i)).not.toBeInTheDocument()
    expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'abc')
  })

  it('displays inline error on field blur when invalid', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    const emailInput = screen.getByLabelText(/email/i)
    await user.click(emailInput)
    await user.tab()

    expect(
      screen.getByText(/please enter a valid email address/i),
    ).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('calls login function on valid form submit', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValueOnce(undefined)

    renderLoginPage()

    await user.type(screen.getByLabelText(/email/i), 'user@test.com')
    await user.type(screen.getByLabelText(/password/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'secret123')
  })

  it('navigates to / after successful login', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValueOnce(undefined)

    renderLoginRoutes()

    await user.type(screen.getByLabelText(/email/i), 'user@test.com')
    await user.type(screen.getByLabelText(/password/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Home page')).toBeInTheDocument()
  })

  it('redirects an already authenticated user away from /login', () => {
    renderLoginRoutes({ isAuthenticated: true, token: 'token' })

    expect(screen.getByText('Home page')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('displays error alert when login credentials are invalid', async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValueOnce({ status: 401 })

    renderLoginPage()

    await user.type(screen.getByLabelText(/email/i), 'user@test.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
