import { useTranslation } from 'react-i18next'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/shared/components/Button'

export function SettingsPage() {
  const { t } = useTranslation(['common', 'auth'])
  const { user, logout } = useAuth()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-100">
          {t('common:settings.title')}
        </h1>
        <p className="text-slate-400 text-sm">
          {t('common:settings.description')}
        </p>
      </div>

      {/* User profile card */}
      {user && (
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">
            Logged in as
          </span>
          <p className="text-sm font-semibold text-slate-200">{user.email}</p>
        </div>
      )}

      {/* Logout Action */}
      <div className="pt-4 border-t border-slate-800">
        <Button
          variant="secondary"
          onClick={logout}
          className="text-rose-400 hover:text-rose-300"
        >
          <LogOut className="w-4 h-4" />
          {t('auth:logout')}
        </Button>
      </div>
    </div>
  )
}
