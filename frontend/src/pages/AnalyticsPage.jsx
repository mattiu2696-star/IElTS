import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts'

const radarData = [
  { skill: 'Nghe',     score: 0 }, { skill: 'Đọc',      score: 0 },
  { skill: 'Viết',     score: 0 }, { skill: 'Nói',      score: 0 },
  { skill: 'Từ vựng',  score: 0 }, { skill: 'Ngữ pháp', score: 0 },
]

const monthlyData = []

const accuracyData = [
  { type: 'Task 1', rate: 0 }, { type: 'Task 2',   rate: 0 },
  { type: 'Đọc',    rate: 0 }, { type: 'Nghe',     rate: 0 },
  { type: 'Từ vựng',rate: 0 }, { type: 'Nói',      rate: 0 },
]

const timeData = [
  { module: 'Viết',     hours: 0 }, { module: 'Từ vựng', hours: 0 },
  { module: 'Đọc',      hours: 0 }, { module: 'Nghe',    hours: 0 },
  { module: 'Nói',      hours: 0  },
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
          <div className="flex items-center justify-center h-[260px] text-slate-400 text-sm">
            Chưa có dữ liệu. Hãy nộp bài Writing để theo dõi tiến độ!
          </div>
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
          { label: 'Tổng giờ học',    value: '0h' },
          { label: 'Bài viết đã nộp', value: '0'  },
          { label: 'Độ chính xác',    value: '—'  },
          { label: 'Từ đã thuộc',     value: '0'  },
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
