import { make } from 'ts-brand'
import { z } from 'zod'
import type {
  ApiToken as ApiTokenType,
  MaxFileSizeMb as MaxFileSizeMbType,
} from '~/system/config/types'

export const ApiToken = (value: unknown) => {
  const v = z.string().min(1).parse(value)
  return make<ApiTokenType>()(v)
}

export const MaxFileSizeMb = (value: unknown) => {
  const v = z.coerce.number().int().min(1).parse(value)
  return make<MaxFileSizeMbType>()(v)
}
