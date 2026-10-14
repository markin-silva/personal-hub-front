import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/Button'
import { useAuth } from '../hooks/useAuth'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage() {
  const { t } = useTranslation('auth')
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-submit client-side validation
  const emailError =
    !email.trim() || !EMAIL_REGEX.test(email.trim())
      ? t('errors.emailInvalid')
      : null

  // Login only checks presence; registration criteria do not apply here
  const passwordError = !password ? t('errors.loginPasswordRequired') : null

  const handleBlur = (field: 'email' | 'password') => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    setError(null)

    // Stop submit if client-side validation errors exist
    if (emailError || passwordError) {
      return
    }

    setIsSubmitting(true)

    try {
      await login(email.trim(), password)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const apiErr = err as {
        status?: number
        data?: { error?: string; message?: string }
      }
      if (apiErr.status === 401) {
        setError(t('login.invalidCredentials'))
      } else {
        setError(
          apiErr.data?.error || apiErr.data?.message || t('login.genericError'),
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center px-4 py-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Header / Brand */}
        <div className="text-center space-y-2">
          <span className="font-bold text-emerald-400 tracking-wide text-2xl">
            Personal Hub
          </span>
          <h1 className="text-xl font-semibold text-slate-100">
            {t('login.title')}
          </h1>
          <p className="text-xs text-slate-400">{t('login.subtitle')}</p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div
            role="alert"
            className="p-3 text-xs rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-300"
            >
              {t('login.emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(null)
              }}
              onBlur={handleBlur('email')}
              placeholder={t('login.emailPlaceholder')}
              aria-invalid={touched.email && Boolean(emailError)}
              aria-describedby={
                touched.email && emailError ? 'email-error' : undefined
              }
              className={`w-full px-3 py-2 text-sm bg-slate-900 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                touched.email && emailError
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-800 focus:border-emerald-500'
              }`}
            />
            {touched.email && emailError && (
              <p id="email-error" className="text-xs text-rose-400 mt-1">
                {emailError}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-300"
            >
              {t('login.passwordLabel')}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError(null)
              }}
              onBlur={handleBlur('password')}
              placeholder={t('login.passwordPlaceholder')}
              aria-invalid={touched.password && Boolean(passwordError)}
              aria-describedby={
                touched.password && passwordError ? 'password-error' : undefined
              }
              className={`w-full px-3 py-2 text-sm bg-slate-900 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                touched.password && passwordError
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-800 focus:border-emerald-500'
              }`}
            />
            {touched.password && passwordError && (
              <p id="password-error" className="text-xs text-rose-400 mt-1">
                {passwordError}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? t('login.submitting') : t('login.submit')}
          </Button>
        </form>

        {/* Footer / Switch link */}
        <p className="text-center text-xs text-slate-400">
          {t('login.noAccount')}{' '}
          <Link
            to="/register"
            className="text-emerald-400 font-medium hover:underline"
          >
            {t('login.signUpLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
