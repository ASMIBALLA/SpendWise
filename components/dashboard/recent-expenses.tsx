'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useExpenses } from '@/components/expense-provider'
import { getCategoryIcon, getCategoryLabel, getCategoryIconColor, PAYMENT_ICONS } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import { RefreshCw, Trash2, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { getEmptyStateMessage } from '@/lib/microcopy'

interface RecentExpensesProps {
  limit?: number
  showAll?: boolean
}

export function RecentExpenses({ limit = 5, showAll = false }: RecentExpensesProps) {
  const { expenses, deleteExpense, user } = useExpenses()
  const displayedExpenses = showAll ? expenses : expenses.slice(0, limit)

  if (expenses.length === 0) {
    return (
      <Card className="border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl rounded-[2rem] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div 
              animate={{ rotate: [-10, 10, -10], scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 shadow-inner mb-4"
            >
              <PartyPopper className="h-8 w-8 text-pink-500" />
            </motion.div>
            <p className="mt-2 text-base font-semibold">Clean Slate!</p>
            <p className="mt-1 text-sm text-foreground/60 font-medium max-w-[200px]">
              {getEmptyStateMessage()}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl rounded-[2rem] shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Recent Expenses</CardTitle>
        {!showAll && expenses.length > limit && (
          <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            Showing {limit} of {expenses.length}
          </span>
        )}
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="space-y-3">
          <AnimatePresence>
            {displayedExpenses.map((expense, i) => {
              const CategoryIcon = getCategoryIcon(expense.category)
              const PaymentIcon = PAYMENT_ICONS[expense.paymentMethod]
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                  whileHover={{ scale: 1.02, x: 5, backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className="flex items-center gap-4 rounded-2xl p-3 border border-transparent hover:border-border/50 transition-all group dark:hover:bg-white/5 cursor-pointer shadow-sm"
                >
                  <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-inner', getCategoryIconColor(expense.category))}>
                    <CategoryIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold truncate">{expense.description}</p>
                      {expense.isRecurring && (
                        <RefreshCw className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <span>{getCategoryLabel(expense.category)}</span>
                      <span className="opacity-50">•</span>
                      <div className="flex items-center gap-1 text-foreground/70">
                        <PaymentIcon className="h-3 w-3" />
                        <span className="capitalize">{expense.paymentMethod}</span>
                      </div>
                      <span className="opacity-50">•</span>
                      <span>{formatDistanceToNow(new Date(expense.date), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pr-2">
                    <span className="text-lg font-extrabold tracking-tight">
                      {formatCurrency(expense.amount, user.currency)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteExpense(expense.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete expense</span>
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
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
