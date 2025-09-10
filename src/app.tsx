import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Loader2 } from 'lucide-react'
import { Toaster } from './components/ui/sonner'
import Layout from './components/layout/Layout'
import Index from './pages/index'
import KeywordAnalysis from './pages/KeywordAnalysis'

const loading = (
  <div className="flex min-h-screen items-center justify-center">
    <Loader2 className="text-primary h-8 w-8 animate-spin" />
  </div>
)

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <Suspense fallback={loading}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/analise-de-keywords" element={<KeywordAnalysis />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </ThemeProvider>
  )
}

export { App }
