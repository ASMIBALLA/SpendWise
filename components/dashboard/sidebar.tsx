'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  TrendingUp,
  X,
  DollarSign,
  Settings,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'expenses', label: 'Expenses', icon: Receipt, href: '/expenses' },
  { id: 'budgets', label: 'Budgets', icon: Target, href: '/budgets' },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, href: '/analytics' },
  { id: 'income', label: 'Income', icon: DollarSign, href: '/income' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4 md:hidden">
          <span className="text-lg font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
                )}
                asChild
                onClick={onClose}
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <div className="rounded-lg bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Pro Tips</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Set monthly budgets for each category to stay on track with your finances.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
