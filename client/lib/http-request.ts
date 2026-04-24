type CustomOptions = Omit<RequestInit, 'method' | 'body'>

export class HttpError extends Error {
  status: number
  payload: unknown

  constructor(status: number, payload: unknown) {
    super('Http Error')
    this.status = status
    this.payload = payload
  }
}

const request = async <T, TBody = unknown>({
  url,
  method,
  options = {}
}: {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  options?: CustomOptions & { body?: TBody | FormData | null }
}): Promise<T> => {
  const { body, headers: customHeaders = {}, ...otherOptions } = options

  // Default headers
  const baseHeaders: HeadersInit = {
    ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' })
  }

  const finalHeaders = {
    ...baseHeaders,
    ...customHeaders
  }

  try {
    const res = await fetch(url, {
      method,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
      headers: finalHeaders,
      ...otherOptions
    })

    if (!res.ok) {
      let errorPayload: unknown
      try {
        errorPayload = await res.json()
      } catch {
        errorPayload = { message: 'An unexpected error occurred.' }
      }
      throw new HttpError(res.status, errorPayload)
    }

    // Handle cases with no content
    if (res.status === 204) {
      return null as T
    }

    const result: T = await res.json()
    return result
  } catch (error) {
    throw error
  }
}

const http = {
  get<T>(url: string, options?: CustomOptions) {
    return request<T>({ url, method: 'GET', options: options ?? {} })
  },
  post<T, TBody>(url: string, body: TBody, options?: CustomOptions) {
    return request<T, TBody>({ url, method: 'POST', options: { ...options, body } })
  },
  put<T, TBody>(url: string, body: TBody, options?: CustomOptions) {
    return request<T, TBody>({ url, method: 'PUT', options: { ...options, body: body } })
  },
  delete<T>(url: string, options?: CustomOptions) {
    return request<T>({ url, method: 'DELETE', options: options ?? {} })
  }
}

export default http
