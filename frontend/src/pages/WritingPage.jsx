import { Link } from 'react-router-dom'
import { PenLine, Clock, ChevronRight, Filter } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const lessons = [
  { id: 1, title: 'Opinion Essay — Technology',    type: 'Task 2', difficulty: 'Medium', duration: '40 min', topic: 'Technology' },
  { id: 2, title: 'Discussion Essay — Education',  type: 'Task 2', difficulty: 'Hard',   duration: '40 min', topic: 'Education' },
  { id: 3, title: 'Graph Description — Bar Chart', type: 'Task 1', difficulty: 'Easy',   duration: '20 min', topic: 'Academic' },
  { id: 4, title: 'Problem-Solution Essay',        type: 'Task 2', difficulty: 'Hard',   duration: '40 min', topic: 'Society' },
  { id: 5, title: 'Pie Chart Description',         type: 'Task 1', difficulty: 'Easy',   duration: '20 min', topic: 'Academic' },
  { id: 6, title: 'Agree/Disagree Essay',          type: 'Task 2', difficulty: 'Medium', duration: '40 min', topic: 'Environment' },
]

const diffColors = {
  Easy:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Hard:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function WritingPage() {
  const [filter, setFilter] = useState('All')

  const filters = ['All', 'Task 1', 'Task 2']
  const filtered = filter === 'All' ? lessons : lessons.filter(l => l.type === filter)

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Writing Practice</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose an exercise and get AI-powered feedback</p>
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
              Start practice <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
