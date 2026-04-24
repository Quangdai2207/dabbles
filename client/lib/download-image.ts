import { toast } from 'sonner'

const downloadImage = async (imageUrl: string) => {
  if (!imageUrl) return

  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    const img = new window.Image()
    img.src = window.URL.createObjectURL(blob)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          (jpgBlob) => {
            if (jpgBlob) {
              const url = window.URL.createObjectURL(jpgBlob)
              const link = document.createElement('a')
              link.href = url
              link.download = `${crypto.randomUUID().replace(/-/g, '')}.jpg`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              window.URL.revokeObjectURL(url)
            }
          },
          'image/jpeg',
          0.95
        )
      }

      window.URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      toast.error('Failed to convert image')
      window.URL.revokeObjectURL(img.src)
    }
  } catch (error) {
    console.error('Download failed:', error)
    toast.error('Failed to download image')
  }
}

export default downloadImage
