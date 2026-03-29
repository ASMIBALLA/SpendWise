'use client'

import { StatsCards } from './stats-cards'
import { RecentExpenses } from './recent-expenses'
import { SpendingChart } from './spending-chart'
import { BudgetProgress } from './budget-progress'
import { AddExpenseDialog } from './add-expense-dialog'

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Track your expenses and stay on budget
          </p>
        </div>
        <AddExpenseDialog />
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingChart />
        <BudgetProgress />
      </div>

      <RecentExpenses />
    </div>
  )
}
