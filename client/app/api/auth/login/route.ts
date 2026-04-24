import { NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  sub: string
  exp: number
  iat: number
  role: 'USER' | 'ADMIN' | 'SUPERADMIN'
}

export const POST = async (req: Request) => {
  const { token } = await req.json()

  const status: TResponseStatus = {
    isSuccess: false,
    message: '',
    errorMessage: ''
  }

  if (!token) {
    status.isSuccess = false
    status.errorMessage = 'Token is required'
    return NextResponse.json(status, { status: 400 })
  }

  let decoded: JwtPayload

  try {
    decoded = jwtDecode<JwtPayload>(token)
  } catch {
    status.errorMessage = 'Email or password is incorrect'
    return NextResponse.json(status, { status: 400 })
  }

  if (!decoded) {
    status.isSuccess = false
    status.errorMessage = 'Email or password is incorrect'
    return NextResponse.json(status, { status: 400 })
  }

  if (decoded.role !== 'USER') {
    status.isSuccess = false
    status.errorMessage = 'Email or password is incorrect'
    return NextResponse.json(status, { status: 400 })
  }

  status.isSuccess = true
  status.message = 'Login successful'
  const response = NextResponse.json(status, { status: 200 })
  const _expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day

  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires: _expires
  })

  return response
}
