import { Menu, Sun, Moon, Bell, Search } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLocation } from 'react-router-dom'

const titles = {
  '/':           'Tổng quan',
  '/writing':    'Luyện Writing',
  '/vocabulary': 'Từ vựng',
  '/reading':    'Luyện Reading',
  '/listening':  'Luyện Listening',
  '/analytics':  'Thống kê',
  '/lessons':    'Thư viện bài học',
}

export default function Navbar({ onMenuClick }) {
  const { dark, toggle } = useTheme()
  const { pathname } = useLocation()
  const base = '/' + pathname.split('/')[1]
  const title = titles[base] ?? 'IELTS HUB'

  return (
    <header className="flex items-center gap-4 px-4 md:px-6 h-16 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
      {/* Menu button (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h2 className="font-bold text-slate-900 dark:text-white text-lg hidden md:block">{title}</h2>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2 w-56">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Tìm kiếm bài học..."
          className="bg-transparent text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-400 outline-none w-full"
        />
      </div>

      {/* Notification */}
      <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Dark mode */}
      <button
        onClick={toggle}
        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="Toggle dark mode"
      >
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  )
}
