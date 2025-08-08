'use client'

import TopNav from '@/components/top-nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="max-w-6xl mx-auto">{children}</main>
    </div>
  )
}
