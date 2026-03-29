'use client'

import { useState } from 'react'
import { Header } from '@/components/dashboard/header'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ExpenseProvider } from '@/components/expense-provider'

import { AnimatedBackground } from '@/components/auth/animated-background'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ExpenseProvider>
      <div className="flex h-screen flex-col overflow-hidden relative">
        <AnimatedBackground />
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <div className="flex flex-1 overflow-hidden z-10 bg-transparent">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent">
            {children}
          </main>
        </div>
      </div>
    </ExpenseProvider>
  )
}
