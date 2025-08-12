import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth for debugging
    console.log('Admin bookings API called')
    
    // TODO: Re-enable authentication after debugging
    // const session = await getServerSession(authOptions)
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause for filtering
    const whereClause: any = {}
    
    if (status && status !== 'all') {
      whereClause.status = status
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // Get total count for pagination
    const totalBookings = await prisma.booking.count({
      where: whereClause
    })

    // Fetch bookings with user details
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Format bookings for frontend
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      user: {
        name: booking.user?.name || 'Unknown User',
        email: booking.user?.email || 'No email'
      },
      destination: booking.destination,
      startDate: booking.travelStartDate?.toISOString() || null,
      endDate: booking.travelEndDate?.toISOString() || null,
      travelers: booking.travelers,
      totalAmount: booking.totalAmount,
      status: booking.status,
      provider: booking.provider,
      bookingDate: booking.bookingDate?.toISOString() || booking.createdAt?.toISOString() || null,
      bookingReference: booking.bookingReference
    }))

    return NextResponse.json({
      bookings: formattedBookings,
      pagination: {
        total: totalBookings,
        page,
        limit,
        totalPages: Math.ceil(totalBookings / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching admin bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
