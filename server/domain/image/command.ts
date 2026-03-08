import { readFile, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createLogger } from '~/system/logger'
import type { ImageBuffer } from './types'

const log = createLogger('image')

const pythonScript = `
import sys
from rembg import remove
from PIL import Image
import io

input_path = sys.argv[1]
output_path = sys.argv[2]

with open(input_path, 'rb') as f:
    input_data = f.read()

output_data = remove(input_data)

with open(output_path, 'wb') as f:
    f.write(output_data)
`

export const ImageCommand = {
  removeBackground: async (image: ImageBuffer) => {
    const id = crypto.randomUUID()
    const inputPath = join(tmpdir(), `transparent-input-${id}`)
    const outputPath = join(tmpdir(), `transparent-output-${id}.png`)

    try {
      await writeFile(inputPath, image)

      const process = Bun.spawn(
        [
          'uv',
          'run',
          '--with',
          'rembg',
          '--with',
          'onnxruntime',
          '--with',
          'pillow',
          'python3',
          '-c',
          pythonScript,
          inputPath,
          outputPath,
        ],
        { stderr: 'pipe', stdout: 'pipe' },
      )

      const exitCode = await process.exited

      if (exitCode !== 0) {
        const stderr = await new Response(process.stderr).text()
        log.error('rembg failed', { exitCode, stderr })
        return { outcome: 'processing-failed', error: stderr } as const
      }

      const outputBuffer = await readFile(outputPath)
      return { outcome: 'background-removed', image: outputBuffer } as const
    } finally {
      await Promise.allSettled([unlink(inputPath), unlink(outputPath)])
    }
  },
}
