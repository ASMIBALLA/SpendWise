'use client'

import { useActionState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { signupAction } from '@/lib/actions/auth'
import Link from 'next/link'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, {})

  if (state.success) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
              {state.fieldErrors?.name && (
                <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="me@example.com"
                required
              />
              {state.fieldErrors?.email && (
                <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state.fieldErrors?.password && (
                <p className="text-sm text-destructive">{state.fieldErrors.password[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
              {state.fieldErrors?.confirmPassword && (
                <p className="text-sm text-destructive">{state.fieldErrors.confirmPassword[0]}</p>
              )}
            </div>

            {state.error && (
              <div className="rounded bg-destructive/15 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
