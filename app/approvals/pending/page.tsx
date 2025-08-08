'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

export default function ApprovalsPendingPage() {
  const [rows, setRows] = useState<any[]>([])
  const [comment, setComment] = useState('Looks good')
  const load = async () => {
    const r = await fetch('/api/approvals/pending')
    setRows(await r.json())
  }
  useEffect(()=> { load() }, [])
  const act = async (id: number, action: 'approve'|'reject'|'reevaluate', level: number) => {
    const body = action === 'approve' ? { level } : { level, comment }
    const res = await fetch(`/api/purchase-orders/${id}/${action}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) {
      toast({ title: 'Action failed', description: await res.text(), variant: 'destructive' })
      return
    }
    await load()
    toast({ title: `PO ${action}d` })
  }
  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader><CardTitle>Pending Approvals</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Comment (for Reject/Reevaluate)</label>
            <Textarea value={comment} onChange={(e)=>setComment(e.target.value)} />
          </div>
          {rows.length === 0 ? 'No items' : rows.map(po => (
            <div key={po.id} className="border rounded-md p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>PO #{po.number} - Level {po.currentLevel}</div>
              <div className="flex gap-2">
                <Button size="sm" onClick={()=>act(po.id, 'approve', po.currentLevel)}>Approve</Button>
                <Button size="sm" variant="secondary" onClick={()=>act(po.id, 'reject', po.currentLevel)}>Reject</Button>
                <Button size="sm" variant="secondary" onClick={()=>act(po.id, 'reevaluate', po.currentLevel)}>Reevaluate</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
