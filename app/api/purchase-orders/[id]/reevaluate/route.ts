import { NextRequest, NextResponse } from 'next/server'
import { authUser, db } from '../../../_store'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = authUser(req)
  if (!user) return new NextResponse('Unauthorized', { status: 401 })
  const { level, comment } = await req.json()
  if (!comment) return new NextResponse('Comment required', { status: 400 })
  const store = db()
  const po = store.purchaseOrders.find(p => p.id === Number(params.id))
  if (!po) return new NextResponse('Not found', { status: 404 })
  po.status = 'FOR_REEVALUATION'
  // send back to level 1
  store.approvals = store.approvals.filter(a => a.poId !== po.id)
  store.approvals.push({ poId: po.id, level: 1, email: store.approvalFlow.level1 || '' })
  return NextResponse.json({ success: true })
}
