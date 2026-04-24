type TResponseStatus = {
  isSuccess: boolean
  message: string | ''
  errorMessage: string | ''
}

type TResponseStatusObject<T> = TResponseStatus & {
  data: T | null
}

type TResponseStatusAuth = TResponseStatus & {
  token: string
  accountId: string
  expires: number
}
