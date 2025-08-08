'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Role = 'ADMIN' | 'REQUESTER' | 'BUYER' | 'APPROVER'
type Session = { id: number; fullName: string; email: string; role: Role }

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('accessToken')
    if (!t) return
    const p = parseJwt(t)
    if (p) setSession({ id: Number(p.sub), fullName: p.name, email: p.email, role: p.role })
  }, [])

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  if (!session) {
    if (typeof window !== 'undefined') window.location.href = '/login'
    return null
  }

  const NavLink: React.FC<{ href: string; label: string; roles?: Role[] }> = ({ href, label, roles }) => {
    const allowed = !roles || roles.includes(session.role)
    if (!allowed) return null
    return (
      <Link href={href} className={cn('px-3 py-2 rounded-md bg-muted hover:bg-muted/80')}>
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-2 justify-between">
        <div className="text-lg">Welcome, {session.fullName} ({session.role})</div>
        <Button variant="secondary" onClick={logout}>Logout</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <NavLink href="/" label="Home" />
            <NavLink href="/requester/new" label="New Request" roles={['REQUESTER']} />
            <NavLink href="/requester/my" label="My Requests" roles={['REQUESTER']} />
            <NavLink href="/approvals/pending" label="Approvals" roles={['APPROVER','ADMIN']} />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="font-semibold">Quick Start</div>
            <ol className="list-decimal ml-5 space-y-1 text-sm text-muted-foreground">
              <li>Log in as Requester and create a new Request</li>
              <li>Log in as Buyer to generate a PO</li>
              <li>Log in as Approver to approve the PO</li>
              <li>Open the PO to download a sample PDF</li>
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2 text-sm text-muted-foreground">
            This preview uses an in-memory API. Data resets on redeploy.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
