import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createRazorpayOrder, convertToPaise } from '@/lib/razorpay-config'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      packageId,
      itineraryId,
      amount,
      currency = 'INR',
      destination,
      travelStartDate,
      travelEndDate,
      travelers,
      contactInfo,
      bookingData,
      specialRequests = [],
    } = body

    // Validate required fields
    if (!amount || !destination || !travelStartDate || !travelEndDate || !travelers) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount <= 0 || amount > 10000000) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be between ₹1 and ₹1,00,000' },
        { status: 400 }
      )
    }

    // Convert amount to paise
    const amountInPaise = convertToPaise(amount)

    // Generate unique booking reference
    const bookingReference = `VNP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    const receiptId = `receipt_${uuidv4().replace(/-/g, '').substring(0, 16)}`

    // Create Razorpay order
    const orderResult = await createRazorpayOrder({
      amount: amountInPaise,
      currency,
      receipt: receiptId,
      notes: {
        booking_reference: bookingReference,
        user_id: session.user.id,
        package_id: packageId || '',
        itinerary_id: itineraryId || '',
        destination,
        travelers: travelers.toString(),
      },
    })

    if (!orderResult.success) {
      console.error('Failed to create Razorpay order:', orderResult.error)
      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      )
    }

    // Create booking record in database
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        bookingReference,
        itineraryId,
        packageId,
        status: 'pending',
        travelStartDate: new Date(travelStartDate),
        travelEndDate: new Date(travelEndDate),
        destination,
        travelers: parseInt(travelers.toString()),
        totalAmount: amount,
        paidAmount: 0,
        currency,
        paymentStatus: 'pending',
        provider: 'razorpay',
        contactInfo: contactInfo || {},
        bookingData: bookingData || {},
        specialRequests,
      },
    })

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: orderResult.order.id,
        amount: amountInPaise,
        currency,
        status: 'created',
        description: `Payment for ${destination} trip - ${travelers} traveler(s)`,
        notes: orderResult.order.notes,
      },
    })

    console.log('✅ Booking created:', {
      bookingId: booking.id,
      bookingReference,
      orderId: orderResult.order.id,
      amount: amount,
      destination,
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingReference,
        amount: amount,
        currency,
        destination,
        travelStartDate,
        travelEndDate,
        travelers,
      },
      order: {
        id: orderResult.order.id,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
      },
      payment: {
        id: payment.id,
      },
    })

  } catch (error: any) {
    console.error('Error creating payment order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
