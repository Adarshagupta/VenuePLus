import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Debug: Log environment variable status
if (process.env.NODE_ENV !== 'production') {
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
  console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length)
}

// Only create Prisma client if DATABASE_URL is available
export const prisma = globalForPrisma.prisma ?? (
  process.env.DATABASE_URL 
    ? new PrismaClient({
        log: process.env.NODE_ENV !== 'production' ? ['error', 'warn'] : [],
      })
    : null as any // Fallback when no database is available
)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

