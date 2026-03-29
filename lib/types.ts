export interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  description: string
  date: string
  paymentMethod: PaymentMethod
  isRecurring: boolean
  recurringFrequency?: RecurringFrequency
}

export interface Income {
  id: string
  amount: number
  source: string
  description?: string
  date: string
  isRecurring: boolean
  recurringFrequency?: RecurringFrequency
}

export interface RecurringRule {
  id: string
  type: 'expense' | 'income'
  amount: number
  category?: ExpenseCategory
  source?: string
  description: string
  paymentMethod?: PaymentMethod
  frequency: RecurringFrequency
  nextDate: string
  isActive: boolean
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'education'
  | 'health'
  | 'other'

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet'

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly'

export interface Budget {
  id: string
  category: ExpenseCategory
  limit: number
  spent: number
  period: 'weekly' | 'monthly'
}

export interface User {
  id: string
  name: string
  email: string
  monthlyBudget: number
  currency: string
}
