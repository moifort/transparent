import { match } from 'ts-pattern'
import { ImageCommand } from '~/domain/image/command'
import { ImageBuffer, SupportedFormat } from '~/domain/image/primitives'
import { config } from '~/system/config/index'

export default defineEventHandler(async (event) => {
  const { maxFileSizeMb } = config()
  const maxBytes = maxFileSizeMb * 1024 * 1024

  const formData = await readMultipartFormData(event)
  if (!formData)
    throw createError({ statusCode: 400, statusMessage: 'Expected multipart form data' })

  const imageField = formData.find(({ name }) => name === 'image')
  if (!imageField) throw createError({ statusCode: 400, statusMessage: 'Missing "image" field' })

  if (imageField.data.length > maxBytes)
    throw createError({
      statusCode: 413,
      statusMessage: `File too large. Max: ${maxFileSizeMb}MB`,
    })

  const mimeType = imageField.type ?? 'application/octet-stream'
  try {
    SupportedFormat(mimeType)
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: `Unsupported format: ${mimeType}. Supported: png, jpeg, webp`,
    })
  }

  const image = ImageBuffer(imageField.data)
  const result = await ImageCommand.removeBackground(image)

  return match(result)
    .with({ outcome: 'background-removed' }, ({ image }) => {
      setResponseHeader(event, 'content-type', 'image/png')
      return image
    })
    .with({ outcome: 'processing-failed' }, ({ error }) => {
      throw createError({ statusCode: 422, statusMessage: `Processing failed: ${error}` })
    })
    .exhaustive()
})
