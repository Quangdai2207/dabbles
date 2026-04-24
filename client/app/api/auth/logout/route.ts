import { NextResponse } from 'next/server'
import http from '@/lib/http-request'
import ApiBeUrls from '@/constants/api-be-urls'

export const POST = async (req: Request) => {
  const { token } = await req.json()

  const res = NextResponse.json(
    token
      ? await http.post(ApiBeUrls.auth.logout, {}, { headers: { Authorization: `Bearer ${token}` } })
      : { isSuccess: false },
    { status: token ? 200 : 400 }
  )

  res.cookies.delete('auth_token')
  return res
}
