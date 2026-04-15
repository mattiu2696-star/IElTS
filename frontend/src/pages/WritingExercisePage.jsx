import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Send, Loader2, ChevronLeft, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const LESSONS = {
  1: {
    title: 'Opinion Essay — Technology',
    type: 'Task 2',
    prompt: 'Some people believe that technology has made our lives more complicated. Others think it has made life easier. Discuss both views and give your own opinion.',
    minWords: 250,
    modelAnswer: `Technology has undeniably transformed our daily lives in profound ways. While some argue that this transformation has introduced unnecessary complexity, I believe that the benefits of modern technology significantly outweigh its drawbacks.\n\nOn one hand, critics of technology point to information overload as a primary concern. The constant barrage of notifications, emails, and social media updates can overwhelm individuals, making it difficult to focus on meaningful tasks. Furthermore, our growing dependence on devices means that technical failures or internet outages can disrupt our lives in ways that were previously unimaginable. People who lack digital literacy may also find themselves increasingly marginalised in a technology-driven society.\n\nNevertheless, I firmly believe that technology has simplified our lives in more ways than it has complicated them. Communication, for instance, has never been more convenient — we can instantly connect with people across the globe at minimal cost. Access to information has been democratised, allowing anyone with a smartphone to access the accumulated knowledge of humanity. Moreover, routine tasks such as banking, shopping, and navigation have been streamlined through digital platforms, saving individuals considerable time and effort.\n\nIn conclusion, while technology does introduce some complications, its capacity to enhance productivity, improve communication, and broaden access to information makes it an overwhelmingly positive force in modern life. The key lies in using technology mindfully and ensuring that people have the skills to navigate the digital world effectively.`,
  },
  2: {
    title: 'Discussion Essay — Education',
    type: 'Task 2',
    prompt: 'Some people think that university education should be free for all students. Others believe students should pay tuition fees. Discuss both views and give your opinion.',
    minWords: 250,
    modelAnswer: 'Model answer for education essay...',
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

function ResultsPanel({ result, essay, modelAnswer, onReset }) {
  const [tab, setTab] = useState('feedback')

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Overall band */}
      <div className="card p-6 text-center">
        <p className="text-sm text-slate-500 mb-2">Overall Band Score</p>
        <div className="text-6xl font-black text-primary-600 dark:text-primary-400">{result.bandScore.toFixed(1)}</div>
        <div className="text-slate-400 text-sm mt-1">out of 9.0</div>
        <div className="grid grid-cols-4 gap-3 mt-5">
          <BandScoreCard label="Task Achievement" score={result.taskAchievement} />
          <BandScoreCard label="Coherence" score={result.coherence} />
          <BandScoreCard label="Lexical Resource" score={result.lexical} />
          <BandScoreCard label="Grammar" score={result.grammar} />
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-slate-100 dark:border-slate-700">
          {['feedback', 'errors', 'model'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'flex-1 py-3 text-sm font-medium capitalize transition-colors',
                tab === t
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              {t === 'model' ? 'Model Answer' : t}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'feedback' && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Overall Feedback</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{result.feedback}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Strengths
                  </p>
                  <ul className="space-y-1">
                    {result.strengths.map((s, i) => <li key={i} className="text-sm text-green-700 dark:text-green-300">• {s}</li>)}
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> Areas to Improve
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
                ? <p className="text-sm text-slate-500 text-center py-6">No major errors found!</p>
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

      <button onClick={onReset} className="btn-secondary w-full">Try Again</button>
    </div>
  )
}

// Mock Claude grading
async function gradeEssay(text, lesson) {
  await new Promise(r => setTimeout(r, 2000)) // simulate API delay
  const wc = text.trim().split(/\s+/).length
  const base = Math.min(6 + wc / 500, 7.5)
  return {
    bandScore: parseFloat(base.toFixed(1)),
    taskAchievement: parseFloat((base + 0.5).toFixed(1)),
    coherence:       parseFloat((base - 0.5).toFixed(1)),
    lexical:         parseFloat((base).toFixed(1)),
    grammar:         parseFloat((base + 0.0).toFixed(1)),
    feedback: `Your essay demonstrates a clear understanding of the topic and presents relevant arguments. The introduction effectively sets the context, and your conclusion restates the main points. To improve your score, focus on using a wider range of vocabulary and more complex sentence structures.`,
    strengths: [
      'Clear thesis statement and position',
      'Logical paragraph structure',
      'Relevant examples to support arguments',
    ],
    improvements: [
      'Expand your range of cohesive devices',
      'Use more sophisticated vocabulary',
      'Develop counter-arguments more thoroughly',
    ],
    errorHighlights: [
      { text: 'alot', correction: 'a lot', reason: 'Spelling error — "alot" is not a standard English word' },
      { text: 'more easier', correction: 'easier', reason: 'Double comparative — use only one form' },
    ],
  }
}

export default function WritingExercisePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lesson = LESSONS[id] ?? LESSONS[1]

  const [essay, setEssay] = useState('')
  const [timeLeft, setTimeLeft] = useState(40 * 60) // 40 min
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
      toast.error(`Minimum ${lesson.minWords} words required (you have ${wordCount})`)
      return
    }
    setSubmitting(true)
    try {
      const r = await gradeEssay(essay, lesson)
      setResult(r)
      setTimerActive(false)
      toast.success('Essay graded successfully!')
    } catch {
      toast.error('Grading failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }, [essay, wordCount, lesson])

  // Ctrl+S shortcut
  useEffect(() => {
    const handler = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (!result && !submitting) handleSubmit() } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSubmit, result, submitting])

  return (
    <div className="max-w-5xl mx-auto animate-slide-up">
      {/* Back */}
      <button onClick={() => navigate('/writing')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to exercises
      </button>

      {/* Header */}
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
              Start Timer
            </button>
          )}
        </div>
      </div>

      {result ? (
        <ResultsPanel result={result} essay={essay} modelAnswer={lesson.modelAnswer} onReset={() => { setResult(null); setEssay(''); setTimeLeft(40 * 60) }} />
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Prompt */}
          <div className="lg:col-span-2">
            <div className="card p-5 sticky top-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">Essay Prompt</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{lesson.prompt}</p>
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  Write at least <span className="font-bold">{lesson.minWords} words</span>.<br />
                  Time allowed: 40 minutes.
                </p>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-xs font-mono">⌘S</kbd> to submit
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="card flex flex-col flex-1">
              <textarea
                value={essay}
                onChange={e => setEssay(e.target.value)}
                placeholder="Start writing your essay here..."
                className="w-full flex-1 p-5 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none focus:outline-none leading-relaxed min-h-[400px]"
              />
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
                <span className={clsx(
                  'text-sm font-medium',
                  wordCount >= lesson.minWords ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
                )}>
                  {wordCount} / {lesson.minWords} words {wordCount >= lesson.minWords && '✓'}
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || wordCount < 10}
                  className="btn-primary text-sm py-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? 'Grading with AI...' : 'Submit & Grade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
