import { useTranslation } from 'react-i18next'

export function WorkoutsPage() {
  const { t } = useTranslation('common')

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-100">
        {t('workouts.title')}
      </h1>
      <p className="text-slate-400 text-sm">{t('workouts.description')}</p>
    </div>
  )
}
