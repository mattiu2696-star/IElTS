import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import WritingPage from './pages/WritingPage'
import WritingExercisePage from './pages/WritingExercisePage'
import VocabularyPage from './pages/VocabularyPage'
import ReadingPage from './pages/ReadingPage'
import ListeningPage from './pages/ListeningPage'
import AnalyticsPage from './pages/AnalyticsPage'
import LessonsPage from './pages/LessonsPage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="writing" element={<WritingPage />} />
            <Route path="writing/:id" element={<WritingExercisePage />} />
            <Route path="vocabulary" element={<VocabularyPage />} />
            <Route path="reading" element={<ReadingPage />} />
            <Route path="listening" element={<ListeningPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="lessons" element={<LessonsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
