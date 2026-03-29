'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useExpenses } from '@/components/expense-provider'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BudgetProgress() {
  const { budgets, user } = useExpenses()

  if (budgets.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <TargetIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">No budgets set</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Set budgets to track your spending limits
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Budget Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const Icon = CATEGORY_ICONS[budget.category]
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
            const isOverBudget = budget.spent > budget.limit
            const isNearLimit = percentage >= 80 && !isOverBudget

            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'flex h-6 w-6 items-center justify-center rounded',
                      isOverBudget ? 'bg-destructive/10 text-destructive' :
                      isNearLimit ? 'bg-warning/10 text-warning-foreground' :
                      'bg-primary/10 text-primary'
                    )}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium">
                      {CATEGORY_LABELS[budget.category]}
                    </span>
                    {isOverBudget && (
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={cn(
                      'font-semibold',
                      isOverBudget && 'text-destructive'
                    )}>
                      {formatCurrency(budget.spent, user.currency)}
                    </span>
                    <span className="text-muted-foreground">
                      / {formatCurrency(budget.limit, user.currency)}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isOverBudget ? 'bg-destructive' :
                      isNearLimit ? 'bg-warning' :
                      'bg-primary'
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
