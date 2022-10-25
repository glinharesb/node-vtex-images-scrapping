import axios from 'axios'
import { readdir, unlink, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { fileTypeFromBuffer } from 'file-type'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  console.clear()
  console.log(`~> Cleaning dist folder...`)
  await clearDistFolder()

  const BASE_URL = `https://${process.env.STORE_NAME}.vteximg.com.br/arquivos/ids/`

  for (let id = process.env.ID_START; id <= process.env.ID_FINISH; id++) {
    const url = BASE_URL + id

    try {
      const { status, data } = await axios.get(url, {
        responseType: 'arraybuffer'
      })

      if (status === 404) {
        continue
      }

      const { ext } = await fileTypeFromBuffer(data)
      writeFile(`./dist/${id}.${ext}`, data)

      console.log(`~> Image saved success: ${id}.${ext}`)
    } catch (error) {
      continue
    }
  }
}

async function clearDistFolder() {
  const dir = './dist'

  for (const file of await readdir(dir)) {
    await unlink(join(dir, file))
  }
}

main()
