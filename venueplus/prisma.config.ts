import { defineConfig } from 'prisma/config'

export default defineConfig({
  seed: 'npx tsx prisma/seed.ts'
})
