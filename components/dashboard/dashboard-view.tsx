'use client'

import { StatsCards } from './stats-cards'
import { RecentExpenses } from './recent-expenses'
import { SpendingChart } from './spending-chart'
import { BudgetProgress } from './budget-progress'
import { AddExpenseDialog } from './add-expense-dialog'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.4 } },
}

export function DashboardView() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500 dark:from-violet-400 dark:to-pink-400">Dashboard</h2>
          <p className="text-base text-muted-foreground font-medium">
            Track your expenses and stay on budget ✨
          </p>
        </div>
        <AddExpenseDialog />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatsCards />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <SpendingChart />
        </motion.div>
        <motion.div variants={itemVariants}>
          <BudgetProgress />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <RecentExpenses />
      </motion.div>
    </motion.div>
  )
}

