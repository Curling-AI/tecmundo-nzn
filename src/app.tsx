import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Loader2 } from 'lucide-react'
import { Toaster as SonnerToaster } from './components/ui/sonner'
import { Toaster } from './components/ui/toaster'
import { ToastProvider } from './components/ui/toast'
import Layout from './components/layout/Layout'
import Index from './pages/index'
import KeywordAnalysis from './pages/KeywordAnalysis'
import NotFound from './pages/NotFound'
import CompetitorAnalysisLayout from './pages/competitor-analysis/Layout'
import Comparative from './pages/competitor-analysis/Comparative'
import Ranking from './pages/competitor-analysis/Ranking'
import Traffic from './pages/competitor-analysis/Traffic'
import About from './pages/About'
import Sources from './pages/Sources'

const loading = (
  <div className="flex min-h-screen items-center justify-center">
    <Loader2 className="text-primary h-8 w-8 animate-spin" />
  </div>
)

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <ToastProvider>
          <Suspense fallback={loading}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/analise-de-keywords" element={<KeywordAnalysis />} />
                <Route path="/fontes" element={<Sources />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/analise-de-concorrentes" element={<CompetitorAnalysisLayout />}>
                  <Route path="comparativo" element={<Comparative />} />
                  <Route path="ranking" element={<Ranking />} />
                  <Route path="trafego" element={<Traffic />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
          <SonnerToaster duration={5000} richColors />
        </ToastProvider>
      </Router>
    </ThemeProvider>
  )
}

export { App }
