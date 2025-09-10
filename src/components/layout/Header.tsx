import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SidebarContent } from '@/components/layout/SidebarContent'
import { DateRangePicker } from '@/components/DateRangePicker'

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/analise-de-concorrentes')) {
    if (pathname.endsWith('/ranking')) return 'Ranking de Concorrentes'
    if (pathname.endsWith('/trafego')) return 'Tráfego de Concorrentes'
    if (pathname.endsWith('/comparativo')) return 'Comparativo de Keywords'
    return 'Análise de Concorrentes'
  }

  switch (pathname) {
    case '/':
      return 'Artigos'
    case '/analise-de-keywords':
      return 'Keywords'
    default:
      return 'TecMundo Feed Score'
  }
}

export const Header = () => {
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <header className="bg-card shadow-header sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-primary text-primary-foreground flex w-72 flex-col border-r-0 p-0"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <DateRangePicker />
      </div>
    </header>
  )
}
