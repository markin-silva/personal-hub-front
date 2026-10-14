import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RegisterPage } from './RegisterPage'
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

function renderRegisterPage(authOverrides: Partial<AuthContextValue> = {}) {
  const contextValue = { ...defaultAuthContext, ...authOverrides }
  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('RegisterPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders register form elements properly', () => {
    renderRegisterPage()

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create account/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('displays inline validation errors and prevents submit when inputs are empty or invalid', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(
      screen.getByText(/please enter a valid email address/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/password must be at least 6 characters/i),
    ).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('enforces a minimum password length of 6 characters', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText(/^email/i), 'user@test.com')
    await user.type(screen.getByLabelText(/^password/i), 'abc')
    await user.tab()

    expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
  })

  it('keeps password confirmation disabled until password is at least 6 characters', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    const confirmInput = screen.getByLabelText(/confirm password/i)
    expect(confirmInput).toBeDisabled()

    await user.type(screen.getByLabelText(/^password/i), 'abc')
    expect(confirmInput).toBeDisabled()

    await user.type(screen.getByLabelText(/^password/i), 'def')
    expect(confirmInput).toBeEnabled()
  })

  it('displays inline error when password confirmation does not match', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText(/^email/i), 'user@test.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'different123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('renders success card (Option B) upon successful registration', async () => {
    const user = userEvent.setup()
    mockRegister.mockResolvedValueOnce(undefined)

    renderRegisterPage()

    await user.type(screen.getByLabelText(/^email/i), 'newuser@test.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/account created successfully!/i),
      ).toBeInTheDocument()
    })

    expect(
      screen.getByText(/redirecting to login in \d+ seconds\.\.\./i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /go to login now/i }),
    ).toBeInTheDocument()
  })

  it('displays server error banner when API returns error (e.g. 422)', async () => {
    const user = userEvent.setup()
    mockRegister.mockRejectedValueOnce({ status: 422, data: {} })

    renderRegisterPage()

    await user.type(screen.getByLabelText(/^email/i), 'taken@test.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(
      screen.getByText(/email has already been taken/i),
    ).toBeInTheDocument()
  })
})
