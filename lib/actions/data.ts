'use server'

import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'
import type { Expense, Budget, Income, RecurringRule, User } from '@/lib/types'

const prisma = new PrismaClient()

// Fetch all user initialization data
export async function fetchUserData() {
  const session = await getSession()
  if (!session?.userId) return null

  const userId = session.userId as string

  const [user, expenses, budgets, incomes, recurring] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.expense.findMany({ where: { userId }, orderBy: { date: 'desc' } }),
    prisma.budget.findMany({ where: { userId } }),
    prisma.income.findMany({ where: { userId }, orderBy: { date: 'desc' } }),
    prisma.recurringRule.findMany({ where: { userId } }),
  ])

  if (!user) return null

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      monthlyBudget: user.monthlyBudget,
    } as User,
    expenses: expenses as Expense[],
    budgets: budgets as Budget[],
    incomes: incomes as Income[],
    recurringRules: recurring as RecurringRule[],
  }
}

// Sync individual items (Fire and Forget from client)
export async function syncExpense(expense: Expense, isDelete = false) {
  const session = await getSession()
  if (!session?.userId) return

  const { id, category, description, date, paymentMethod, isRecurring, recurringFrequency, amount } = expense

  if (isDelete) {
    await prisma.expense.delete({ where: { id } }).catch(() => {})
  } else {
    await prisma.expense.upsert({
      where: { id },
      update: { amount, category, description, date, paymentMethod, isRecurring, recurringFrequency },
      create: {
        id,
        userId: session.userId,
        amount,
        category,
        description,
        date,
        paymentMethod,
        isRecurring,
        recurringFrequency,
      },
    })
  }
}

export async function syncBudget(budget: Budget) {
  const session = await getSession()
  if (!session?.userId) return

  const { id, category, limit, period } = budget

  await prisma.budget.upsert({
    where: { id },
    update: { category, limit, period },
    create: {
      id,
      userId: session.userId,
      category,
      limit,
      period,
    },
  })
}

export async function syncIncome(income: Income, isDelete = false) {
  const session = await getSession()
  if (!session?.userId) return

  const { id, amount, source, description, date, isRecurring, recurringFrequency } = income

  if (isDelete) {
    await prisma.income.delete({ where: { id } }).catch(() => {})
  } else {
    await prisma.income.upsert({
      where: { id },
      update: { amount, source, description, date, isRecurring, recurringFrequency },
      create: {
        id,
        userId: session.userId,
        amount,
        source,
        description,
        date,
        isRecurring,
        recurringFrequency,
      },
    })
  }
}

export async function syncRecurringRule(rule: RecurringRule, isDelete = false) {
  const session = await getSession()
  if (!session?.userId) return

  const { id, type, amount, category, source, description, paymentMethod, frequency, nextDate, isActive } = rule

  if (isDelete) {
    await prisma.recurringRule.delete({ where: { id } }).catch(() => {})
  } else {
    await prisma.recurringRule.upsert({
      where: { id },
      update: { type, amount, category, source, description, paymentMethod, frequency, nextDate, isActive },
      create: {
        id,
        userId: session.userId,
        type,
        amount,
        category,
        source,
        description,
        paymentMethod,
        frequency,
        nextDate,
        isActive,
      },
    })
  }
}

export async function syncUserProfile(user: Partial<User>) {
  const session = await getSession()
  if (!session?.userId) return

  const { name, currency, monthlyBudget } = user

  await prisma.user.update({
    where: { id: session.userId },
    data: { name, currency, monthlyBudget },
  })
}
