'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AnimatedButton } from '@/components/auth/animated-button'
import { toast } from 'sonner'
import { getSmartReaction } from '@/lib/microcopy'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useExpenses } from '@/components/expense-provider'
import { Plus } from 'lucide-react'
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@/lib/constants'
import type { ExpenseCategory, PaymentMethod, RecurringFrequency } from '@/lib/types'

interface AddExpenseDialogProps {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function AddExpenseDialog({ defaultOpen, onOpenChange, trigger }: AddExpenseDialogProps) {
  const { addExpense, user, budgets } = useExpenses()
  const [open, setOpen] = useState(defaultOpen ?? false)
  const [streak, setStreak] = useState(0)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('food')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>('monthly')

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return

    const parsedAmount = parseFloat(amount)
    
    // Evaluate Budget & Streak constraints
    const budgetForCategory = budgets.find(b => b.category === category)
    const budgetLimit = budgetForCategory ? budgetForCategory.limit : (user.monthlyBudget * 0.2)
    const ratio = parsedAmount / budgetLimit
    
    let currentStreak = streak
    if (ratio >= 0.3) {
      currentStreak += 1
      setStreak(currentStreak)
    } else {
      currentStreak = 0
      setStreak(0)
    }

    addExpense({
      amount: parsedAmount,
      description: description.trim() || CATEGORY_LABELS[category],
      category,
      paymentMethod,
      date,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
    })

    const reaction = getSmartReaction(category, parsedAmount, budgetLimit, currentStreak)

    toast.custom((t) => (
      <div 
        className={cn(
          "flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-2xl shadow-xl w-[356px] transition-all",
          reaction.tone === 'danger' && "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 dark:bg-red-950/50",
          reaction.tone === 'warning' && "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 dark:bg-amber-950/50",
          reaction.tone === 'success' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-950/50"
        )}
      >
        <div className={cn(
          "flex items-center justify-center text-3xl h-12 w-12 shrink-0 rounded-full shadow-inner",
          reaction.tone === 'danger' && "bg-red-500/20",
          reaction.tone === 'warning' && "bg-amber-500/20",
          reaction.tone === 'success' && "bg-emerald-500/20"
        )}>
          <span className={reaction.tone === 'danger' ? "animate-bounce" : ""}>{reaction.emoji}</span>
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-bold text-sm leading-tight text-foreground">Expense Added!</span>
          <span className="text-[13px] font-medium opacity-90 leading-tight mt-0.5">{reaction.message}</span>
        </div>
      </div>
    ))

    // Reset form
    setAmount('')
    setDescription('')
    setCategory('food')
    setPaymentMethod('upi')
    setDate(new Date().toISOString().split('T')[0])
    setIsRecurring(false)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({user.currency})</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl font-bold h-14"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(CATEGORY_ICONS) as ExpenseCategory[]).map((cat) => {
                const Icon = CATEGORY_ICONS[cat]
                return (
                  <Button
                    key={cat}
                    type="button"
                    variant={category === cat ? 'default' : 'outline'}
                    className="flex flex-col h-16 gap-1 px-2"
                    onClick={() => setCategory(cat)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[10px] capitalize">{cat}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                <SelectTrigger id="payment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="recurring">Recurring Expense</Label>
              <p className="text-xs text-muted-foreground">
                Mark as recurring payment
              </p>
            </div>
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
          </div>

          {isRecurring && (
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={recurringFrequency} onValueChange={(v) => setRecurringFrequency(v as RecurringFrequency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <AnimatedButton type="submit" className="w-full">
            Add Expense
          </AnimatedButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}
