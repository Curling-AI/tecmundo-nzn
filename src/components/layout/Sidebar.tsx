import { SidebarContent } from '@/components/layout/SidebarContent'

export const Sidebar = () => {
  return (
    <aside className="border-primary-hover bg-primary text-primary-foreground hidden w-64 border-r md:block">
      <SidebarContent />
    </aside>
  )
}
