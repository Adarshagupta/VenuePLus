import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { userService } from '@/lib/user-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)

    // Parse filter parameters
    const filter: any = {}
    
    const status = searchParams.get('status')
    if (status) {
      filter.status = status.split(',')
    }
    
    const destination = searchParams.get('destination')
    if (destination) {
      filter.destination = destination.split(',')
    }
    
    const paymentStatus = searchParams.get('paymentStatus')
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus.split(',')
    }
    
    const minAmount = searchParams.get('minAmount')
    const maxAmount = searchParams.get('maxAmount')
    if (minAmount && maxAmount) {
      filter.amountRange = {
        min: parseFloat(minAmount),
        max: parseFloat(maxAmount)
      }
    }
    
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate && endDate) {
      filter.dateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      }
    }
    
    const sortBy = searchParams.get('sortBy')
    const sortOrder = searchParams.get('sortOrder')
    if (sortBy) {
      filter.sortBy = sortBy
      filter.sortOrder = sortOrder || 'desc'
    }

    const bookings = await userService.getUserBookings(session.user.id, filter)
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const bookingData = await request.json()
    const booking = await userService.addBooking(session.user.id, bookingData)
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 400 }
      )
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
