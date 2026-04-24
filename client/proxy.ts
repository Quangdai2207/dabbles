import GetAuthToken from '@/lib/get-auth-token'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_PATHS, OPEN_PATHS } from '@/constants/routes'

export const proxy = async (request: NextRequest) => {
  const path = request.nextUrl.pathname
  const token = await GetAuthToken()

  // 1. Handle Guest-Only Routes (Login, Signup...)
  const isGuestPath = AUTH_PATHS.some((p) => path.startsWith(p))
  if (isGuestPath) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // 2. Handle Explicit Public Routes (accessible by everyone)
  const isPublicPath = OPEN_PATHS.some((route) => path === route || path.startsWith(route + '/'))
  if (isPublicPath) {
    return NextResponse.next()
  }

  // 3. Fallback: Everything else is Private - Fail Closed
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
