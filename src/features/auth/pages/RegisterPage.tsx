import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/components/Button'
import { useAuth } from '../hooks/useAuth'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterPage() {
  const { t } = useTranslation('auth')
  const { register } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirmation: false,
  })

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(3)

  // Pre-submit validation
  const emailError =
    !email.trim() || !EMAIL_REGEX.test(email.trim())
      ? t('errors.emailInvalid')
      : null

  const isPasswordValid = password.length >= 6
  const passwordError = isPasswordValid
    ? null
    : t('errors.registerPasswordLength')

  const passwordConfirmationError =
    passwordConfirmation !== password ? t('errors.passwordsMismatch') : null

  const handleBlur =
    (field: 'email' | 'password' | 'passwordConfirmation') => () => {
      setTouched((prev) => ({ ...prev, [field]: true }))
    }

  // Countdown timer when registration succeeds (Option B)
  useEffect(() => {
    if (!isSuccess) return

    if (countdown <= 0) {
      navigate('/login', { replace: true })
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isSuccess, countdown, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({
      email: true,
      password: true,
      passwordConfirmation: true,
    })
    setError(null)

    // Stop submit if any client-side validation error is present
    if (emailError || passwordError || passwordConfirmationError) {
      return
    }

    setIsSubmitting(true)

    try {
      await register(email.trim(), password, passwordConfirmation)
      setIsSuccess(true)
    } catch (err: unknown) {
      const apiErr = err as {
        status?: number
        data?: {
          error?: string
          errors?: string[] | Record<string, string[]>
          message?: string
        }
      }

      if (apiErr.status === 422) {
        if (typeof apiErr.data?.errors === 'object') {
          const firstErrKey = Object.keys(apiErr.data.errors)[0]
          const errList = (apiErr.data.errors as Record<string, string[]>)[
            firstErrKey
          ]
          if (errList && errList.length > 0) {
            setError(`${firstErrKey} ${errList[0]}`)
            return
          }
        }
        setError(t('register.emailTaken'))
      } else {
        setError(
          apiErr.data?.error ||
            apiErr.data?.message ||
            t('register.genericError'),
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render Success Card (Option B)
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center px-4 py-8">
        <div className="max-w-md w-full mx-auto space-y-6 text-center">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-100">
                {t('register.success.title')}
              </h1>
              <p className="text-xs text-slate-400">
                {t('register.success.redirecting', { count: countdown })}
              </p>
            </div>

            <Button
              onClick={() => navigate('/login', { replace: true })}
              className="mt-4"
            >
              {t('register.success.goToLogin')}
            </Button>
          </div>
        </div>
      </div>
    )
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
            {t('register.title')}
          </h1>
          <p className="text-xs text-slate-400">{t('register.subtitle')}</p>
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
              {t('register.emailLabel')}
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
              placeholder={t('register.emailPlaceholder')}
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
              {t('register.passwordLabel')}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError(null)
              }}
              onBlur={handleBlur('password')}
              placeholder={t('register.passwordPlaceholder')}
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

          <div className="space-y-1">
            <label
              htmlFor="passwordConfirmation"
              className="block text-xs font-medium text-slate-300"
            >
              {t('register.confirmPasswordLabel')}
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value)
                if (error) setError(null)
              }}
              onBlur={handleBlur('passwordConfirmation')}
              disabled={!isPasswordValid}
              placeholder={t('register.confirmPasswordPlaceholder')}
              aria-invalid={
                touched.passwordConfirmation &&
                Boolean(passwordConfirmationError)
              }
              aria-describedby={
                touched.passwordConfirmation && passwordConfirmationError
                  ? 'password-confirmation-error'
                  : undefined
              }
              className={`w-full px-3 py-2 text-sm bg-slate-900 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                touched.passwordConfirmation && passwordConfirmationError
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-800 focus:border-emerald-500'
              }`}
            />
            {touched.passwordConfirmation && passwordConfirmationError && (
              <p
                id="password-confirmation-error"
                className="text-xs text-rose-400 mt-1"
              >
                {passwordConfirmationError}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? t('register.submitting') : t('register.submit')}
          </Button>
        </form>

        {/* Footer / Switch link */}
        <p className="text-center text-xs text-slate-400">
          {t('register.hasAccount')}{' '}
          <Link
            to="/login"
            className="text-emerald-400 font-medium hover:underline"
          >
            {t('register.signInLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
