import addBaseUrl from '@/lib/add-base-url'

const BASE_API_URL = process.env.NEXT_PUBLIC_SERVER_API!

const apiUrls = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout'
  }
}

const ApiNextUrls = addBaseUrl(apiUrls, BASE_API_URL)
export default ApiNextUrls
