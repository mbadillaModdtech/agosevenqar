import { NextRequest, NextResponse } from 'next/server'
import { db } from '../_store'

export async function GET(req: NextRequest) {
  const companyId = Number(new URL(req.url).searchParams.get('companyId') || '0')
  const list = db().bus.filter(b => !companyId || b.companyId === companyId)
  return NextResponse.json(list)
}
