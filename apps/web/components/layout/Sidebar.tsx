import Link from 'next/link'
import { Activity, LayoutDashboard, UserPlus, Settings, Stethoscope } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/intake', label: 'New Patient', icon: UserPlus },
  { href: '/admin/queues', label: 'Job Queues', icon: Activity, external: true },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn('flex flex-col w-64 bg-white border-r border-border h-screen', className)}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">MedFlow AI</p>
          <p className="text-xs text-muted-foreground">Patient Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer disclaimer */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground leading-tight">
          ⚠️ PoC only — not for clinical use. No real patient data is processed.
        </p>
      </div>
    </aside>
  )
}
