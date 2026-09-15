import { NavLink, Outlet } from 'react-router-dom'
import { Dumbbell, Settings, Home } from 'lucide-react'

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 sm:pb-0">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <span className="font-bold text-emerald-400 tracking-wide text-lg">
            Personal Hub
          </span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full border border-slate-700">
            Dev
          </span>
        </div>
      </header>

      {/* Main Content (Área dinâmica onde as rotas renderizam) */}
      <main className="flex-1 max-w-md w-full mx-auto p-4">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar (Focada em Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/90 backdrop-blur z-20">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Home className="w-5 h-5 mb-1" />
            Início
          </NavLink>

          <NavLink
            to="/workouts"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Dumbbell className="w-5 h-5 mb-1" />
            Treinos
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Settings className="w-5 h-5 mb-1" />
            Ajustes
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
