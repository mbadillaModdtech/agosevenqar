'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'

type Item = { description: string; qty: number; unitPrice: number }

export default function GeneratePOPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([{ description: 'Laptop', qty: 1, unitPrice: 1200 }])
  const [isReplacement, setIsReplacement] = useState(false)
  const [oldSerialNumber, setOldSerialNumber] = useState('')
  const [observations, setObservations] = useState('')
  const total = useMemo(()=> items.reduce((s,i)=> s + i.qty * i.unitPrice, 0), [items])
  const [saving, setSaving] = useState(false)

  useEffect(()=>{ /* load request if needed */ }, [])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/requests/${params.id}/purchase-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, isReplacement, oldSerialNumber: isReplacement ? oldSerialNumber : null, observations })
      })
      if (!res.ok) throw new Error(await res.text())
      const po = await res.json()
      router.replace(`/purchase-orders/${po.id}`)
    } catch (err: any) {
      toast({ title: 'Failed to create PO', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Generate PO</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox id="rep" checked={isReplacement} onCheckedChange={(v)=>setIsReplacement(Boolean(v))} />
            <Label htmlFor="rep">Replacement</Label>
          </div>
          {isReplacement && (
            <div className="space-y-2">
              <Label>Old Serial Number</Label>
              <Input value={oldSerialNumber} onChange={(e)=>setOldSerialNumber(e.target.value)} />
            </div>
          )}
          <div className="space-y-2">
            <Label>Observations</Label>
            <Input value={observations} onChange={(e)=>setObservations(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Items</Label>
            <div className="space-y-2">
              {items.map((it, idx)=>(
                <div key={idx} className="grid grid-cols-12 gap-2">
                  <Input className="col-span-6" placeholder="Description" value={it.description} onChange={(e)=> setItems(prev => prev.map((p,i)=> i===idx ? { ...p, description: e.target.value } : p))} />
                  <Input className="col-span-2" type="number" placeholder="Qty" value={it.qty} onChange={(e)=> setItems(prev => prev.map((p,i)=> i===idx ? { ...p, qty: Number(e.target.value) } : p))} />
                  <Input className="col-span-3" type="number" step="0.01" placeholder="Unit Price" value={it.unitPrice} onChange={(e)=> setItems(prev => prev.map((p,i)=> i===idx ? { ...p, unitPrice: Number(e.target.value) } : p))} />
                  <Button variant="secondary" className="col-span-1" onClick={()=> setItems(prev => prev.filter((_,i)=> i!==idx))}>-</Button>
                </div>
              ))}
              <Button variant="secondary" onClick={()=> setItems(prev => [...prev, { description: '', qty: 1, unitPrice: 0 }])}>Add Item</Button>
            </div>
          </div>
          <div className="font-semibold">Total: ${total.toFixed(2)}</div>
          <Button onClick={save} disabled={saving}>{saving ? 'Creating...' : 'Create PO'}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
