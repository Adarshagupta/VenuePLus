import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Test DB endpoint called')
    
    // Check if Prisma client is available
    let prismaStatus = 'not available'
    let userCount = 0
    let bookingCount = 0
    let prismaError = null

    try {
      const { prisma } = await import('@/lib/prisma')
      console.log('Prisma imported successfully')
      
      if (!prisma) {
        throw new Error('Prisma client is null')
      }

      prismaStatus = 'available'
      console.log('Attempting to count users...')
      userCount = await prisma.user.count()
      console.log('User count:', userCount)
      
      console.log('Attempting to count bookings...')
      bookingCount = await prisma.booking.count()
      console.log('Booking count:', bookingCount)
      
    } catch (err) {
      console.error('Prisma error:', err)
      prismaError = err instanceof Error ? err.message : 'Unknown prisma error'
    }

    return NextResponse.json({
      success: true,
      prismaStatus,
      userCount,
      bookingCount,
      prismaError,
      message: 'Test endpoint working',
      env: {
        databaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
