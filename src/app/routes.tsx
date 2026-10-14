import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/shared/components/Layout'
import { HomePage } from '@/app/pages/HomePage'
import { SettingsPage } from '@/app/pages/SettingsPage'
import { WorkoutsPage } from '@/features/workouts/pages/WorkoutsPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { GuestRoute } from '@/features/auth/components/GuestRoute'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest Routes (Only accessible when not logged in) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="workouts" element={<WorkoutsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
