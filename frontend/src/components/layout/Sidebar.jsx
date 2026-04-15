import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, PenLine, BookOpen, Headphones,
  BarChart3, Library, GraduationCap, ChevronRight
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { to: '/',           label: 'Tổng quan',  icon: LayoutDashboard, end: true },
  { to: '/writing',    label: 'Writing',    icon: PenLine },
  { to: '/vocabulary', label: 'Từ vựng',   icon: BookOpen },
  { to: '/reading',    label: 'Reading',    icon: Library },
  { to: '/listening',  label: 'Listening',  icon: Headphones },
  { to: '/analytics',  label: 'Thống kê',  icon: BarChart3 },
  { to: '/lessons',    label: 'Bài học',    icon: GraduationCap },
]

export default function Sidebar({ open, onClose }) {
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
    </aside>
  )
}
