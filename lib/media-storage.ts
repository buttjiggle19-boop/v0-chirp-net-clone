/**
 * Media storage utility for local storage management
 * Converts media to base64 and stores in localStorage
 */

const MAX_STORAGE_SIZE = 50 * 1024 * 1024 // 50MB total

export const getStorageSize = (): number => {
  let size = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      size += localStorage[key].length + key.length
    }
  }
  return size
}

export const canStoreMedia = (dataUrl: string): boolean => {
  const currentSize = getStorageSize()
  const newSize = dataUrl.length
  return currentSize + newSize < MAX_STORAGE_SIZE
}

export const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new window.Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        if (width > 1920) {
          height = Math.round((height * 1920) / width)
          width = 1920
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL("image/jpeg", 0.8))
        } else {
          resolve(event.target?.result as string)
        }
      }
    }
  })
}
