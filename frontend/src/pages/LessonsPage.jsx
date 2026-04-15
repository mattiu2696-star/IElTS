import { useState } from 'react'
import { BookOpen, PenLine, Headphones, Mic, Search, Bookmark, Clock } from 'lucide-react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

const ALL_LESSONS = [
  { id: 1,  title: 'Opinion Essay — Technology',      skill: 'Writing',    type: 'Task 2',    difficulty: 'Medium', duration: '40 min', saved: false },
  { id: 2,  title: 'Discussion Essay — Education',    skill: 'Writing',    type: 'Task 2',    difficulty: 'Hard',   duration: '40 min', saved: false },
  { id: 3,  title: 'Bar Chart Description',           skill: 'Writing',    type: 'Task 1',    difficulty: 'Easy',   duration: '20 min', saved: true  },
  { id: 4,  title: 'Passage: Climate Change',         skill: 'Reading',    type: 'Academic',  difficulty: 'Medium', duration: '60 min', saved: false },
  { id: 5,  title: 'Environment Vocabulary',          skill: 'Vocabulary', type: 'Flashcard', difficulty: 'Medium', duration: '15 min', saved: true  },
  { id: 6,  title: 'Section 4 — Lecture',            skill: 'Listening',  type: 'Section 4', difficulty: 'Hard',   duration: '30 min', saved: false },
  { id: 7,  title: 'Part 1 — Introduction',          skill: 'Speaking',   type: 'Part 1',    difficulty: 'Easy',   duration: '10 min', saved: false },
  { id: 8,  title: 'Problem-Solution Essay',         skill: 'Writing',    type: 'Task 2',    difficulty: 'Hard',   duration: '40 min', saved: false },
]

const skillIcons = { Writing: PenLine, Reading: BookOpen, Vocabulary: BookOpen, Listening: Headphones, Speaking: Mic }
const skillColors = {
  Writing:    'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  Reading:    'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  Vocabulary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
  Listening:  'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  Speaking:   'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
}
const diffColors = {
  Easy:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Hard:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function LessonsPage() {
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState('All')
  const [saved, setSaved] = useState(new Set(ALL_LESSONS.filter(l => l.saved).map(l => l.id)))

  const skills = ['All', 'Writing', 'Reading', 'Vocabulary', 'Listening', 'Speaking']
  const diffs  = ['All', 'Easy', 'Medium', 'Hard']

  const filtered = ALL_LESSONS.filter(l =>
    (skillFilter === 'All' || l.skill === skillFilter) &&
    (diffFilter  === 'All' || l.difficulty === diffFilter) &&
    l.title.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSave = (id) => setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div className="max-w-5xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lessons Library</h2>
        <p className="text-sm text-slate-500 mt-1">{ALL_LESSONS.length} lessons available</p>
      </div>

      {/* Search + filters */}
      <div className="card p-4 mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-10" placeholder="Search lessons..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-400 self-center">Skill:</span>
          {skills.map(s => (
            <button key={s} onClick={() => setSkillFilter(s)}
              className={clsx('px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                skillFilter === s ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              )}>{s}</button>
          ))}
          <span className="text-xs text-slate-400 self-center ml-2">Difficulty:</span>
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
          const Icon = skillIcons[lesson.skill] ?? BookOpen
          const isSaved = saved.has(lesson.id)
          return (
            <div key={lesson.id} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200 group">
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
              <Link
                to={lesson.skill === 'Writing' ? `/writing/${lesson.id}` : `/${lesson.skill.toLowerCase()}`}
                className="btn-primary text-sm py-2 w-full mt-auto"
              >
                Start Lesson
              </Link>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No lessons found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
}
