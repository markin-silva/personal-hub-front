import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/shared/components/Layout'
import { HomePage } from '@/app/pages/HomePage'
import { SettingsPage } from '@/app/pages/SettingsPage'
import { WorkoutsPage } from '@/features/workouts/pages/WorkoutsPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="workouts" element={<WorkoutsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
