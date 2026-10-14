import { useTranslation } from 'react-i18next'

export function SettingsPage() {
  const { t } = useTranslation('common')

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-100">
        {t('settings.title')}
      </h1>
      <p className="text-slate-400 text-sm">{t('settings.description')}</p>
    </div>
  )
}
