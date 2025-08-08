import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../_store'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const store = db()
  const po = store.purchaseOrders.find(p => p.id === Number(params.id))
  if (!po) return new NextResponse('Not found', { status: 404 })
  return NextResponse.json(po)
}
