'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useExpenses } from '@/components/expense-provider'
import { Menu, Download, Settings, LogOut, Wallet } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, exportToCSV } = useExpenses()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight hidden sm:inline-block">
            SpendWise
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-2"
          onClick={exportToCSV}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="sm:hidden" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={async () => {
              const { logoutAction } = await import('@/lib/actions/auth')
              await logoutAction()
              window.location.href = '/login'
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
