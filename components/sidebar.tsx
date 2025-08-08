'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Home, FilePlus2, List, CheckSquare, ClipboardList, Menu } from 'lucide-react'

type Role = 'ADMIN' | 'REQUESTER' | 'BUYER' | 'APPROVER'
type Session = { id: number; fullName: string; email: string; role: Role }

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
    return JSON.parse(jsonPayload)
  } catch { return null }
}

export default function Sidebar() {
  const [session, setSession] = useState<Session | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('accessToken')
    if (t) {
      const p = parseJwt(t)
      if (p) setSession({ id: Number(p.sub), fullName: p.name, email: p.email, role: p.role })
    }
  }, [])

  // Listen for global toggle events from TopNav hamburger
  useEffect(() => {
    const handler = () => setMobileOpen((v) => !v)
    window.addEventListener('toggle-sidebar', handler as any)
    return () => window.removeEventListener('toggle-sidebar', handler as any)
  }, [])

  const items = useMemo(() => {
    const all = [
      { href: '/', label: 'Home', icon: Home, roles: ['ADMIN','REQUESTER','BUYER','APPROVER'] as Role[] },
      { href: '/requester/new', label: 'New Request', icon: FilePlus2, roles: ['REQUESTER'] as Role[] },
      { href: '/requester/my', label: 'My Requests', icon: List, roles: ['REQUESTER'] as Role[] },
      { href: '/approvals/pending', label: 'Approvals', icon: CheckSquare, roles: ['APPROVER','ADMIN'] as Role[] }
    ]
    if (!session) return []
    return all.filter(i => i.roles.includes(session.role))
  }, [session])

  const SidebarInner = (
    <div className={cn('h-full flex flex-col')}>
      <div className="flex items-center gap-2 h-12 px-3">
        <ClipboardList className="size-5" />
        {!collapsed && <div className="font-semibold">QARSPC</div>}
        <div className="ml-auto">
          <Button variant="ghost" size="icon" aria-label="Collapse" onClick={()=> setCollapsed((v)=> !v)} className="hidden md:flex">
            <Menu className="size-4" />
          </Button>
        </div>
      </div>
      <Separator />
      <nav className="p-2 flex-1">
        <ul className="space-y-1">
          {items.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} className={cn('flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted')}>
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {!collapsed && session && (
        <div className="p-3 text-xs text-muted-foreground line-clamp-2">
          {session.fullName} ({session.role})
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className={cn('hidden md:block border-r sticky top-14 h-[calc(100vh-3.5rem)] bg-background transition-all', collapsed ? 'w-14' : 'w-64')}>
        {SidebarInner}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={()=> setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r shadow-lg">
            {SidebarInner}
          </aside>
        </div>
      )}
    </>
  )
}
