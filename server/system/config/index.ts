import { ApiToken, MaxFileSizeMb } from '~/system/config/primitives'

export const config = () => {
  const runtimeConfig = useRuntimeConfig()
  return {
    apiToken: runtimeConfig.apiToken ? ApiToken(runtimeConfig.apiToken) : undefined,
    maxFileSizeMb: MaxFileSizeMb(runtimeConfig.maxFileSizeMb),
  }
}
