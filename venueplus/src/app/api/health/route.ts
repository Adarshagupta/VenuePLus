import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'VenuePlus API is running',
    environment: process.env.NODE_ENV || 'unknown',
    hasDatabase: !!process.env.DATABASE_URL && process.env.DATABASE_URL !== 'postgresql://dummy:dummy@localhost:5432/dummy'
  })
}
