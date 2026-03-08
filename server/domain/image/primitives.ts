import { make } from 'ts-brand'
import { z } from 'zod'
import type {
  ImageBuffer as ImageBufferType,
  SupportedFormat as SupportedFormatType,
} from '~/domain/image/types'

const mimeToFormat: Record<string, SupportedFormatType> = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/webp': 'webp',
}

export const ImageBuffer = (value: unknown) => {
  const v = z.instanceof(Buffer).parse(value)
  if (v.length === 0) throw new Error('Buffer must not be empty')
  return make<ImageBufferType>()(v)
}

export const SupportedFormat = (mimeType: unknown) => {
  const v = z.string().parse(mimeType)
  const format = mimeToFormat[v]
  if (!format) {
    throw new Error(`Unsupported image format: ${v}. Supported: png, jpeg, webp`)
  }
  return format
}
