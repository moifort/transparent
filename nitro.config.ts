export default defineNitroConfig({
  compatibilityDate: '2026-02-06',
  experimental: { asyncContext: true },
  srcDir: 'server',
  ignore: ['test/**', '**/*.test.ts'],
  runtimeConfig: {
    apiToken: '',
    maxFileSizeMb: '10',
  },
})
