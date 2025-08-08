'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@qarspc.local')
  const [password, setPassword] = useState('P@ssw0rd!')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      router.replace('/')
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message || 'Invalid credentials', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>QARSPC Preview</CardTitle>
          <CardDescription>Sign in with a seeded user</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
            <div className="text-xs text-muted-foreground">
              Seeded users:
              <ul className="list-disc ml-4">
                <li>admin@qarspc.local / P@ssw0rd!</li>
                <li>buyer@qarspc.local / P@ssw0rd!</li>
                <li>approver1@qarspc.local / P@ssw0rd!</li>
                <li>requester@qarspc.local / P@ssw0rd!</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
