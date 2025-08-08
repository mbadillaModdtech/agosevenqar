import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../_store'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const store = db()
  const r = store.requests.find(x => x.id === Number(params.id))
  if (!r) return new NextResponse('Not found', { status: 404 })
  // ensure at least one quote exists in preview
  if (r.quotes.length === 0) {
    const qid = store.seq.QuoteId++
    const q = { id: qid, requestId: r.id, providerId: 1, quoteNumber: `Q-${qid}`, subtotal: 1000 + Math.floor(Math.random()*500), paymentTerms: 'NET 30' }
    store.quotes.push(q)
    r.quotes.push(q)
  }
  const quotes = r.quotes.map(q => ({ ...q, provider: { id: q.providerId, commercialName: store.providers.find(p => p.id === q.providerId)?.commercialName || 'Provider' } }))
  return NextResponse.json({ id: r.id, folio: r.folio, justification: r.justification, status: r.status, createdAt: r.createdAt, quotes })
}
