'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useExpenses } from '@/components/expense-provider'
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import type { ExpenseCategory, Budget } from '@/lib/types'
import {
  Plus,
  Edit2,
  AlertTriangle,
  TrendingDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function BudgetsPage() {
  const { budgets, user, updateBudget, addBudget, updateUser } = useExpenses()
  const [isAddingBudget, setIsAddingBudget] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [newBudgetCategory, setNewBudgetCategory] = useState<ExpenseCategory>('food')
  const [newBudgetLimit, setNewBudgetLimit] = useState('')
  const [newBudgetPeriod, setNewBudgetPeriod] = useState<'weekly' | 'monthly'>('monthly')
  const [monthlyBudget, setMonthlyBudget] = useState(user.monthlyBudget.toString())
  const [isEditingMonthly, setIsEditingMonthly] = useState(false)

  const existingCategories = budgets.map(b => b.category)
  const availableCategories = (Object.keys(CATEGORY_ICONS) as ExpenseCategory[])
    .filter(cat => !existingCategories.includes(cat))

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)

  const handleAddBudget = () => {
    if (!newBudgetLimit) return
    addBudget({
      category: newBudgetCategory,
      limit: parseFloat(newBudgetLimit),
      period: newBudgetPeriod,
    })
    setNewBudgetLimit('')
    setNewBudgetCategory(availableCategories[0] || 'other')
    setIsAddingBudget(false)
  }

  const handleUpdateBudget = () => {
    if (!editingBudget || !newBudgetLimit) return
    updateBudget(editingBudget.id, {
      limit: parseFloat(newBudgetLimit),
      period: newBudgetPeriod,
    })
    setEditingBudget(null)
    setNewBudgetLimit('')
  }

  const handleSaveMonthlyBudget = () => {
    updateUser({ monthlyBudget: parseFloat(monthlyBudget) || 0 })
    setIsEditingMonthly(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Budgets</h2>
          <p className="text-sm text-muted-foreground">
            Set and manage your spending limits
          </p>
        </div>
        {availableCategories.length > 0 && (
          <Dialog open={isAddingBudget} onOpenChange={setIsAddingBudget}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newBudgetCategory} onValueChange={(v) => setNewBudgetCategory(v as ExpenseCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Limit ({user.currency})</Label>
                  <Input
                    type="number"
                    placeholder="Enter budget limit"
                    value={newBudgetLimit}
                    onChange={(e) => setNewBudgetLimit(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Period</Label>
                  <Select value={newBudgetPeriod} onValueChange={(v) => setNewBudgetPeriod(v as 'weekly' | 'monthly')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddBudget} className="w-full">
                  Add Budget
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Overall Budget Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Overall Monthly Budget</CardTitle>
              <CardDescription>Your total spending limit for the month</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingMonthly(!isEditingMonthly)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingMonthly ? (
            <div className="flex gap-2">
              <Input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={handleSaveMonthlyBudget}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditingMonthly(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{formatCurrency(user.monthlyBudget, user.currency)}</span>
                <span className="mb-1 text-muted-foreground">/ month</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Total Budgeted</p>
                  <p className="text-lg font-semibold">{formatCurrency(totalBudgeted, user.currency)}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="text-lg font-semibold">{formatCurrency(totalSpent, user.currency)}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className={cn(
                    "text-lg font-semibold",
                    user.monthlyBudget - totalSpent < 0 && "text-destructive"
                  )}>
                    {formatCurrency(Math.max(user.monthlyBudget - totalSpent, 0), user.currency)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Budgets */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const Icon = CATEGORY_ICONS[budget.category]
          const percentage = (budget.spent / budget.limit) * 100
          const isOverBudget = budget.spent > budget.limit
          const isNearLimit = percentage >= 80 && !isOverBudget
          const remaining = budget.limit - budget.spent

          return (
            <Card key={budget.id} className={cn(
              "relative overflow-hidden",
              isOverBudget && "border-destructive/50"
            )}>
              <div className={cn(
                "absolute top-0 left-0 h-1 w-full",
                CATEGORY_COLORS[budget.category]
              )} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      isOverBudget ? "bg-destructive/10 text-destructive" :
                      isNearLimit ? "bg-warning/10 text-warning-foreground" :
                      "bg-primary/10 text-primary"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {CATEGORY_LABELS[budget.category]}
                      </CardTitle>
                      <CardDescription className="text-xs capitalize">
                        {budget.period}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingBudget(budget)
                      setNewBudgetLimit(budget.limit.toString())
                      setNewBudgetPeriod(budget.period)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold">{formatCurrency(budget.spent, user.currency)}</p>
                      <p className="text-xs text-muted-foreground">
                        of {formatCurrency(budget.limit, user.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      {isOverBudget ? (
                        <div className="flex items-center gap-1 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">Over by {formatCurrency(Math.abs(remaining), user.currency)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-accent">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-sm font-medium">{formatCurrency(remaining, user.currency)} left</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isOverBudget ? "bg-destructive" :
                        isNearLimit ? "bg-warning" :
                        CATEGORY_COLORS[budget.category]
                      )}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {percentage.toFixed(0)}% used
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit Budget Dialog */}
      <Dialog open={!!editingBudget} onOpenChange={(open) => !open && setEditingBudget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          {editingBudget && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = CATEGORY_ICONS[editingBudget.category]
                  return <Icon className="h-5 w-5" />
                })()}
                <span className="font-medium">{CATEGORY_LABELS[editingBudget.category]}</span>
              </div>
              <div className="space-y-2">
                <Label>New Limit ({user.currency})</Label>
                <Input
                  type="number"
                  value={newBudgetLimit}
                  onChange={(e) => setNewBudgetLimit(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Period</Label>
                <Select value={newBudgetPeriod} onValueChange={(v) => setNewBudgetPeriod(v as 'weekly' | 'monthly')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateBudget} className="w-full">
                Update Budget
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
