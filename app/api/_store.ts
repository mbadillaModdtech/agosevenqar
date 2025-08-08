import { NextRequest } from 'next/server'

export type Role = 'ADMIN' | 'REQUESTER' | 'BUYER' | 'APPROVER'

type User = { id: number; fullName: string; email: string; password: string; role: Role; isActive: boolean }
type Company = { id: number; name: string; isActive: boolean }
type Bu = { id: number; companyId: number; name: string; isActive: boolean }
type Provider = { id: number; commercialName: string; email: string }
type Quote = { id: number; requestId: number; providerId: number; quoteNumber: string; subtotal: number; paymentTerms: string }
type Request = { id: number; folio: number; requesterId: number; companyId: number; buId: number; justification: string; status: 'PENDING_EVALUATION' | 'PROVIDER_SELECTED' | 'CLOSED'; quotes: Quote[]; createdAt: string; selectedQuoteId?: number | null }
type PoItem = { id: number; purchaseOrderId: number; description: string; qty: number; unitPrice: number }
type PurchaseOrder = { id: number; requestId: number; number: number; status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'FOR_REEVALUATION' | 'SENT_TO_PROVIDER'; totalAmount: number; items: PoItem[]; createdAt: string }

type DB = {
  users: User[]
  companies: Company[]
  bus: Bu[]
  providers: Provider[]
  requests: Request[]
  quotes: Quote[]
  purchaseOrders: PurchaseOrder[]
  seq: Record<string, number>
  approvalFlow: { level1?: string; level2?: string }
  approvals: { poId: number; level: number; email: string }[]
}

declare global {
  // eslint-disable-next-line no-var
  var __QARSPC_DB__: DB | undefined
}

export function db(): DB {
  if (!globalThis.__QARSPC_DB__) {
    const now = new Date().toISOString()
    globalThis.__QARSPC_DB__ = {
      users: [
        { id: 1, fullName: 'Admin', email: 'admin@qarspc.local', password: 'P@ssw0rd!', role: 'ADMIN', isActive: true },
        { id: 2, fullName: 'Buyer', email: 'buyer@qarspc.local', password: 'P@ssw0rd!', role: 'BUYER', isActive: true },
        { id: 3, fullName: 'Approver 1', email: 'approver1@qarspc.local', password: 'P@ssw0rd!', role: 'APPROVER', isActive: true },
        { id: 4, fullName: 'Requester', email: 'requester@qarspc.local', password: 'P@ssw0rd!', role: 'REQUESTER', isActive: true },
      ],
      companies: [{ id: 1, name: 'Acme Corp', isActive: true }],
      bus: [{ id: 1, companyId: 1, name: 'IT', isActive: true }, { id: 2, companyId: 1, name: 'Finance', isActive: true }],
      providers: [{ id: 1, commercialName: 'TechSupplier', email: 'alice@techsupplier.test' }],
      requests: [],
      quotes: [],
      purchaseOrders: [],
      seq: { RequestFolio: 1000, RequestId: 1, QuoteId: 1, PoId: 1, PoNumber: 5000, PoItemId: 1 },
      approvalFlow: { level1: 'approver1@qarspc.local', level2: undefined },
      approvals: []
    }
  }
  return globalThis.__QARSPC_DB__!
}

export function authUser(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : (req.headers.get('x-access-token') || '')
  if (!token) return null
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8'))
    return payload as { sub: string; email: string; name: string; role: Role }
  } catch {
    return null
  }
}

export function fakeJwt(user: User) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ sub: String(user.id), email: user.email, name: user.fullName, role: user.role, exp: Math.floor(Date.now()/1000)+3600 }))
  const signature = btoa('signature')
  return `${header}.${payload}.${signature}`
}
