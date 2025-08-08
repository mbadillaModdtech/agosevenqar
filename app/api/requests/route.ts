import { NextRequest, NextResponse } from 'next/server'
import { authUser, db } from '../_store'

export async function POST(req: NextRequest) {
  const user = authUser(req)
  if (!user) return new NextResponse('Unauthorized', { status: 401 })
  const store = db()
  const form = await req.formData()
  const companyId = Number(form.get('companyId') || 0)
  const buId = Number(form.get('buId') || 0)
  const justification = String(form.get('justification') || '')
  if (!companyId || !buId || !justification) return new NextResponse('Invalid data', { status: 400 })
  const id = store.seq.RequestId++
  const folio = store.seq.RequestFolio++
  const r = { id, folio, requesterId: Number(user.sub), companyId, buId, justification, status: 'PENDING_EVALUATION' as const, quotes: [], createdAt: new Date().toISOString(), selectedQuoteId: null }
  store.requests.push(r)
  return NextResponse.json({ id: r.id, folio: r.folio })
}

export async function GET(req: NextRequest) {
  // /api/requests/my
  const url = new URL(req.url)
  if (url.pathname.endsWith('/my')) {
    const user = authUser(req)
    if (!user) return new NextResponse('Unauthorized', { status: 401 })
    const items = db().requests
      .filter(r => r.requesterId === Number(user.sub))
      .map(r => ({ id: r.id, folio: r.folio, createdAt: r.createdAt, status: r.status, provider: r.selectedQuoteId ? db().providers.find(p => p.id === db().quotes.find(q => q.id === r.selectedQuoteId)?.providerId)?.commercialName : null, amount: db().purchaseOrders.find(p => p.requestId === r.id)?.totalAmount ?? null }))
    return NextResponse.json({ items })
  }
  return NextResponse.json({ items: [] })
}
