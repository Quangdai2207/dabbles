import { HttpError } from './http-request'

/**
 * A helper function to handle API service calls with consistent error handling.
 * @param apiCall The promise returned by the http request
 * @param fallbackErrorMessage The error message to use if the API call fails without a specific error message
 * @returns A promise resolving to T (where T extends TResponseStatus)
 */
export const handleApiService = async <T extends TResponseStatus>(
  apiCall: Promise<T>,
  fallbackErrorMessage: string = 'Operation failed'
): Promise<T> => {
  // We need to construct a default error object of type T.
  // Since we don't know the exact shape of T beyond TResponseStatus,
  // we'll cast a base error object.
  const createErrorStatus = (msg: string, errorMsg: string): T => {
    return {
      isSuccess: false,
      message: msg,
      errorMessage: errorMsg
    } as unknown as T
  }

  try {
    const res = await apiCall

    // Handle case where res is null/undefined (e.g. 204 No Content)
    if (!res) {
      // If result is expected but null, treat as success if void/null is acceptable,
      // but here we expect T extends TResponseStatus.
      // We'll return a success status casted to T.
      return {
        isSuccess: true,
        message: '',
        errorMessage: ''
      } as unknown as T
    }

    // Backend success case
    if (res.isSuccess) {
      return res
    }

    // Backend failure case
    return {
      ...res,
      isSuccess: false,
      errorMessage: res.errorMessage || fallbackErrorMessage,
      message: res.message || ''
    }
  } catch (error) {
    let errorMessage = `${fallbackErrorMessage}. Please try again.`
    let message = ''

    if (error instanceof HttpError) {
      const payload = error.payload as Partial<TResponseStatus> | null
      errorMessage = payload?.errorMessage || errorMessage
      message = payload?.message || ''
    }

    return createErrorStatus(message, errorMessage)
  }
}
