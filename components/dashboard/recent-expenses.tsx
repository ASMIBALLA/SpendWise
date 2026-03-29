'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useExpenses } from '@/components/expense-provider'
import { CATEGORY_LABELS } from '@/lib/constants'
import { CATEGORY_ICONS, CATEGORY_ICON_COLORS, PAYMENT_ICONS } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import { RefreshCw, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface RecentExpensesProps {
  limit?: number
  showAll?: boolean
}

export function RecentExpenses({ limit = 5, showAll = false }: RecentExpensesProps) {
  const { expenses, deleteExpense, user } = useExpenses()
  const displayedExpenses = showAll ? expenses : expenses.slice(0, limit)

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ReceiptIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">No expenses yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Start tracking your spending by adding an expense
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Expenses</CardTitle>
        {!showAll && expenses.length > limit && (
          <span className="text-xs text-muted-foreground">
            Showing {limit} of {expenses.length}
          </span>
        )}
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <div className="space-y-2">
          {displayedExpenses.map((expense) => {
            const CategoryIcon = CATEGORY_ICONS[expense.category]
            const PaymentIcon = PAYMENT_ICONS[expense.paymentMethod]
            return (
              <div
                key={expense.id}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors group"
              >
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', CATEGORY_ICON_COLORS[expense.category])}>
                  <CategoryIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{expense.description}</p>
                    {expense.isRecurring && (
                      <RefreshCw className="h-3 w-3 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{CATEGORY_LABELS[expense.category]}</span>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <PaymentIcon className="h-3 w-3" />
                      <span className="capitalize">{expense.paymentMethod}</span>
                    </div>
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(expense.date), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {formatCurrency(expense.amount, user.currency)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    onClick={() => deleteExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete expense</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function ReceiptIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  )
}
