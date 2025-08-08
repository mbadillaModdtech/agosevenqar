'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

function labelFor(segment: string, index: number) {
  if (!segment) return 'Home'
  if (/^\d+$/.test(segment)) return index === 0 ? 'Detail' : segment
  const map: Record<string, string> = {
    requester: 'Requester',
    new: 'New',
    my: 'My Requests',
    requests: 'Requests',
    buyer: 'Buyer',
    'generate-po': 'Generate PO',
    'purchase-orders': 'Purchase Orders',
    approvals: 'Approvals',
    pending: 'Pending'
  }
  return map[segment] || segment.replace(/-/g, ' ')
}

export default function AppBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const paths = segments.map((_, i) => '/' + segments.slice(0, i + 1).join('/'))

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((seg, i) => (
          <span key={paths[i]} className="flex items-center">
            <BreadcrumbSeparator />
            {i < segments.length - 1 ? (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={paths[i]}>{labelFor(seg, i)}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{labelFor(seg, i)}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
