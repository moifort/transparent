import { mock } from 'bun:test'

// @ts-expect-error — global mock for Nitro's defineEventHandler
globalThis.defineEventHandler = (handler: (...args: never[]) => unknown) => handler

// @ts-expect-error — global mock for Nitro's createError
globalThis.createError = (opts: { statusCode: number; statusMessage: string }) =>
  Object.assign(new Error(opts.statusMessage), opts)

// @ts-expect-error — global mock for h3's readBody
globalThis.readBody = (_event: MockEvent) => Promise.resolve(_event.__body)

// @ts-expect-error — global mock for Nitro's useRuntimeConfig
globalThis.useRuntimeConfig = () => ({
  apiToken: '',
  maxFileSizeMb: '10',
})

type MockEvent = {
  __body?: unknown
  __query?: Record<string, string>
  __params?: Record<string, string>
}

export const mockEvent = (opts?: {
  body?: unknown
  query?: Record<string, string>
  params?: Record<string, string>
}): MockEvent => ({
  __body: opts?.body,
  __query: opts?.query,
  __params: opts?.params,
})

mock.module('~/system/logger', () => ({
  createLogger: () => ({
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  }),
}))
