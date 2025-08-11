import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const bookingId = params.id

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Fetch booking with related data
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Verify that the booking belongs to the authenticated user
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to booking' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingReference: booking.bookingReference,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        destination: booking.destination,
        totalAmount: booking.totalAmount,
        paidAmount: booking.paidAmount,
        paymentMethod: booking.paymentMethod,
        travelStartDate: booking.travelStartDate,
        travelEndDate: booking.travelEndDate,
        travelers: booking.travelers,
        contactInfo: booking.contactInfo,
        bookingData: booking.bookingData,
        specialRequests: booking.specialRequests,
        provider: booking.provider,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        payments: booking.payments.map(payment => ({
          id: payment.id,
          amount: payment.amount / 100, // Convert paise to rupees
          currency: payment.currency,
          status: payment.status,
          paymentMethod: payment.paymentMethod,
          razorpayPaymentId: payment.razorpayPaymentId,
          razorpayOrderId: payment.razorpayOrderId,
          createdAt: payment.createdAt,
        })),
      },
    })

  } catch (error: any) {
    console.error('Error fetching booking details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const bookingId = params.id
    const body = await request.json()

    const {
      status,
      contactInfo,
      specialRequests,
    } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // First, verify the booking exists and belongs to the user
    const existingBooking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (existingBooking.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to booking' },
        { status: 403 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      updateData.status = status
    }

    if (contactInfo) {
      updateData.contactInfo = contactInfo
    }

    if (specialRequests) {
      updateData.specialRequests = specialRequests
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully',
      booking: {
        id: updatedBooking.id,
        bookingReference: updatedBooking.bookingReference,
        status: updatedBooking.status,
        paymentStatus: updatedBooking.paymentStatus,
        destination: updatedBooking.destination,
        totalAmount: updatedBooking.totalAmount,
        paidAmount: updatedBooking.paidAmount,
        contactInfo: updatedBooking.contactInfo,
        specialRequests: updatedBooking.specialRequests,
        updatedAt: updatedBooking.updatedAt,
      },
    })

  } catch (error: any) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
