/**
 * Shared constants — icons, colors, and labels for categories and payment methods.
 * Replaces duplicated maps across 4+ component files.
 */

import {
  Utensils,
  Car,
  Film,
  ShoppingBag,
  Zap,
  GraduationCap,
  Heart,
  MoreHorizontal,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
} from 'lucide-react'
import type { ExpenseCategory, PaymentMethod } from './types'

// Category icon mapping
export const CATEGORY_ICONS: Record<ExpenseCategory, typeof Utensils> = {
  food: Utensils,
  transport: Car,
  entertainment: Film,
  shopping: ShoppingBag,
  utilities: Zap,
  education: GraduationCap,
  health: Heart,
  other: MoreHorizontal,
}

// Category display labels
export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Food & Dining',
  transport: 'Transport',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  utilities: 'Utilities',
  education: 'Education',
  health: 'Health',
  other: 'Other',
}

// Category colors for solid backgrounds (budget cards)
export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: 'bg-chart-1',
  transport: 'bg-chart-2',
  entertainment: 'bg-chart-3',
  shopping: 'bg-chart-4',
  utilities: 'bg-chart-5',
  education: 'bg-primary',
  health: 'bg-accent',
  other: 'bg-muted-foreground',
}

// Category colors for icon backgrounds (expense lists)
export const CATEGORY_ICON_COLORS: Record<ExpenseCategory, string> = {
  food: 'bg-chart-1/10 text-chart-1',
  transport: 'bg-chart-2/10 text-chart-2',
  entertainment: 'bg-chart-3/10 text-chart-3',
  shopping: 'bg-chart-4/10 text-chart-4',
  utilities: 'bg-chart-5/10 text-chart-5',
  education: 'bg-primary/10 text-primary',
  health: 'bg-accent/10 text-accent',
  other: 'bg-muted text-muted-foreground',
}

// Payment method icons
export const PAYMENT_ICONS: Record<PaymentMethod, typeof CreditCard> = {
  cash: Banknote,
  card: CreditCard,
  upi: Smartphone,
  wallet: Wallet,
}

// Chart color palette
export const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--primary)',
  'var(--accent)',
  'var(--muted-foreground)',
]

// All expense categories
export const ALL_CATEGORIES: ExpenseCategory[] = [
  'food', 'transport', 'entertainment', 'shopping',
  'utilities', 'education', 'health', 'other',
]

// All payment methods
export const ALL_PAYMENT_METHODS: PaymentMethod[] = [
  'cash', 'card', 'upi', 'wallet',
]
