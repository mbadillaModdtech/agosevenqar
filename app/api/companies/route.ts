import { NextResponse } from 'next/server'
import { db } from '../_store'

export async function GET() {
  return NextResponse.json(db().companies)
}
