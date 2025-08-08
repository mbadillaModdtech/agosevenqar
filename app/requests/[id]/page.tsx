'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Req = {
  id: number; folio: number; justification: string; status: string; createdAt: string;
  quotes: Array<{ id: number; quoteNumber: string; subtotal: number; paymentTerms: string; provider: { id: number; commercialName: string } }>
}

export default function RequestDetailPage() {
  const params = useParams<{ id: string }>()
  const [data, setData] = useState<Req | null>(null)

  useEffect(() => {
    fetch(`/api/requests/${params.id}`).then(r=>r.json()).then(setData)
  }, [params.id])

  if (!data) return <div className="p-4">Loading...</div>

  return (
    <div className="p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Request {data.folio}</div>
        <Link href={`/buyer/requests/${data.id}`} className="underline">Buyer page</Link>
      </div>

      <Card>
        <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
        <CardContent>
          <div>Status: {data.status}</div>
          <div>Justification: {data.justification}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Quotes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.quotes.length === 0 ? 'No quotes' : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Provider</th>
                  <th>Quote #</th>
                  <th>Subtotal</th>
                  <th>Terms</th>
                </tr>
              </thead>
              <tbody>
                {data.quotes.map(q => (
                  <tr key={q.id} className="border-b">
                    <td className="py-2">{q.provider.commercialName}</td>
                    <td>{q.quoteNumber}</td>
                    <td>${q.subtotal.toFixed(2)}</td>
                    <td>{q.paymentTerms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="text-xs text-muted-foreground">In preview, quotes are auto-generated or can be added via Buyer page.</div>
        </CardContent>
      </Card>

      <div>
        <Link href={`/buyer/requests/${data.id}/generate-po`}><Button>Generate PO</Button></Link>
      </div>
    </div>
  )
}
