'use client'

import TopNav from '@/components/top-nav'
import Sidebar from '@/components/sidebar'
import AppBreadcrumbs from '@/components/breadcrumbs'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-0">
          <Sidebar />
          <main className="p-4 md:p-6">
            <div className="pb-3">
              <AppBreadcrumbs />
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
