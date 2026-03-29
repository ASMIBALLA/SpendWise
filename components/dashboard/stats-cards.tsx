'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useExpenses } from '@/components/expense-provider'
import { TrendingUp, TrendingDown, Wallet, Target, Receipt, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'

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
      subtitle: overBudgetCount > 0 ? `${overBudgetCount} budget${overBudgetCount > 1 ? 's' : ''} exceeded` : 'Looking good!',
      icon: overBudgetCount > 0 ? AlertCircle : TrendingUp,
      trend: overBudgetCount > 0 ? 'danger' : 'success',
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{stat.title}</p>
                  <p className="mt-1 text-lg md:text-2xl font-bold tracking-tight truncate">{stat.value}</p>
                  <p className={cn(
                    "mt-1 text-xs truncate",
                    stat.trend === 'danger' && "text-destructive",
                    stat.trend === 'warning' && "text-warning-foreground",
                    stat.trend === 'success' && "text-accent",
                    stat.trend === 'normal' && "text-muted-foreground"
                  )}>
                    {stat.subtitle}
                  </p>
                </div>
                <div className={cn(
                  "flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full",
                  stat.trend === 'danger' && "bg-destructive/10 text-destructive",
                  stat.trend === 'warning' && "bg-warning/10 text-warning-foreground",
                  stat.trend === 'success' && "bg-accent/10 text-accent",
                  stat.trend === 'normal' && "bg-primary/10 text-primary"
                )}>
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
              </div>
              {stat.progress !== undefined && (
                <div className="mt-3">
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        stat.progress > 80 ? "bg-destructive" : "bg-primary"
                      )}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
