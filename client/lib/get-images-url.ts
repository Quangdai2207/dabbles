const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, '') || ''

const getImageUrl = (path: string | undefined | null) => {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('https')) return path
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`.trim()
}

export default getImageUrl
