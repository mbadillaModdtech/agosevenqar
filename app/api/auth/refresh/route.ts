import { NextRequest, NextResponse } from 'next/server'
import { db, fakeJwt } from '../../_store'

export async function POST(req: NextRequest) {
  // In preview, accept any refresh token and issue a new pair for the first user
  const store = db()
  const user = store.users[0]
  const accessToken = fakeJwt(user)
  const refreshToken = Math.random().toString(36).slice(2)
  return NextResponse.json({ accessToken, refreshToken })
}
