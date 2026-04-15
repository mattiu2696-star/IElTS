import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Send, Loader2, ChevronLeft, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { writingApi } from '../lib/api'

// DB lesson IDs on VPS
const DB_IDS = { 1: 11, 2: 12, 3: 13, 4: 14, 5: 15 }

const LESSONS = {
  1: {
    title: 'Bài luận ý kiến — Công nghệ',
    type: 'Task 2',
    prompt: 'Some people believe that technology has made our lives more complicated. Others think it has made life easier. Discuss both views and give your own opinion.',
    minWords: 250,
    modelAnswer: `Technology has undeniably transformed our daily lives in profound ways. While some argue that this transformation has introduced unnecessary complexity, I believe that the benefits of modern technology significantly outweigh its drawbacks.

On one hand, critics of technology point to information overload as a primary concern. The constant barrage of notifications, emails, and social media updates can overwhelm individuals, making it difficult to focus on meaningful tasks. Furthermore, our growing dependence on devices means that technical failures can disrupt our lives in ways that were previously unimaginable.

Nevertheless, I firmly believe that technology has simplified our lives in more ways than it has complicated them. Communication has never been more convenient — we can instantly connect with people across the globe at minimal cost. Access to information has been democratised, allowing anyone with a smartphone to access the accumulated knowledge of humanity.

In conclusion, while technology does introduce some complications, its capacity to enhance productivity, improve communication, and broaden access to information makes it an overwhelmingly positive force in modern life.`,
  },
  2: {
    title: 'Bài luận thảo luận — Giáo dục',
    type: 'Task 2',
    prompt: 'Some people think that university education should be free for all students. Others believe students should pay tuition fees. Discuss both views and give your opinion.',
    minWords: 250,
    modelAnswer: `The question of whether higher education should be free or fee-paying is a matter of considerable debate. Both sides present compelling arguments that deserve careful consideration.

Those who advocate for free university education argue that it promotes equal opportunity. When education is accessible regardless of financial background, society benefits from a more skilled and diverse workforce. Countries such as Germany and Norway have demonstrated that free higher education is economically viable and socially beneficial.

On the other hand, proponents of tuition fees contend that students who pay for their education are more motivated and take their studies more seriously. Furthermore, fee income allows universities to maintain high academic standards and invest in research and facilities.

In my view, a middle-ground approach is most sensible. Governments should subsidise higher education significantly while means-tested fees ensure that those who can afford to contribute do so. This balances accessibility with financial sustainability.`,
  },
  3: {
    title: 'Mô tả biểu đồ cột',
    type: 'Task 1',
    prompt: 'The bar chart below shows the percentage of internet users in different countries in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    modelAnswer: `The bar chart illustrates the proportion of internet users across several countries in 2020. Overall, developed nations show significantly higher internet penetration rates compared to developing countries.

Iceland leads with approximately 99% of its population using the internet, closely followed by the United Kingdom and Germany at around 96% and 94% respectively. The United States also demonstrates high usage at roughly 90%.

In contrast, developing nations show considerably lower figures. India records approximately 45% internet usage, while Nigeria stands at around 36%. The lowest rate is observed in Ethiopia, where only about 19% of the population has internet access.

The data clearly indicates a strong correlation between economic development and internet accessibility, with wealthier nations demonstrating near-universal connectivity while poorer nations continue to face significant digital divides.`,
  },
  4: {
    title: 'Bài luận vấn đề — Giải pháp',
    type: 'Task 2',
    prompt: 'Many cities are experiencing severe traffic congestion. What are the causes of this problem and what measures could be taken to address it?',
    minWords: 250,
    modelAnswer: `Traffic congestion has become one of the most pressing urban challenges of the modern era. This essay will examine the principal causes of this problem and propose several practical solutions.

The primary cause of urban traffic congestion is the dramatic increase in private vehicle ownership. As incomes rise, more people can afford cars, leading to overcrowded road networks that were not designed to handle such volumes. Compounding this is inadequate public transportation infrastructure, which forces commuters to rely on private vehicles even when they would prefer alternatives.

To address these issues, governments must invest heavily in public transportation. Expanding metro systems, increasing bus frequencies, and introducing dedicated cycle lanes can make alternatives to driving genuinely attractive. Singapore and London have demonstrated the effectiveness of congestion charging, where drivers pay a fee to enter busy city centres, thereby reducing unnecessary journeys.

Urban planning also plays a crucial role. Designing mixed-use neighbourhoods where residents can walk or cycle to work reduces the need for long commutes entirely.

In conclusion, tackling traffic congestion requires a combination of improved public transport, financial disincentives for driving, and smarter urban planning.`,
  },
  5: {
    title: 'Bài luận đồng ý / không đồng ý — Môi trường',
    type: 'Task 2',
    prompt: 'Protecting the environment is the responsibility of the government, not individuals. To what extent do you agree or disagree?',
    minWords: 250,
    modelAnswer: `The question of environmental responsibility is one that touches every member of society. While I acknowledge that governments bear primary responsibility for environmental protection, I believe that individuals also have a significant role to play.

Governments possess the legislative power and financial resources necessary to implement large-scale environmental policies. They can regulate industrial emissions, invest in renewable energy infrastructure, and enforce penalties for pollution. Without such systemic action, individual efforts will have limited impact. China's investment in solar energy and the European Union's carbon trading scheme exemplify the transformative potential of government-led initiatives.

However, to argue that individuals bear no responsibility would be misguided. Consumer choices collectively shape markets and drive demand for sustainable products. When individuals reduce their meat consumption, choose public transport, or minimise single-use plastics, they send powerful market signals. Furthermore, civic pressure from environmentally conscious citizens has historically compelled governments to adopt more ambitious environmental policies.

In conclusion, environmental protection is a shared responsibility. Governments must lead through legislation and investment, while individuals must complement these efforts through conscious lifestyle choices. Neither can succeed without the other.`,
  },
}

function BandScoreCard({ label, score }) {
  const color = score >= 7 ? 'text-green-600' : score >= 6 ? 'text-amber-600' : 'text-red-500'
  return (
    <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
      <div className={clsx('text-2xl font-bold', color)}>{score.toFixed(1)}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
    </div>
  )
}

function ResultsPanel({ result, modelAnswer, onReset }) {
  const [tab, setTab] = useState('feedback')
  const tabs = [
    { key: 'feedback', label: 'Nhận xét' },
    { key: 'errors',   label: 'Lỗi sai' },
    { key: 'model',    label: 'Bài mẫu' },
  ]

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Overall band */}
      <div className="card p-6 text-center">
        <p className="text-sm text-slate-500 mb-2">Điểm Band Tổng</p>
        <div className="text-6xl font-black text-primary-600 dark:text-primary-400">{result.bandScore.toFixed(1)}</div>
        <div className="text-slate-400 text-sm mt-1">trên 9.0</div>
        <div className="grid grid-cols-4 gap-3 mt-5">
          <BandScoreCard label="Nội dung"    score={result.taskAchievement} />
          <BandScoreCard label="Mạch lạc"    score={result.coherence} />
          <BandScoreCard label="Từ vựng"     score={result.lexical} />
          <BandScoreCard label="Ngữ pháp"    score={result.grammar} />
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-slate-100 dark:border-slate-700">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                'flex-1 py-3 text-sm font-medium transition-colors',
                tab === t.key
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'feedback' && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Nhận xét tổng quan</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{result.feedback}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Điểm mạnh
                  </p>
                  <ul className="space-y-1">
                    {result.strengths.map((s, i) => <li key={i} className="text-sm text-green-700 dark:text-green-300">• {s}</li>)}
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> Cần cải thiện
                  </p>
                  <ul className="space-y-1">
                    {result.improvements.map((s, i) => <li key={i} className="text-sm text-amber-700 dark:text-amber-300">• {s}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'errors' && (
            <div className="space-y-3">
              {result.errorHighlights.length === 0
                ? <p className="text-sm text-slate-500 text-center py-6">Không tìm thấy lỗi lớn!</p>
                : result.errorHighlights.map((e, i) => (
                  <div key={i} className="p-3 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm"><span className="line-through text-red-500">{e.text}</span> → <span className="font-semibold text-green-600">{e.correction}</span></p>
                        <p className="text-xs text-slate-500 mt-1">{e.reason}</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'model' && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{modelAnswer}</p>
            </div>
          )}
        </div>
      </div>

      <button onClick={onReset} className="btn-secondary w-full">Làm lại bài</button>
    </div>
  )
}

export default function WritingExercisePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lesson = LESSONS[id] ?? LESSONS[1]

  const [essay, setEssay] = useState('')
  const [timeLeft, setTimeLeft] = useState((lesson.type === 'Task 1' ? 20 : 40) * 60)
  const [timerActive, setTimerActive] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    const t = setInterval(() => setTimeLeft(v => v - 1), 1000)
    return () => clearInterval(t)
  }, [timerActive, timeLeft])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleSubmit = useCallback(async () => {
    if (wordCount < lesson.minWords) {
      toast.error(`Cần ít nhất ${lesson.minWords} từ (bạn đang có ${wordCount} từ)`)
      return
    }
    setSubmitting(true)
    try {
      const { data } = await writingApi.submit({
        essay_text:   essay,
        lesson_id:    DB_IDS[Number(id)] ?? null,
        essay_prompt: lesson.prompt,
        essay_type:   lesson.type,
      })
      setResult(data.grading)
      setTimerActive(false)
      toast.success('Đã chấm bài xong!')
    } catch {
      toast.error('Chấm bài thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }, [essay, wordCount, lesson, id])

  useEffect(() => {
    const handler = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (!result && !submitting) handleSubmit() } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSubmit, result, submitting])

  return (
    <div className="max-w-5xl mx-auto animate-slide-up">
      <button onClick={() => navigate('/writing')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Quay lại danh sách bài
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 mb-2">{lesson.type}</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{lesson.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-semibold text-sm',
            timeLeft < 300 ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          )}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          {!timerActive && !result && (
            <button onClick={() => setTimerActive(true)} className="btn-secondary text-sm py-2">
              Bắt đầu hẹn giờ
            </button>
          )}
        </div>
      </div>

      {result ? (
        <ResultsPanel result={result} modelAnswer={lesson.modelAnswer} onReset={() => { setResult(null); setEssay(''); setTimeLeft((lesson.type === 'Task 1' ? 20 : 40) * 60) }} />
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Đề bài */}
          <div className="lg:col-span-2">
            <div className="card p-5 sticky top-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">Đề bài</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{lesson.prompt}</p>
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  Viết ít nhất <span className="font-bold">{lesson.minWords} từ</span>.<br />
                  Thời gian: {lesson.type === 'Task 1' ? '20' : '40'} phút.
                </p>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Mẹo: Nhấn <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-xs font-mono">⌘S</kbd> để nộp bài
              </div>
            </div>
          </div>

          {/* Khung viết */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="card flex flex-col flex-1">
              <textarea
                value={essay}
                onChange={e => setEssay(e.target.value)}
                placeholder="Bắt đầu viết bài của bạn ở đây..."
                className="w-full flex-1 p-5 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none focus:outline-none leading-relaxed min-h-[400px]"
              />
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
                <span className={clsx(
                  'text-sm font-medium',
                  wordCount >= lesson.minWords ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
                )}>
                  {wordCount} / {lesson.minWords} từ {wordCount >= lesson.minWords && '✓'}
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || wordCount < 10}
                  className="btn-primary text-sm py-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? 'Đang chấm bài...' : 'Nộp & Chấm điểm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
