import { useAuth } from '../contexts/AuthContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { TrendingUp, BookOpen, PenLine, Clock, Target, Flame, ChevronRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

// Mock data
const bandHistory = [
  { week: 'W1', score: 5.5 }, { week: 'W2', score: 5.5 }, { week: 'W3', score: 6.0 },
  { week: 'W4', score: 6.0 }, { week: 'W5', score: 6.5 }, { week: 'W6', score: 6.5 },
]

const skillBreakdown = [
  { skill: 'Listening', score: 7.0, color: '#3b82f6' },
  { skill: 'Reading',   score: 6.5, color: '#8b5cf6' },
  { skill: 'Writing',   score: 6.0, color: '#f59e0b' },
  { skill: 'Speaking',  score: 6.5, color: '#10b981' },
]

const weekActivity = [
  { day: 'Mon', mins: 45 }, { day: 'Tue', mins: 30 }, { day: 'Wed', mins: 60 },
  { day: 'Thu', mins: 20 }, { day: 'Fri', mins: 75 }, { day: 'Sat', mins: 50 }, { day: 'Sun', mins: 15 },
]

const recommendedLessons = [
  { id: 1, title: 'Task 2 — Opinion Essay', type: 'Writing', difficulty: 'Medium', duration: '45 min' },
  { id: 2, title: 'Academic Vocabulary: Environment', type: 'Vocabulary', difficulty: 'Hard', duration: '20 min' },
  { id: 3, title: 'Passage: Climate Change', type: 'Reading', difficulty: 'Medium', duration: '60 min' },
]

const difficultyColors = {
  Easy:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Hard:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const typeIcons = { Writing: PenLine, Vocabulary: BookOpen, Reading: BookOpen }

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            You're on a <span className="text-orange-500 font-semibold">7-day streak!</span> Keep it up.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-xl font-semibold text-sm">
          <Flame className="w-5 h-5" />
          7 day streak
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Star}      label="Current Band"   value="6.5"   sub="+0.5 this month"  color="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" />
        <StatCard icon={PenLine}   label="Essays Written"  value="24"    sub="3 this week"      color="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" />
        <StatCard icon={BookOpen}  label="Words Learned"   value="842"   sub="+58 this week"   color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" />
        <StatCard icon={Clock}     label="Study Time"      value="48h"   sub="12h this week"   color="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Band score trend */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Band Score Trend</h3>
            <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +1.0 band
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={bandHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis domain={[5, 9]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, color: '#f1f5f9', fontSize: 12 }}
              />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Weekly Activity</h3>
            <span className="text-xs text-slate-400">Minutes studied</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekActivity} barSize={28}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, color: '#f1f5f9', fontSize: 12 }}
                formatter={(v) => [`${v} min`, 'Study time']}
              />
              <Bar dataKey="mins" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill breakdown + Recommended lessons */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Skill Breakdown</h3>
          <div className="space-y-4">
            {skillBreakdown.map(({ skill, score, color }) => (
              <div key={skill}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{skill}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{score}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(score / 9) * 100}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Target */}
          <div className="mt-5 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center gap-3">
            <Target className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">Next Milestone: Band 7.0</p>
              <div className="mt-1.5 h-1.5 bg-primary-100 dark:bg-primary-800/50 rounded-full">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: '72%' }} />
              </div>
              <p className="text-xs text-primary-500 mt-1">72% — Keep going!</p>
            </div>
          </div>
        </div>

        {/* Recommended Lessons */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recommended for You</h3>
            <Link to="/lessons" className="text-xs text-primary-600 hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recommendedLessons.map((lesson) => {
              const Icon = typeIcons[lesson.type] ?? BookOpen
              return (
                <Link
                  key={lesson.id}
                  to={`/writing/${lesson.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                    <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{lesson.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={clsx('badge text-xs', difficultyColors[lesson.difficulty])}>{lesson.difficulty}</span>
                      <span className="text-xs text-slate-400">{lesson.duration}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
