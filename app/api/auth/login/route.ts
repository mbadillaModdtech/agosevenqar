import { NextRequest, NextResponse } from 'next/server'
import { db, fakeJwt } from '../../_store'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=> ({}))
  const { email, password } = body
  const store = db()
  const user = store.users.find(u => u.email === email && u.password === password && u.isActive)
  if (!user) return new NextResponse('Invalid credentials', { status: 401 })
  const accessToken = fakeJwt(user)
  const refreshToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  return NextResponse.json({ accessToken, refreshToken })
}
