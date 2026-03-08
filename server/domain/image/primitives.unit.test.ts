import { describe, expect, test } from 'bun:test'
import { ImageBuffer, SupportedFormat } from './primitives'

describe('ImageBuffer', () => {
  test('creates branded buffer from valid Buffer', () => {
    const buffer = Buffer.from('test-image-data')
    const result = ImageBuffer(buffer)
    expect(Buffer.isBuffer(result)).toBe(true)
  })

  test('rejects empty buffer', () => {
    expect(() => ImageBuffer(Buffer.alloc(0))).toThrow()
  })

  test('rejects non-buffer', () => {
    expect(() => ImageBuffer('not a buffer')).toThrow()
  })
})

describe('SupportedFormat', () => {
  test('parses image/png', () => {
    expect(SupportedFormat('image/png')).toBe('png')
  })

  test('parses image/jpeg', () => {
    expect(SupportedFormat('image/jpeg')).toBe('jpeg')
  })

  test('parses image/webp', () => {
    expect(SupportedFormat('image/webp')).toBe('webp')
  })

  test('rejects unsupported format', () => {
    expect(() => SupportedFormat('image/gif')).toThrow('Unsupported image format')
  })

  test('rejects non-string', () => {
    expect(() => SupportedFormat(42)).toThrow()
  })
})
