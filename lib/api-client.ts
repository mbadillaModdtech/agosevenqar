'use client'

/**
 * apiFetch: wraps window.fetch and automatically attaches Authorization header
 * from localStorage accessToken. Falls back to plain fetch if none is present.
 */
export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {})
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
    headers.set('X-Access-Token', token)
  }
  const merged: RequestInit = { ...init, headers }
  return fetch(input, merged)
}
