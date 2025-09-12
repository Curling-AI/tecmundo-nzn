import { Link, useLocation } from 'react-router-dom'
import { Search, Star, Trophy, TrendingUp, LineChart } from 'lucide-react'
import { cn } from '@/lib/utils'

const contentNavItems = [
  { href: '/', label: 'Artigos', icon: Star },
  { href: '/analise-de-keywords', label: 'Keywords', icon: Search },
]


const competitorNavItems = [
  {
    href: '/analise-de-concorrentes/ranking',
    label: 'Ranking',
    icon: Trophy,
  },
  {
    href: '/analise-de-concorrentes/trafego',
    label: 'Tráfego',
    icon: TrendingUp,
  },
  {
    href: '/analise-de-concorrentes/comparativo',
    label: 'Comparativo',
    icon: LineChart,
  },
]

const NavLink = ({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: React.ElementType
}) => {
  const location = useLocation()
  const isActive = location.pathname === href

  return (
    <Link
      to={href}
      className={cn(
        'text-primary-foreground/70 hover:bg-primary-hover hover:text-primary-foreground flex items-center gap-3 rounded-md px-3 py-2 transition-all',
        { 'bg-primary-hover text-primary-foreground': isActive },
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="font-semibold">{label}</span>
    </Link>
  )
}

export const SidebarContent = () => {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="border-primary-hover flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/" className="text-primary-foreground flex items-center gap-2 font-bold">
          <img
            src="https://www.tecmundo.com.br/icons/site/logo-tecmundo-main.svg"
            alt="TecMundo Logo"
            className="h-[1.7rem] w-auto brightness-0 invert filter"
          />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
          <h3 className="text-primary-foreground/50 px-3 pt-4 pb-2 text-xs font-semibold tracking-wider uppercase">
            Conteúdo
          </h3>
          {contentNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}

          
          <h3 className="px-3 pt-4 pb-2 text-xs font-semibold uppercase text-primary-foreground/50 tracking-wider">
            Concorrentes
          </h3>
          {competitorNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
          
        </nav>
      </div>
    </div>
  )
}
