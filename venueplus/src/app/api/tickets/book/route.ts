import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createRazorpayOrder } from '@/lib/razorpay-config'
import QRCode from 'qrcode'
import { sendTicketConfirmationEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const {
      ticketType,
      title,
      description,
      venue,
      eventDate,
      eventTime,
      checkInDate,
      checkOutDate,
      location,
      category,
      price,
      quantity,
      guestInfo,
      bookingData,
      providerInfo
    } = await request.json()

    // Validate required fields
    if (!ticketType || !title || !location || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const totalAmount = price * (quantity || 1)
    const bookingReference = `VPT${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Create Razorpay order
    const orderResult = await createRazorpayOrder({
      amount: totalAmount * 100, // Convert to paise
      receipt: bookingReference,
      notes: {
        ticketType,
        title,
        bookingReference,
        userId: session.user.id
      }
    })

    if (!orderResult.success) {
      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      )
    }

    // Generate QR code data
    const qrData = {
      bookingReference,
      ticketType,
      title,
      venue,
      eventDate,
      guestName: guestInfo?.name || session.user.name,
      timestamp: new Date().toISOString()
    }

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    })

    // Create ticket booking record
    const ticketBooking = await (prisma as any).ticketBooking.create({
      data: {
        userId: session.user.id,
        ticketType,
        title,
        description,
        venue,
        eventDate: eventDate ? new Date(eventDate) : null,
        eventTime,
        checkInDate: checkInDate ? new Date(checkInDate) : null,
        checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
        location,
        category: category || 'general',
        price,
        quantity: quantity || 1,
        totalAmount,
        bookingReference,
        qrCode: qrCodeDataURL,
        razorpayOrderId: orderResult.order.id,
        guestInfo,
        bookingData,
        providerInfo,
        status: 'confirmed',
        paymentStatus: 'paid' // Will be updated after payment verification
      }
    })

    return NextResponse.json({
      success: true,
      booking: ticketBooking,
      razorpayOrder: orderResult.order,
      qrCode: qrCodeDataURL
    })

  } catch (error) {
    console.error('Error creating ticket booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's ticket bookings
    const tickets = await (prisma as any).ticketBooking.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      tickets
    })

  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
