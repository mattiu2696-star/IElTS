import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, PenLine, BookOpen, Headphones, Mic,
  BarChart3, Library, LogOut, GraduationCap, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import clsx from 'clsx'

const navItems = [
  { to: '/',          label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/writing',   label: 'Writing',    icon: PenLine },
  { to: '/vocabulary',label: 'Vocabulary', icon: BookOpen },
  { to: '/reading',   label: 'Reading',    icon: Library },
  { to: '/listening', label: 'Listening',  icon: Headphones },
  { to: '/analytics', label: 'Analytics',  icon: BarChart3 },
  { to: '/lessons',   label: 'Lessons',    icon: GraduationCap },
]

const skillColors = {
  Beginner:     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Advanced:     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className={clsx(
      'fixed inset-y-0 left-0 z-30 w-64 flex flex-col',
      'bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700',
      'transition-transform duration-300 lg:static lg:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-700">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white text-sm leading-none">IELTS HUB</h1>
          <p className="text-xs text-slate-400 mt-0.5">Learning Platform</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
            <span className={clsx('badge text-xs mt-0.5', skillColors[user?.level] ?? skillColors.Intermediate)}>
              {user?.level}
            </span>
          </div>
        </div>

        {/* Band score */}
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="text-xs text-slate-500">Current Band</span>
          <span className="text-lg font-bold text-primary-600">{user?.bandScore ?? '—'}</span>
        </div>
        <div className="mt-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${((user?.bandScore ?? 0) / 9) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>0</span><span>9.0</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
              isActive
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
