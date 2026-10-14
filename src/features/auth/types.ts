export interface User {
  id: string | number
  email: string
  created_at?: string
  updated_at?: string
}

export interface AuthResponse {
  user: User
  message?: string
}

export interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => Promise<void>
  logout: () => void
}
