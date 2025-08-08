import { NextRequest, NextResponse } from 'next/server'
import { authUser, db } from '../../../_store'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = authUser(req)
  if (!user) return new NextResponse('Unauthorized', { status: 401 })
  const { level } = await req.json()
  const store = db()
  const po = store.purchaseOrders.find(p => p.id === Number(params.id))
  if (!po) return new NextResponse('Not found', { status: 404 })
  // remove current level
  store.approvals = store.approvals.filter(a => !(a.poId === po.id && a.level === level))
  // if no more levels, approve
  if (!store.approvals.some(a => a.poId === po.id)) {
    po.status = 'APPROVED'
  }
  return NextResponse.json({ success: true })
}
