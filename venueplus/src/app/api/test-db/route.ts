import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Simple test to check if Prisma is working
    const userCount = await prisma.user.count()
    const bookingCount = await prisma.booking.count()
    
    return NextResponse.json({
      success: true,
      userCount,
      bookingCount,
      message: 'Database connection working'
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
