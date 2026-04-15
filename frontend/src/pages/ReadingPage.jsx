import { BookOpen, Headphones, Clock } from 'lucide-react'

export default function ReadingPage() {
  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <div className="card p-12 text-center">
        <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reading Module</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Academic and General Training passages with timed practice, question types, and instant feedback. Coming soon!
        </p>
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400">
          <Clock className="w-4 h-4" /> In Development
        </div>
      </div>
    </div>
  )
}
