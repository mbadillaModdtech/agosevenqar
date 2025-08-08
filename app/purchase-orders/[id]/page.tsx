'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PoDetailPage() {
  const params = useParams<{ id: string }>()
  const [po, setPo] = useState<any>(null)
  useEffect(()=> {
    fetch(`/api/purchase-orders/${params.id}`).then(r=>r.json()).then(setPo)
  }, [params.id])

  if (!po) return <div className="p-4">Loading...</div>

  return (
    <div className="p-4 md:p-8 space-y-4">
      <div className="text-lg font-semibold">PO #{po.number}</div>
      <Card>
        <CardHeader><CardTitle>Items</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc ml-5">
            {po.items.map((it: any)=> <li key={it.id}>{it.description} x{it.qty} @ ${it.unitPrice} = ${it.qty * it.unitPrice}</li>)}
          </ul>
          <div className="mt-2 font-semibold">Total: ${po.totalAmount}</div>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button onClick={()=> window.open(`/api/purchase-orders/${po.id}/pdf`, '_blank')}>Download PDF</Button>
      </div>
    </div>
  )
}
