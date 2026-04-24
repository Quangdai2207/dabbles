type WithBase<T> = {
  [K in keyof T]: T[K] extends string ? string : WithBase<T[K]>
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const addBaseUrl = <T extends Record<string, unknown>>(obj: T, base: string): WithBase<T> => {
  const result = {} as WithBase<T>

  for (const key of Object.keys(obj) as Array<keyof T>) {
    const value = obj[key]

    if (typeof value === 'string') {
      result[key] = `${base}${value}` as WithBase<T>[keyof T]
    } else if (isObject(value)) {
      result[key] = addBaseUrl(value, base) as WithBase<T>[keyof T]
    }
  }

  return result
}

export default addBaseUrl
