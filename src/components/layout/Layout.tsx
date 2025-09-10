import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { cn } from '@/lib/utils'

export default function Layout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className={cn('flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6', 'bg-background')}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
