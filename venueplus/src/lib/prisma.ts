import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Debug: Log environment variable status
if (process.env.NODE_ENV !== 'production') {
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
  console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length)
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV !== 'production' ? ['error', 'warn'] : [],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

