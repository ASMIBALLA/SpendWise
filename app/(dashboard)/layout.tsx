'use client'

import { useState } from 'react'
import { Header } from '@/components/dashboard/header'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ExpenseProvider } from '@/components/expense-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ExpenseProvider>
      <div className="flex h-screen flex-col">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ExpenseProvider>
  )
}
