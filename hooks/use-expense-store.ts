'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Expense, Budget, User, Income, ExpenseCategory, RecurringRule } from '@/lib/types'
import {
  fetchUserData,
  syncExpense,
  syncBudget,
  syncIncome,
  syncRecurringRule,
  syncUserProfile,
} from '@/lib/actions/data'

export function useExpenseStore() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [user, setUser] = useState<User>({
    id: '1',
    name: '',
    email: '',
    monthlyBudget: 15000,
    currency: 'INR',
  })
  const [incomes, setIncomes] = useState<Income[]>([])
  const [recurringRules, setRecurringRules] = useState<RecurringRule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Calculate spent amounts for budgets
  const calculateBudgetSpent = useCallback((expenseList: Expense[], budgetList: Budget[]): Budget[] => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())

    return budgetList.map((budget) => {
      const relevantExpenses = expenseList.filter((expense) => {
        const expenseDate = new Date(expense.date)
        const isInPeriod =
          budget.period === 'monthly' ? expenseDate >= startOfMonth : expenseDate >= startOfWeek
        return expense.category === budget.category && isInPeriod
      })
      const spent = relevantExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      return { ...budget, spent }
    })
  }, [])

  // Process recurring rules — auto-create expenses/incomes for due rules
  const processRecurringRules = useCallback(
    (rules: RecurringRule[]) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      let rulesUpdated = false
      const newLocalExpenses: Expense[] = []
      const newLocalIncomes: Income[] = []

      const updatedRules = rules.map((rule) => {
        if (!rule.isActive) return rule

        const nextDate = new Date(rule.nextDate)
        nextDate.setHours(0, 0, 0, 0)

        if (nextDate > today) return rule

        // Create the transaction
        if (rule.type === 'expense' && rule.category && rule.paymentMethod) {
          const newExpense: Expense = {
            id: crypto.randomUUID(),
            amount: rule.amount,
            category: rule.category as ExpenseCategory,
            description: `${rule.description} (recurring)`,
            date: rule.nextDate,
            paymentMethod: rule.paymentMethod as any,
            isRecurring: true,
            recurringFrequency: rule.frequency as any,
          }
          newLocalExpenses.push(newExpense)
          syncExpense(newExpense)
        } else if (rule.type === 'income') {
          const newIncome: Income = {
            id: crypto.randomUUID(),
            amount: rule.amount,
            source: rule.source || 'Recurring',
            description: `${rule.description} (recurring)`,
            date: rule.nextDate,
            isRecurring: true,
            recurringFrequency: rule.frequency as any,
          }
          newLocalIncomes.push(newIncome)
          syncIncome(newIncome)
        }

        // Advance the next date
        const next = new Date(rule.nextDate)
        switch (rule.frequency) {
          case 'daily':
            next.setDate(next.getDate() + 1)
            break
          case 'weekly':
            next.setDate(next.getDate() + 7)
            break
          case 'monthly':
            next.setMonth(next.getMonth() + 1)
            break
        }

        const updatedRule = { ...rule, nextDate: next.toISOString().split('T')[0] }
        syncRecurringRule(updatedRule)
        rulesUpdated = true
        return updatedRule
      })

      if (rulesUpdated) {
        setRecurringRules(updatedRules)
      }
      if (newLocalExpenses.length > 0) {
        setExpenses((prev) => [...newLocalExpenses, ...prev])
      }
      if (newLocalIncomes.length > 0) {
        setIncomes((prev) => [...newLocalIncomes, ...prev])
      }
    },
    []
  )

  // Load data from DB on mount
  useEffect(() => {
    fetchUserData()
      .then((data) => {
        if (data) {
          setUser(data.user)
          setExpenses(data.expenses)
          // Budgets from DB don't have 'spent' calculated, so calculate it
          setBudgets(calculateBudgetSpent(data.expenses, data.budgets))
          setIncomes(data.incomes)
          setRecurringRules(data.recurringRules)
          processRecurringRules(data.recurringRules)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load user data', err)
        setIsLoading(false)
      })
  }, [calculateBudgetSpent, processRecurringRules])

  // Recalculate budgets when expenses change
  useEffect(() => {
    if (isLoading) return
    setBudgets((currentBudgets) => calculateBudgetSpent(expenses, currentBudgets))
  }, [expenses, calculateBudgetSpent, isLoading])

  // Add expense
  const addExpense = useCallback(
    (expense: Omit<Expense, 'id'>) => {
      const newExpense: Expense = {
        ...expense,
        id: crypto.randomUUID(),
      }
      setExpenses((prev) => [newExpense, ...prev])
      syncExpense(newExpense) // Background sync

      // Create recurring rule if marked as recurring
      if (expense.isRecurring && expense.recurringFrequency) {
        const nextDate = new Date(expense.date)
        switch (expense.recurringFrequency) {
          case 'daily':
            nextDate.setDate(nextDate.getDate() + 1)
            break
          case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7)
            break
          case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1)
            break
        }
        const rule: RecurringRule = {
          id: crypto.randomUUID(),
          type: 'expense',
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          paymentMethod: expense.paymentMethod,
          frequency: expense.recurringFrequency,
          nextDate: nextDate.toISOString().split('T')[0],
          isActive: true,
        }
        setRecurringRules((prev) => [...prev, rule])
        syncRecurringRule(rule) // Background sync
      }
      return newExpense
    },
    []
  )

  // Update expense
  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => {
      const updated = prev.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
      const modified = updated.find((e) => e.id === id)
      if (modified) syncExpense(modified)
      return updated
    })
  }, [])

  // Delete expense
  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => {
      const expenseToDelete = prev.find((e) => e.id === id)
      if (expenseToDelete) syncExpense(expenseToDelete, true)
      return prev.filter((exp) => exp.id !== id)
    })
  }, [])

  // Update budget
  const updateBudget = useCallback((id: string, updates: Partial<Budget>) => {
    setBudgets((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      const modified = updated.find((b) => b.id === id)
      if (modified) syncBudget(modified)
      return updated
    })
  }, [])

  // Add budget
  const addBudget = useCallback((budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget: Budget = {
      ...budget,
      id: crypto.randomUUID(),
      spent: 0,
    }
    setBudgets((prev) => [...prev, newBudget])
    syncBudget(newBudget)
  }, [])

  // Update user
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      syncUserProfile({ name: updated.name, currency: updated.currency, monthlyBudget: updated.monthlyBudget })
      return updated
    })
  }, [])

  // Add income
  const addIncome = useCallback((income: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...income,
      id: crypto.randomUUID(),
    }
    setIncomes((prev) => [newIncome, ...prev])
    syncIncome(newIncome)

    // Create recurring rule if marked as recurring
    if (income.isRecurring && income.recurringFrequency) {
      const nextDate = new Date(income.date)
      switch (income.recurringFrequency) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1)
          break
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7)
          break
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1)
          break
      }
      const rule: RecurringRule = {
        id: crypto.randomUUID(),
        type: 'income',
        amount: income.amount,
        source: income.source,
        description: income.description || income.source,
        frequency: income.recurringFrequency,
        nextDate: nextDate.toISOString().split('T')[0],
        isActive: true,
      }
      setRecurringRules((prev) => [...prev, rule])
      syncRecurringRule(rule)
    }

    return newIncome
  }, [])

  // Delete income
  const deleteIncome = useCallback((id: string) => {
    setIncomes((prev) => {
      const incomeToDelete = prev.find((i) => i.id === id)
      if (incomeToDelete) syncIncome(incomeToDelete, true)
      return prev.filter((inc) => inc.id !== id)
    })
  }, [])

  // Get expenses for a specific period
  const getExpensesByPeriod = useCallback(
    (period: 'today' | 'week' | 'month' | 'all') => {
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        switch (period) {
          case 'today':
            return expenseDate >= startOfDay
          case 'week':
            return expenseDate >= startOfWeek
          case 'month':
            return expenseDate >= startOfMonth
          default:
            return true
        }
      })
    },
    [expenses]
  )

  // Get total spent
  const getTotalSpent = useCallback(
    (period: 'today' | 'week' | 'month' | 'all') => {
      return getExpensesByPeriod(period).reduce((sum, exp) => sum + exp.amount, 0)
    },
    [getExpensesByPeriod]
  )

  // Get total income for a period
  const getTotalIncome = useCallback(
    (period: 'today' | 'week' | 'month' | 'all') => {
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      return incomes
        .filter((income) => {
          const incomeDate = new Date(income.date)
          switch (period) {
            case 'today':
              return incomeDate >= startOfDay
            case 'week':
              return incomeDate >= startOfWeek
            case 'month':
              return incomeDate >= startOfMonth
            default:
              return true
          }
        })
        .reduce((sum, inc) => sum + inc.amount, 0)
    },
    [incomes]
  )

  // Get spending by category
  const getSpendingByCategory = useCallback(
    (period: 'today' | 'week' | 'month' | 'all') => {
      const periodExpenses = getExpensesByPeriod(period)
      const categoryMap: Record<string, number> = {
        food: 0,
        transport: 0,
        entertainment: 0,
        shopping: 0,
        utilities: 0,
        education: 0,
        health: 0,
        other: 0,
      }
      periodExpenses.forEach((exp) => {
        categoryMap[exp.category] += exp.amount
      })
      return Object.entries(categoryMap)
        .filter(([, amount]) => amount > 0)
        .map(([category, amount]) => ({ category: category as ExpenseCategory, amount }))
        .sort((a, b) => b.amount - a.amount)
    },
    [getExpensesByPeriod]
  )

  // Export/Import stubs (kept local for the file exports instead of syncing immediately, syncing would happen on add)
  const exportToCSV = useCallback(() => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Payment Method', 'Recurring']
    const rows = expenses.map((exp) => [
      new Date(exp.date).toLocaleDateString(),
      exp.description,
      exp.category,
      exp.amount.toString(),
      exp.paymentMethod,
      exp.isRecurring ? 'Yes' : 'No',
    ])
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [expenses])

  const importFromCSV = useCallback(
    (csvText: string) => {
      const lines = csvText.trim().split('\n')
      if (lines.length < 2) return 0 // No data rows

      const imported: Expense[] = []
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim())
        if (cols.length < 4) continue
        const newExpense: Expense = {
          id: crypto.randomUUID(),
          date: new Date(cols[0]).toISOString().split('T')[0],
          description: cols[1] || 'Imported',
          category: (cols[2] as ExpenseCategory) || 'other',
          amount: parseFloat(cols[3]) || 0,
          paymentMethod: (cols[4] as any) || 'cash',
          isRecurring: cols[5]?.toLowerCase() === 'yes',
        }
        imported.push(newExpense)
        syncExpense(newExpense)
      }

      if (imported.length > 0) {
        setExpenses((prev) => [...imported, ...prev])
      }
      return imported.length
    },
    []
  )

  const exportToJSON = useCallback(() => {
    const data = { expenses, incomes, budgets, user, recurringRules }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spendwise_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [expenses, incomes, budgets, user, recurringRules])

  const importFromJSON = useCallback((jsonText: string) => {
    try {
      const data = JSON.parse(jsonText)
      if (data.expenses) {
        setExpenses(data.expenses)
        data.expenses.forEach((e: Expense) => syncExpense(e))
      }
      if (data.incomes) {
        setIncomes(data.incomes)
        data.incomes.forEach((i: Income) => syncIncome(i))
      }
      if (data.budgets) {
        setBudgets(data.budgets)
        data.budgets.forEach((b: Budget) => syncBudget(b))
      }
      if (data.recurringRules) {
        setRecurringRules(data.recurringRules)
        data.recurringRules.forEach((r: RecurringRule) => syncRecurringRule(r))
      }
      return true
    } catch {
      console.error('Failed to import JSON data')
      return false
    }
  }, [])

  return {
    expenses,
    budgets,
    user,
    incomes,
    recurringRules,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    updateBudget,
    addBudget,
    updateUser,
    addIncome,
    deleteIncome,
    getExpensesByPeriod,
    getTotalSpent,
    getTotalIncome,
    getSpendingByCategory,
    exportToCSV,
    importFromCSV,
    exportToJSON,
    importFromJSON,
  }
}
