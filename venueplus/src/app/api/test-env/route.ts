import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    DATABASE_URL_exists: !!process.env.DATABASE_URL,
    DATABASE_URL_length: process.env.DATABASE_URL?.length,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    env_keys: Object.keys(process.env).filter(key => 
      key.includes('DATABASE') || 
      key.includes('NEXTAUTH') || 
      key.includes('NODE')
    )
  })
}
