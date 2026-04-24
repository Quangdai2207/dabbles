//Server only
import { cookies } from 'next/headers'

const GetAuthToken = async (): Promise<string | undefined | '' | null> => {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export default GetAuthToken
