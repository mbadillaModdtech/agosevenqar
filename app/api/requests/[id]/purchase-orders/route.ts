import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../_store'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  if (body.isReplacement && !body.oldSerialNumber) return new NextResponse('OldSerialNumber required', { status: 400 })
  const store = db()
  const rid = Number(params.id)
  const reqRow = store.requests.find(r => r.id === rid)
  if (!reqRow) return new NextResponse('Request not found', { status: 404 })
  const id = store.seq.PoId++
  const number = store.seq.PoNumber++
  const items = (body.items || []).map((i: any) => ({ id: store.seq.PoItemId++, purchaseOrderId: id, description: i.description, qty: Number(i.qty), unitPrice: Number(i.unitPrice) }))
  const total = items.reduce((s: number, it: any)=> s + it.qty * it.unitPrice, 0)
  const po = { id, requestId: rid, number, status: 'PENDING_APPROVAL' as const, totalAmount: total, items, createdAt: new Date().toISOString() }
  store.purchaseOrders.push(po)
  // create approval assignment for level 1
  store.approvals.push({ poId: id, level: 1, email: store.approvalFlow.level1 || '' })
  return NextResponse.json(po)
}
