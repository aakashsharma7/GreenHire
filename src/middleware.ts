import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Always allow auth routes through
  if (
    path.startsWith('/auth/') ||
    path.startsWith('/api/auth/') ||
    path === '/admin/login' ||
    path === '/api/admin/login'
  ) {
    return NextResponse.next()
  }

  // Walled off admin routes — require appwrite-session cookie
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    const adminSession = request.cookies.get('appwrite-session')
    
    if (!adminSession?.value) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      } else {
        // Redirect to the new premium auth gateway
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/auth/:path*',
    '/api/auth/:path*',
  ]
}
