import { useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Home, Info, Github, PlayCircle, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { useMainLayoutState } from '@/store'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

const mainNavItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Start Using',
    href: '/start',
    icon: PlayCircle,
  },
  {
    title: 'About',
    href: '/about',
    icon: Info,
  },
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { mainSidebarOpen, setMainSidebarOpen } = useMainLayoutState()
  const location = useLocation()
  const isMobile = useIsMobile()
  const { theme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600/10 via-blue-500/10 to-teal-400/10">
      {/* Header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container mx-auto">
          <div className="flex h-14 items-center justify-between px-4 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Sheet open={mainSidebarOpen} onOpenChange={setMainSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size={isMobile ? 'sm' : 'icon'} className="md:hidden">
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80vw] max-w-[280px] p-0">
                  <div className="flex flex-col gap-3 p-4 sm:p-6">
                    <SheetTitle className="flex items-center gap-2">
                      <img src="/vite.svg" alt="Logo" className="h-5 w-5 sm:h-6 sm:w-6" />
                      <Link to="/" className="text-sm font-semibold sm:text-base">
                        SBC Starter Kit
                      </Link>
                    </SheetTitle>
                    <Separator />
                    <nav className="flex flex-col gap-1 sm:gap-2">
                      {mainNavItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setMainSidebarOpen(false)}
                            className={cn(
                              'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors sm:px-3 sm:py-2',
                              location.pathname === item.href
                                ? 'bg-secondary text-secondary-foreground'
                                : 'hover:bg-secondary/80',
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        )
                      })}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <div className="flex items-center gap-2">
                <img src="/vite.svg" alt="Logo" className="h-5 w-5 sm:h-6 sm:w-6" />
                <Link to="/" className="hidden text-sm font-semibold sm:text-base md:inline-block">
                  SBC Starter Kit
                </Link>
              </div>

              {/* Desktop Navigation */}
              <NavigationMenu className="hidden md:ml-4 md:flex lg:ml-6">
                <NavigationMenuList className="gap-1 lg:gap-2">
                  {mainNavItems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'px-3 lg:px-4',
                          location.pathname === item.href &&
                            'bg-secondary text-secondary-foreground',
                        )}
                        asChild
                      >
                        <Link to={item.href}>{item.title}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right side actions */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="mr-1"
                title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span className="sr-only">
                  {theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                </span>
              </Button>
              <Button
                variant="ghost"
                size={!isMobile ? 'sm' : 'icon'}
                asChild
                className="px-2 sm:px-3"
              >
                <a
                  href="https://github.com/m4n3z40/sbc-cursor-starter-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden text-sm sm:inline-block">GitHub</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">{children}</main>
    </div>
  )
}
