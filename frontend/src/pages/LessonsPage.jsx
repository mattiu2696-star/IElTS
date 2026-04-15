import { useState } from 'react'
import { BookOpen, PenLine, Headphones, Mic, Search, Bookmark, Clock } from 'lucide-react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

const ALL_LESSONS = [
  { id: 1, title: 'Bài luận ý kiến — Công nghệ',    skill: 'Viết',     type: 'Task 2',    difficulty: 'Trung bình', duration: '40 phút', saved: false },
  { id: 2, title: 'Bài luận thảo luận — Giáo dục',  skill: 'Viết',     type: 'Task 2',    difficulty: 'Khó',        duration: '40 phút', saved: false },
  { id: 3, title: 'Mô tả biểu đồ cột',              skill: 'Viết',     type: 'Task 1',    difficulty: 'Dễ',         duration: '20 phút', saved: true  },
  { id: 4, title: 'Bài đọc: Biến đổi khí hậu',      skill: 'Đọc',      type: 'Học thuật', difficulty: 'Trung bình', duration: '60 phút', saved: false },
  { id: 5, title: 'Từ vựng chủ đề Môi trường',      skill: 'Từ vựng',  type: 'Thẻ học',   difficulty: 'Trung bình', duration: '15 phút', saved: true  },
  { id: 6, title: 'Nghe bài giảng — Section 4',     skill: 'Nghe',     type: 'Section 4', difficulty: 'Khó',        duration: '30 phút', saved: false },
  { id: 7, title: 'Nói — Phần giới thiệu bản thân', skill: 'Nói',      type: 'Part 1',    difficulty: 'Dễ',         duration: '10 phút', saved: false },
  { id: 8, title: 'Bài luận vấn đề — Giải pháp',    skill: 'Viết',     type: 'Task 2',    difficulty: 'Khó',        duration: '40 phút', saved: false },
]

const skillIcons   = { Viết: PenLine, Đọc: BookOpen, 'Từ vựng': BookOpen, Nghe: Headphones, Nói: Mic }
const skillColors  = {
  Viết:     'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  Đọc:      'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  'Từ vựng':'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
  Nghe:     'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  Nói:      'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
}
const diffColors   = {
  'Dễ':        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Trung bình':'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Khó':       'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}
const skillRoutes  = { Viết: (id) => `/writing/${id}`, Đọc: () => '/reading', 'Từ vựng': () => '/vocabulary', Nghe: () => '/listening', Nói: () => '/listening' }

export default function LessonsPage() {
  const [search,      setSearch]      = useState('')
  const [skillFilter, setSkillFilter] = useState('Tất cả')
  const [diffFilter,  setDiffFilter]  = useState('Tất cả')
  const [saved,       setSaved]       = useState(new Set(ALL_LESSONS.filter(l => l.saved).map(l => l.id)))

  const skills = ['Tất cả', 'Viết', 'Đọc', 'Từ vựng', 'Nghe', 'Nói']
  const diffs  = ['Tất cả', 'Dễ', 'Trung bình', 'Khó']

  const filtered = ALL_LESSONS.filter(l =>
    (skillFilter === 'Tất cả' || l.skill === skillFilter) &&
    (diffFilter  === 'Tất cả' || l.difficulty === diffFilter) &&
    l.title.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSave = (id) => setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div className="max-w-5xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thư viện bài học</h2>
        <p className="text-sm text-slate-500 mt-1">{ALL_LESSONS.length} bài học có sẵn</p>
      </div>

      <div className="card p-4 mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-10" placeholder="Tìm kiếm bài học..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-400 self-center">Kỹ năng:</span>
          {skills.map(s => (
            <button key={s} onClick={() => setSkillFilter(s)}
              className={clsx('px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                skillFilter === s ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              )}>{s}</button>
          ))}
          <span className="text-xs text-slate-400 self-center ml-2">Độ khó:</span>
          {diffs.map(d => (
            <button key={d} onClick={() => setDiffFilter(d)}
              className={clsx('px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                diffFilter === d ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              )}>{d}</button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(lesson => {
          const Icon    = skillIcons[lesson.skill] ?? BookOpen
          const isSaved = saved.has(lesson.id)
          const to      = skillRoutes[lesson.skill]?.(lesson.id) ?? '/'
          return (
            <div key={lesson.id} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', skillColors[lesson.skill])}>
                  <Icon className="w-5 h-5" />
                </div>
                <button onClick={() => toggleSave(lesson.id)} className="transition-colors">
                  <Bookmark className={clsx('w-4 h-4', isSaved ? 'fill-primary-500 text-primary-500' : 'text-slate-300 hover:text-slate-500')} />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{lesson.title}</h3>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">{lesson.skill}</span>
                  <span className={clsx('badge text-xs', diffColors[lesson.difficulty])}>{lesson.difficulty}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400"><Clock className="w-3 h-3" />{lesson.duration}</span>
                </div>
              </div>
              <Link to={to} className="btn-primary text-sm py-2 w-full mt-auto text-center">
                Bắt đầu học
              </Link>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Không tìm thấy bài học. Hãy thử thay đổi bộ lọc.</p>
        </div>
      )}
    </div>
  )
}
