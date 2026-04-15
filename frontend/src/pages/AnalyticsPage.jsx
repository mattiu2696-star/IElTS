import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts'

const radarData = [
  { skill: 'Nghe',     score: 7.0 }, { skill: 'Đọc',      score: 6.5 },
  { skill: 'Viết',     score: 6.0 }, { skill: 'Nói',      score: 6.5 },
  { skill: 'Từ vựng',  score: 7.0 }, { skill: 'Ngữ pháp', score: 6.0 },
]

const monthlyData = [
  { month: 'T11', band: 5.5 }, { month: 'T12', band: 5.5 }, { month: 'T1', band: 6.0 },
  { month: 'T2',  band: 6.0 }, { month: 'T3',  band: 6.5 }, { month: 'T4', band: 6.5 },
]

const accuracyData = [
  { type: 'Task 1', rate: 78 }, { type: 'Task 2',   rate: 65 },
  { type: 'Đọc',    rate: 72 }, { type: 'Nghe',     rate: 80 },
  { type: 'Từ vựng',rate: 85 }, { type: 'Nói',      rate: 68 },
]

const timeData = [
  { module: 'Viết',     hours: 12 }, { module: 'Từ vựng', hours: 8 },
  { module: 'Đọc',      hours: 15 }, { module: 'Nghe',    hours: 6 },
  { module: 'Nói',      hours: 7  },
]

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thống kê</h2>
        <p className="text-sm text-slate-500 mt-1">Theo dõi tiến độ học tập của bạn theo thời gian</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Tổng quan kỹ năng</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
              <Radar name="Điểm" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Band trend */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Tiến độ Band Score</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[5, 9]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, color: '#f1f5f9', fontSize: 12 }} />
              <Line type="monotone" dataKey="band" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Accuracy */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Tỷ lệ chính xác theo bài (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={accuracyData} barSize={32}>
              <XAxis dataKey="type" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, color: '#f1f5f9', fontSize: 12 }} formatter={(v) => [`${v}%`, 'Chính xác']} />
              <Bar dataKey="rate" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time spent */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Thời gian học theo module (giờ)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={timeData} barSize={40} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="module" tick={{ fontSize: 12 }} width={80} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, color: '#f1f5f9', fontSize: 12 }} formatter={(v) => [`${v}h`, 'Thời gian học']} />
              <Bar dataKey="hours" fill="#10b981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng giờ học',    value: '48h' },
          { label: 'Bài viết đã nộp', value: '24'  },
          { label: 'Độ chính xác',    value: '76%' },
          { label: 'Từ đã thuộc',     value: '342' },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
