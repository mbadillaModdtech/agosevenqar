import { NextRequest, NextResponse } from 'next/server'
import { authUser, db } from '../../_store'

export async function GET(req: NextRequest) {
  const user = authUser(req)
  if (!user) return new NextResponse('Unauthorized', { status: 401 })
  const store = db()
  const list = store.approvals
    .filter(a => a.email && a.email.toLowerCase() === user.email.toLowerCase())
    .map(a => {
      const po = store.purchaseOrders.find(p => p.id === a.poId)!
      return { id: po.id, number: po.number, status: po.status, currentLevel: a.level }
    })
  return NextResponse.json(list)
}
