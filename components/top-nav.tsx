'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

type Session = { id: number; fullName: string; email: string; role: string }

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
  } catch { return null }
}

export default function TopNav({ title = 'QARSPC' }: { title?: string }) {
  const [session, setSession] = useState<Session | null>(null)
  useEffect(() => {
    const t = localStorage.getItem('accessToken')
    if (!t) return
    const p = parseJwt(t)
    if (p) setSession({ id: Number(p.sub), fullName: p.name, email: p.email, role: p.role })
  }, [])

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'))
  }

  return (
    <header className="sticky top-0 z-50 h-14 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto h-full px-3 md:px-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Open Menu" className="md:hidden" onClick={toggleSidebar}>
          <Menu className="size-5" />
        </Button>
        <Link href="/" className="font-semibold">{title}</Link>
        <nav className="text-sm flex gap-3">
          <Link href="/">Home</Link>
          {session?.role === 'REQUESTER' && (
            <>
              <Link href="/requester/new">New Request</Link>
              <Link href="/requester/my">My Requests</Link>
            </>
          )}
          {(session?.role === 'APPROVER' || session?.role === 'ADMIN') && <Link href="/approvals/pending">Approvals</Link>}
        </nav>
        <div className="ml-auto text-sm">
          {session ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline">{session.fullName} ({session.role})</span>
              <Button size="sm" variant="secondary" onClick={()=>{ localStorage.clear(); window.location.href='/login' }}>Logout</Button>
            </div>
          ) : <Link href="/login">Login</Link>}
        </div>
      </div>
    </header>
  )
}
