'use client'

import { useState } from 'react'
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [isCollapsed, setIsCollapsed] = useState(false)

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
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card/80 backdrop-blur-2xl transition-all duration-300 md:static md:translate-x-0',
          isCollapsed ? 'w-20' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500"
            >
              SpendWise
            </motion.span>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full transition-all duration-200',
                  isCollapsed ? 'justify-center px-0 h-12 rounded-xl' : 'justify-start gap-4 px-4 h-12 rounded-xl',
                  isActive && 'bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20'
                )}
                asChild
                onClick={() => {
                  if (window.innerWidth < 768) onClose()
                }}
              >
                <Link href={item.href}>
                  <Icon className={cn("shrink-0", isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} />
                  {!isCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
                </Link>
              </Button>
            )
          })}
        </nav>

        <div className="mt-auto border-t p-4 flex flex-col gap-4">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 p-4 border border-white/20 dark:border-white/5"
              >
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-pink-500" />
                  <span className="text-sm font-bold text-foreground">Pro Tip ✨</span>
                </div>
                <p className="mt-2 text-xs font-medium text-foreground/70 leading-relaxed">
                  Set monthly budgets for each category to stay firmly on track with your finances!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="button"
            variant="ghost"
            className={cn(
              "w-full text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all h-12 relative z-[60] cursor-pointer",
              isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-4"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsCollapsed((prev) => !prev);
            }}
          >
            {isCollapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-5 w-5" />}
            {!isCollapsed && <span className="font-semibold text-sm">Collapse</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
