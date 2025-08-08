'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Row = { id: number; folio: number; status: string; createdAt: string; amount?: number | null; provider?: string | null }

export default function MyRequestsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [status, setStatus] = useState('')

  const load = async () => {
    setLoading(true)
    const p = new URLSearchParams()
    if (from) p.set('from', from)
    if (to) p.set('to', to)
    if (status) p.set('status', status)
    const r = await fetch(`/api/requests/my?${p.toString()}`)
    const data = await r.json()
    setRows(data.items || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>My Requests</CardTitle>
          <div className="flex gap-2">
            <Input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} />
            <Input type="date" value={to} onChange={(e)=>setTo(e.target.value)} />
            <select className="border rounded-md h-10 px-3" value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="PENDING_EVALUATION">PENDING_EVALUATION</option>
              <option value="PROVIDER_SELECTED">PROVIDER_SELECTED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
            <Button onClick={load}>Filter</Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-auto">
          {loading ? 'Loading...' : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Folio</th>
                  <th>Created</th>
                  <th>Provider</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-b">
                    <td className="py-2">{r.folio}</td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                    <td>{r.provider ?? '-'}</td>
                    <td>{r.amount != null ? r.amount.toFixed(2) : '-'}</td>
                    <td>{r.status}</td>
                    <td><Link className="underline" href={`/requests/${r.id}`}>Detail</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
