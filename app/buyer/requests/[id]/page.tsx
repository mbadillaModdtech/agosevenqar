'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BuyerRequestDetail() {
  const params = useParams<{ id: string }>()
  const [data, setData] = useState<any>(null)
  useEffect(() => {
    fetch(`/api/requests/${params.id}`).then(r=>r.json()).then(setData)
  }, [params.id])
  if (!data) return <div className="p-4">Loading...</div>
  return (
    <div className="p-4 md:p-8 space-y-4">
      <div className="text-lg font-semibold">Buyer - Request {data.folio}</div>
      <Card>
        <CardHeader><CardTitle>Quotes Comparative</CardTitle></CardHeader>
        <CardContent className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b"><th className="py-2">Provider</th><th>Subtotal</th><th>Terms</th></tr></thead>
            <tbody>
              {data.quotes.map((q: any)=>(
                <tr key={q.id} className="border-b">
                  <td className="py-2">{q.provider.commercialName}</td>
                  <td>${q.subtotal.toFixed(2)}</td>
                  <td>{q.paymentTerms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Link className="underline" href={`/buyer/requests/${params.id}/generate-po`}>Generate PO</Link>
    </div>
  )
}
