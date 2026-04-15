import { Headphones, Clock } from 'lucide-react'

export default function ListeningPage() {
  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <div className="card p-12 text-center">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Headphones className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Luyện Listening</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Bài nghe kèm transcript, các dạng câu hỏi (trắc nghiệm, nối, điền từ) và lựa chọn độ khó. Sắp ra mắt!
        </p>
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400">
          <Clock className="w-4 h-4" /> Đang phát triển
        </div>
      </div>
    </div>
  )
}
