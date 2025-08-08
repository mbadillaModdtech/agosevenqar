import { NextRequest, NextResponse } from 'next/server'
import { authUser, db } from '../../_store'

export async function GET(req: NextRequest) {
  const user = authUser(req)
  if (!user) return new NextResponse('Unauthorized', { status: 401 })
  const items = db().requests
    .filter(r => r.requesterId === Number(user.sub))
    .map(r => ({ id: r.id, folio: r.folio, createdAt: r.createdAt, status: r.status, provider: r.selectedQuoteId ? db().providers.find(p => p.id === db().quotes.find(q => q.id === r.selectedQuoteId)?.providerId)?.commercialName : null, amount: db().purchaseOrders.find(p => p.requestId === r.id)?.totalAmount ?? null }))
  return NextResponse.json({ items })
}
