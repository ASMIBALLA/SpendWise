'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useExpenses } from '@/components/expense-provider'
import { TrendingUp, TrendingDown, Wallet, Target, Receipt, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'

import { motion } from 'framer-motion'

export function StatsCards() {
  const { getTotalSpent, user, budgets, expenses } = useExpenses()

  const monthlySpent = getTotalSpent('month')
  const weeklySpent = getTotalSpent('week')
  const todaySpent = getTotalSpent('today')
  const remaining = user.monthlyBudget - monthlySpent
  const percentUsed = (monthlySpent / user.monthlyBudget) * 100

  // Count budgets that are over limit
  const overBudgetCount = budgets.filter(b => b.spent > b.limit).length

  const stats = [
    {
      title: 'Monthly Spent',
      value: formatCurrency(monthlySpent, user.currency),
      subtitle: `of ${formatCurrency(user.monthlyBudget, user.currency)}`,
      icon: Wallet,
      trend: percentUsed > 80 ? 'warning' : 'normal',
      progress: Math.min(percentUsed, 100),
    },
    {
      title: 'Remaining',
      value: formatCurrency(Math.max(remaining, 0), user.currency),
      subtitle: remaining < 0 ? 'Over budget!' : 'left this month',
      icon: Target,
      trend: remaining < 0 ? 'danger' : remaining < user.monthlyBudget * 0.2 ? 'warning' : 'success',
    },
    {
      title: 'This Week',
      value: formatCurrency(weeklySpent, user.currency),
      subtitle: `${expenses.filter(e => {
        const d = new Date(e.date)
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        return d >= startOfWeek
      }).length} transactions`,
      icon: Receipt,
      trend: 'normal',
    },
    {
      title: 'Today',
      value: formatCurrency(todaySpent, user.currency),
      subtitle: overBudgetCount > 0 ? `${overBudgetCount} budget${overBudgetCount > 1 ? 's' : ''} exceeded` : 'Looking good! ✨',
      icon: overBudgetCount > 0 ? AlertCircle : TrendingUp,
      trend: overBudgetCount > 0 ? 'danger' : 'success',
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <motion.div 
            key={stat.title}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Card className="overflow-hidden border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl rounded-[2rem] shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] h-full">
              <CardContent className="p-4 md:p-6 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs md:text-sm text-foreground/70 font-medium truncate">{stat.title}</p>
                    <p className="mt-1 text-xl md:text-3xl font-extrabold tracking-tight truncate">{stat.value}</p>
                    <p className={cn(
                      "mt-1 text-xs font-semibold truncate",
                      stat.trend === 'danger' && "text-red-500",
                      stat.trend === 'warning' && "text-amber-500",
                      stat.trend === 'success' && "text-emerald-500",
                      stat.trend === 'normal' && "text-foreground/60"
                    )}>
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={cn(
                    "flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full shadow-inner",
                    stat.trend === 'danger' && "bg-red-500/20 text-red-500",
                    stat.trend === 'warning' && "bg-amber-500/20 text-amber-500",
                    stat.trend === 'success' && "bg-emerald-500/20 text-emerald-500",
                    stat.trend === 'normal' && "bg-violet-500/20 text-violet-500"
                  )}>
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                </div>
                {stat.progress !== undefined && (
                  <div className="mt-4">
                    <div className="h-2 w-full rounded-full bg-foreground/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.progress}%` }}
                        transition={{ duration: 1, type: "spring" }}
                        className={cn(
                          "h-full rounded-full transition-colors duration-500 shadow-sm",
                          stat.progress > 80 ? "bg-red-500" : "bg-gradient-to-r from-violet-500 to-pink-500"
                        )}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
