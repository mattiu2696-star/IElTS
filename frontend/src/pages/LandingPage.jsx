import { Link } from 'react-router-dom'
import {
  GraduationCap, PenLine, BookOpen, Headphones, BarChart2,
  CheckCircle2, ChevronRight, Star, Zap, Brain, Trophy,
  Users, TrendingUp, Clock, Globe2
} from 'lucide-react'

const features = [
  {
    icon: PenLine,
    color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    title: 'AI Writing Grader',
    desc: 'Nộp bài viết và nhận điểm IELTS thực tế từ Claude AI — phân tích chi tiết 4 tiêu chí, highlight lỗi sai, và gợi ý cải thiện cụ thể.',
  },
  {
    icon: BookOpen,
    color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    title: 'Vocabulary Spaced Repetition',
    desc: 'Học từ vựng học thuật theo thuật toán lặp cách quãng. Từ dễ quên sẽ xuất hiện thường xuyên hơn để não bạn ghi nhớ lâu dài.',
  },
  {
    icon: BarChart2,
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    title: 'Progress Analytics',
    desc: 'Theo dõi band score theo từng tuần, xem chi tiết điểm 4 kỹ năng và biểu đồ thời gian học hàng ngày.',
  },
  {
    icon: Headphones,
    color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    title: 'Listening & Reading',
    desc: 'Luyện đề Listening và Reading chuẩn IELTS với timer, tự động chấm điểm và giải thích đáp án chi tiết.',
  },
]

const stats = [
  { icon: Users,     value: '10,000+', label: 'Học viên' },
  { icon: Trophy,    value: '7.2',     label: 'Band trung bình sau 3 tháng' },
  { icon: PenLine,   value: '50,000+', label: 'Bài viết được chấm' },
  { icon: Clock,     value: '2M+ phút', label: 'Thời gian học tích lũy' },
]

const testimonials = [
  {
    name: 'Nguyễn Minh Anh',
    score: 'Band 7.5',
    text: 'AI chấm bài rất nghiêm, không như các app khác cứ cho điểm cao. Nhờ vậy tôi biết đúng điểm thực của mình và cải thiện được.',
    avatar: 'MA',
  },
  {
    name: 'Trần Huy Hoàng',
    score: 'Band 7.0',
    text: 'Phần từ vựng spaced repetition rất hiệu quả. Sau 2 tháng tôi nhớ được 800+ từ học thuật mà không cần cố gắng nhiều.',
    avatar: 'HH',
  },
  {
    name: 'Lê Thu Thảo',
    score: 'Band 8.0',
    text: 'Dashboard theo dõi tiến độ rất rõ ràng. Tôi biết chính xác cần tập trung vào kỹ năng nào mỗi tuần.',
    avatar: 'TT',
  },
]

const plans = [
  {
    name: 'Miễn phí',
    price: '0đ',
    period: '/tháng',
    color: 'border-slate-200 dark:border-slate-700',
    btn: 'btn-secondary',
    features: ['5 bài viết AI/tháng', '100 từ vựng', 'Dashboard cơ bản', 'Luyện Reading, Listening'],
  },
  {
    name: 'Pro',
    price: '199,000đ',
    period: '/tháng',
    color: 'border-primary-500 ring-2 ring-primary-500',
    btn: 'btn-primary',
    badge: 'Phổ biến nhất',
    features: ['Không giới hạn bài viết AI', 'Toàn bộ từ vựng học thuật', 'Analytics nâng cao', 'Phân tích lỗi chi tiết', 'Ưu tiên hỗ trợ'],
  },
]

function FeatureCard({ icon: Icon, color, title, desc }) {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-md shadow-primary-200 dark:shadow-primary-900/50">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg">IELTS HUB</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">Đăng nhập</Link>
            <Link to="/signup" className="btn-primary text-sm px-4 py-2">Bắt đầu miễn phí</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20 pb-28">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            Được chấm điểm bởi Claude AI — chính xác như examiner thật
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
            Luyện IELTS thông minh<br />
            <span className="text-primary-600">với AI đồng hành</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Viết bài — nhận điểm thực tế ngay lập tức. Học từ vựng theo spaced repetition.
            Theo dõi tiến độ band score theo tuần. Tất cả trong một nền tảng.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-base px-8 py-3 flex items-center justify-center gap-2">
              Bắt đầu miễn phí
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3">
              Đăng nhập
            </Link>
          </div>

          <p className="text-xs text-slate-400 mt-4">Không cần thẻ tín dụng • Miễn phí vĩnh viễn gói cơ bản</p>
        </div>

        {/* Hero mockup */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 mt-16">
          <div className="card p-6 shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-slate-400">IELTS HUB — AI Writing Grader</span>
            </div>
            <div className="grid sm:grid-cols-5 gap-4">
              <div className="sm:col-span-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-2">Task 2 Essay</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                  In today's society, many people argue that technology has made our lives significantly easier,
                  while others believe it has created more problems than it has solved. This essay will discuss
                  both perspectives before presenting a reasoned conclusion...
                </p>
              </div>
              <div className="sm:col-span-2 space-y-3">
                {[
                  { label: 'Overall Band', value: '6.5', color: 'text-primary-600' },
                  { label: 'Task Achievement', value: '6.5', color: 'text-amber-600' },
                  { label: 'Coherence', value: '7.0', color: 'text-green-600' },
                  { label: 'Lexical Resource', value: '6.0', color: 'text-purple-600' },
                  { label: 'Grammar', value: '6.5', color: 'text-blue-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                    <span className={`text-sm font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <Icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Mọi thứ bạn cần để đạt band mục tiêu
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Từ luyện writing với AI đến học từ vựng thông minh — tất cả trong một nền tảng tích hợp.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-slate-50/80 dark:bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Cách hoạt động</h2>
            <p className="text-slate-500 dark:text-slate-400">3 bước đơn giản để bắt đầu cải thiện band score</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Brain, title: 'Tạo tài khoản', desc: 'Đăng ký miễn phí trong 30 giây. Không cần thẻ tín dụng.' },
              { step: '02', icon: PenLine, title: 'Viết và nộp bài', desc: 'Chọn đề bài, viết essay và nộp. AI sẽ chấm trong vài giây.' },
              { step: '03', icon: TrendingUp, title: 'Theo dõi tiến bộ', desc: 'Xem điểm chi tiết, lỗi sai cụ thể và cải thiện từng tuần.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                  <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded-2xl" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{step}</span>
                  <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400 relative" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Học viên nói gì?</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map(({ name, score, text, avatar }) => (
            <div key={name} className="card p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">{score}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-20 bg-slate-50/80 dark:bg-slate-800/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Bảng giá đơn giản</h2>
            <p className="text-slate-500 dark:text-slate-400">Bắt đầu miễn phí, nâng cấp khi cần</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`card p-7 relative border-2 ${plan.color}`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`${plan.btn} w-full text-center block`}>
                  {plan.name === 'Miễn phí' ? 'Bắt đầu miễn phí' : 'Dùng thử 7 ngày'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-primary-600 dark:bg-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-400/30 to-transparent" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <Globe2 className="w-12 h-12 text-primary-200 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Sẵn sàng chinh phục IELTS?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Hàng nghìn học viên đã cải thiện band score trung bình 1.5 điểm sau 3 tháng.
          </p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg shadow-primary-800/30 text-base">
            Bắt đầu ngay — Miễn phí
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">IELTS HUB</span>
          </div>
          <p className="text-sm text-slate-400">© 2025 IELTS HUB. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Điều khoản</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Bảo mật</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
