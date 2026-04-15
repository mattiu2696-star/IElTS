import { Link } from 'react-router-dom'
import { PenLine, Clock, ChevronRight, Filter } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const lessons = [
  { id: 1, title: 'Bài luận ý kiến — Công nghệ',       type: 'Task 2', difficulty: 'Trung bình', duration: '40 phút', topic: 'Công nghệ' },
  { id: 2, title: 'Bài luận thảo luận — Giáo dục',     type: 'Task 2', difficulty: 'Khó',        duration: '40 phút', topic: 'Giáo dục' },
  { id: 3, title: 'Mô tả biểu đồ cột',                 type: 'Task 1', difficulty: 'Dễ',         duration: '20 phút', topic: 'Học thuật' },
  { id: 4, title: 'Bài luận vấn đề — Giải pháp',       type: 'Task 2', difficulty: 'Khó',        duration: '40 phút', topic: 'Xã hội' },
  { id: 5, title: 'Mô tả biểu đồ tròn',                type: 'Task 1', difficulty: 'Dễ',         duration: '20 phút', topic: 'Học thuật' },
  { id: 6, title: 'Bài luận đồng ý / không đồng ý',    type: 'Task 2', difficulty: 'Trung bình', duration: '40 phút', topic: 'Môi trường' },
]

const diffColors = {
  'Dễ':        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Trung bình':'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Khó':       'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function WritingPage() {
  const [filter, setFilter] = useState('Tất cả')
  const filters = ['Tất cả', 'Task 1', 'Task 2']
  const filtered = filter === 'Tất cả' ? lessons : lessons.filter(l => l.type === filter)

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Luyện Writing</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Chọn bài tập và nhận phản hồi từ AI</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(lesson => (
          <Link
            key={lesson.id}
            to={`/writing/${lesson.id}`}
            className="card p-5 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 group flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                <PenLine className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <span className={clsx('badge', diffColors[lesson.difficulty])}>{lesson.difficulty}</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{lesson.title}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">{lesson.type}</span>
                <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3 h-3" />{lesson.duration}</span>
                <span className="text-xs text-slate-400">{lesson.topic}</span>
              </div>
            </div>
            <div className="flex items-center justify-end text-xs text-primary-600 dark:text-primary-400 font-medium">
              Bắt đầu luyện tập <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
