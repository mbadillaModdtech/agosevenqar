'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

type Company = { id: number; name: string }
type BusinessUnit = { id: number; companyId: number; name: string }

export default function NewRequestPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [bus, setBus] = useState<BusinessUnit[]>([])
  const [companyId, setCompanyId] = useState<number>(1)
  const [buId, setBuId] = useState<number>(1)
  const [justification, setJustification] = useState('Need laptops for new hires')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/companies').then(r=>r.json()).then(setCompanies)
  }, [])
  useEffect(() => {
    if (!companyId) return
    fetch(`/api/business-units?companyId=${companyId}`).then(r=>r.json()).then(setBus)
  }, [companyId])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.set('companyId', String(companyId))
      fd.set('buId', String(buId))
      fd.set('justification', justification)
      const res = await fetch('/api/requests', { method: 'POST', body: fd })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      router.push(`/requests/${data.id}`)
    } catch (err: any) {
      toast({ title: 'Failed to create request', description: err.message, variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <select className="border rounded-md h-10 px-3"
                  value={companyId} onChange={(e)=>setCompanyId(Number(e.target.value))}>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Business Unit</Label>
                <select className="border rounded-md h-10 px-3"
                  value={buId} onChange={(e)=>setBuId(Number(e.target.value))}>
                  {bus.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Justification</Label>
              <Textarea value={justification} onChange={(e)=>setJustification(e.target.value)} rows={5} />
            </div>
            <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Request'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
