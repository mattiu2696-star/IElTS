import { useState } from 'react'
import { RotateCcw, Check, X } from 'lucide-react'
import clsx from 'clsx'

const TOPICS = ['Tất cả', 'Môi trường', 'Công nghệ', 'Giáo dục', 'Sức khỏe', 'Xã hội', 'Kinh doanh']

const WORDS = [
  { id: 1,  word: 'ubiquitous',  definition: 'Có mặt khắp nơi, phổ biến rộng rãi',                     example: 'Điện thoại di động đã trở nên phổ biến trong xã hội hiện đại.', level: 'C1', topic: 'Công nghệ' },
  { id: 2,  word: 'mitigate',    definition: 'Làm giảm bớt mức độ nghiêm trọng của một vấn đề',         example: 'Chính phủ đã triển khai các chính sách để giảm thiểu tác động của biến đổi khí hậu.', level: 'C1', topic: 'Môi trường' },
  { id: 3,  word: 'proliferate', definition: 'Gia tăng nhanh chóng về số lượng',                        example: 'Các nền tảng mạng xã hội tiếp tục phát triển trên toàn cầu.', level: 'C2', topic: 'Công nghệ' },
  { id: 4,  word: 'exacerbate',  definition: 'Làm cho tình trạng xấu trở nên tệ hơn',                   example: 'Quản lý rác thải kém có thể làm trầm trọng thêm ô nhiễm môi trường.', level: 'C2', topic: 'Môi trường' },
  { id: 5,  word: 'paramount',   definition: 'Quan trọng hơn bất cứ điều gì khác',                      example: 'Giáo dục có tầm quan trọng tối thượng đối với sự phát triển của đất nước.', level: 'C1', topic: 'Giáo dục' },
  { id: 6,  word: 'alleviate',   definition: 'Làm giảm nhẹ điều gì đó xấu như đau đớn hoặc vấn đề',    example: 'Cải cách y tế nhằm giảm bớt gánh nặng cho bệnh viện công.', level: 'B2', topic: 'Sức khỏe' },
  { id: 7,  word: 'pragmatic',   definition: 'Giải quyết vấn đề một cách thực tế và hợp lý',            example: 'Phương pháp tiếp cận thực dụng trong giáo dục tập trung vào kỹ năng thực hành.', level: 'C1', topic: 'Giáo dục' },
  { id: 8,  word: 'detrimental', definition: 'Có xu hướng gây hại',                                     example: 'Thời gian sử dụng màn hình quá nhiều có thể gây hại cho sự phát triển của trẻ em.', level: 'B2', topic: 'Sức khỏe' },
  { id: 9,  word: 'sustainable', definition: 'Có thể được duy trì ở một tốc độ hoặc mức độ nhất định',  example: 'Phát triển bền vững đáp ứng nhu cầu hiện tại mà không ảnh hưởng đến tương lai.', level: 'B2', topic: 'Môi trường' },
  { id: 10, word: 'inequitable', definition: 'Không công bằng hoặc hợp lý',                             example: 'Báo cáo nêu bật sự phân phối không công bằng của nguồn lực giáo dục.', level: 'C1', topic: 'Xã hội' },
]

function FlashCard({ word, onKnow, onSkip }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={clsx('flip-card w-full max-w-lg h-64 cursor-pointer', flipped && 'flipped')}
        onClick={() => setFlipped(f => !f)}
      >
        <div className="flip-card-inner w-full h-full">
          <div className="flip-card-front card w-full h-full flex flex-col items-center justify-center p-8 select-none">
            <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 mb-4">{word.level} · {word.topic}</span>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">{word.word}</h2>
            <p className="text-sm text-slate-400">Nhấn để xem nghĩa</p>
          </div>
          <div className="flip-card-back card w-full h-full flex flex-col items-center justify-center p-8 bg-primary-600 dark:bg-primary-700 border-none select-none">
            <p className="text-lg font-semibold text-white text-center mb-4">{word.definition}</p>
            <p className="text-sm text-primary-100 text-center italic">"{word.example}"</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => { setFlipped(false); onSkip() }} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
          <X className="w-5 h-5" /> Chưa nhớ
        </button>
        <button onClick={() => { setFlipped(false); onKnow() }} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-semibold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
          <Check className="w-5 h-5" /> Đã nhớ
        </button>
      </div>
    </div>
  )
}

function QuizMode({ words, onFinish }) {
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)

  const current = words[idx]
  const options = [current, ...WORDS.filter(w => w.id !== current.id).sort(() => Math.random() - 0.5).slice(0, 3)]
    .sort(() => Math.random() - 0.5)

  const handleAnswer = (def) => {
    if (selected) return
    setSelected(def)
    if (def === current.definition) setScore(s => s + 1)
    setTimeout(() => {
      if (idx < words.length - 1) { setIdx(i => i + 1); setSelected(null) }
      else onFinish(score + (def === current.definition ? 1 : 0), words.length)
    }, 1000)
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Câu {idx + 1} / {words.length}</span>
        <span className="font-semibold text-primary-600">Điểm: {score}</span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
        <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${(idx / words.length) * 100}%` }} />
      </div>
      <div className="card p-8 text-center">
        <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Từ này có nghĩa là gì?</p>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{current.word}</h2>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt.definition)}
            className={clsx(
              'text-left p-4 rounded-xl border-2 text-sm font-medium transition-all',
              !selected ? 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-700 dark:text-slate-300' :
              opt.definition === current.definition ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
              opt.definition === selected ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
              'border-slate-200 dark:border-slate-700 text-slate-400 opacity-50'
            )}
          >
            {opt.definition}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function VocabularyPage() {
  const [topic, setTopic] = useState('Tất cả')
  const [mode, setMode] = useState('flashcard')
  const [cardIdx, setCardIdx] = useState(0)
  const [known, setKnown] = useState(new Set())
  const [quizResult, setQuizResult] = useState(null)

  const filtered = topic === 'Tất cả' ? WORDS : WORDS.filter(w => w.topic === topic)
  const currentCard = filtered[cardIdx % filtered.length]

  const modeLabels = { flashcard: 'Thẻ học', quiz: 'Kiểm tra', list: 'Danh sách' }

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Từ vựng</h2>
          <p className="text-sm text-slate-500 mt-1">{known.size} / {filtered.length} từ đã thuộc</p>
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
          {['flashcard', 'quiz', 'list'].map(m => (
            <button key={m} onClick={() => { setMode(m); setQuizResult(null) }}
              className={clsx('px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                mode === m ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              )}
            >{modeLabels[m]}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {TOPICS.map(t => (
          <button key={t} onClick={() => { setTopic(t); setCardIdx(0) }}
            className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              topic === t ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            )}
          >{t}</button>
        ))}
      </div>

      <div className="card p-4 mb-6 flex items-center gap-4">
        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${(known.size / filtered.length) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
          {Math.round((known.size / filtered.length) * 100)}% đã thuộc
        </span>
        <button onClick={() => setKnown(new Set())} className="text-slate-400 hover:text-slate-600 transition-colors" title="Đặt lại tiến độ">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {mode === 'flashcard' && (
        <FlashCard
          word={currentCard}
          onKnow={() => { setKnown(s => new Set([...s, currentCard.id])); setCardIdx(i => i + 1) }}
          onSkip={() => setCardIdx(i => i + 1)}
        />
      )}

      {mode === 'quiz' && !quizResult && (
        <QuizMode words={filtered} onFinish={(s, t) => setQuizResult({ score: s, total: t })} />
      )}

      {mode === 'quiz' && quizResult && (
        <div className="card p-10 text-center animate-slide-up">
          <div className="text-6xl font-black text-primary-600 mb-2">{quizResult.score}/{quizResult.total}</div>
          <p className="text-slate-500 mb-6">
            {quizResult.score >= quizResult.total * 0.8 ? 'Xuất sắc!' : quizResult.score >= quizResult.total * 0.5 ? 'Khá tốt, hãy tiếp tục luyện tập!' : 'Hãy ôn lại các từ này!'}
          </p>
          <button onClick={() => setQuizResult(null)} className="btn-primary mx-auto">Làm lại</button>
        </div>
      )}

      {mode === 'list' && (
        <div className="space-y-3">
          {filtered.map(w => (
            <div key={w.id} className={clsx('card p-4 flex items-start gap-4 transition-all', known.has(w.id) && 'opacity-60')}>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 dark:text-white">{w.word}</h3>
                  <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">{w.level}</span>
                  <span className="badge bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">{w.topic}</span>
                  {known.has(w.id) && <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Đã thuộc</span>}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{w.definition}</p>
                <p className="text-xs text-slate-400 italic mt-1">"{w.example}"</p>
              </div>
              <button onClick={() => setKnown(s => { const n = new Set(s); n.has(w.id) ? n.delete(w.id) : n.add(w.id); return n })}>
                <Check className={clsx('w-5 h-5', known.has(w.id) ? 'text-green-500' : 'text-slate-300')} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
