'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useExpenses } from '@/components/expense-provider'
import { getCategoryIcon, getCategoryLabel } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import { AlertTriangle, Ghost } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { getBudgetMessage } from '@/lib/microcopy'

export function BudgetProgress() {
  const { budgets, user } = useExpenses()

  if (budgets.length === 0) {
    return (
      <Card className="h-full border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl rounded-[2rem] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div 
              animate={{ y: [-5, 5, -5] }} 
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 shadow-inner mb-4"
            >
              <Ghost className="h-8 w-8 text-muted-foreground" />
            </motion.div>
            <p className="mt-2 text-base font-semibold">No budgets set</p>
            <p className="mt-1 text-sm text-muted-foreground">
              No limits? Your wallet must be so happy ✨
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl rounded-[2rem] shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Budget Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgets.map((budget, i) => {
            const Icon = getCategoryIcon(budget.category)
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
            const isOverBudget = budget.spent > budget.limit
            const isNearLimit = percentage >= 80 && !isOverBudget
            const message = getBudgetMessage((budget.spent / budget.limit) * 100)

            return (
              <motion.div 
                key={budget.id} 
                className="space-y-2 p-3 rounded-2xl transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                initial={{ opacity: 0, x: -20 }}
                animate={isOverBudget ? { opacity: 1, x: [-2, 2, -2, 2, 0] } : { opacity: 1, x: 0 }}
                transition={isOverBudget ? { duration: 0.4, delay: i * 0.1 } : { delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl shadow-sm',
                      isOverBudget ? 'bg-red-500/20 text-red-500' :
                      isNearLimit ? 'bg-amber-500/20 text-amber-500' :
                      'bg-violet-500/20 text-violet-500'
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">
                        {getCategoryLabel(budget.category)}
                      </span>
                      {isOverBudget ? (
                        <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> {message}
                        </span>
                      ) : isNearLimit ? (
                        <span className="text-[10px] text-amber-500 font-medium">{message}</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">{message}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className={cn(
                      'font-bold',
                      isOverBudget && 'text-red-500'
                    )}>
                      {formatCurrency(budget.spent, user.currency)}
                    </span>
                    <span className="text-muted-foreground font-medium">
                      / {formatCurrency(budget.limit, user.currency)}
                    </span>
                  </div>
                </div>
                <div className="h-3 w-full rounded-full bg-foreground/5 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, type: "spring", bounce: 0.2 }}
                    className={cn(
                      'h-full rounded-full transition-colors duration-500 shadow-[0_0_10px_rgba(0,0,0,0.2)]',
                      isOverBudget ? 'bg-red-500 shadow-red-500/50' :
                      isNearLimit ? 'bg-amber-500 shadow-amber-500/50' :
                      'bg-gradient-to-r from-violet-500 to-pink-500'
                    )}
                  />
                </div>
              </motion.div>
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
