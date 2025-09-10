import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, RouteProps } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Loader2 } from 'lucide-react'
import { Toaster } from './components/ui/sonner'

const routes: RouteProps[] = [
  {
    index: true,
    path: '/',
    Component: lazy(() => import('./pages/index')),
  },
]

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
            {routes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
          </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </ThemeProvider>
  )
}

export { App }
