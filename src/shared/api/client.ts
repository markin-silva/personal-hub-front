export const AUTH_TOKEN_KEY = 'personal_hub_token'
export const AUTH_USER_KEY = 'personal_hub_user'
export const AUTH_UNAUTHORIZED_EVENT = 'personal_hub:unauthorized'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, data: unknown, message?: string) {
    super(message || `API Error: ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

export interface ApiResponse<T> {
  data: T
  headers: Headers
  status: number
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const result = await requestWithResponse<T>(endpoint, options)
  return result.data
}

export async function requestWithResponse<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { skipAuth = false, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers || {})
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  if (!skipAuth) {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      headers.set(
        'Authorization',
        token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      )
    }
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  if (!response.ok) {
    if (response.status === 401 && !skipAuth) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
    }

    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      errorData = null
    }

    throw new ApiError(response.status, errorData)
  }

  // Handle empty responses (e.g. HTTP 204 No Content)
  if (response.status === 204) {
    return { data: {} as T, headers: response.headers, status: response.status }
  }

  const data = (await response.json()) as T
  return { data, headers: response.headers, status: response.status }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  postWithResponse: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) =>
    requestWithResponse<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}
