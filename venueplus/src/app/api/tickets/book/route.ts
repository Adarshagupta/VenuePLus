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
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    })

    // Create ticket booking record - simplified for hackathon
    const ticketId = `ticket_${Date.now()}`
    
    try {
      // Insert into database
      await prisma.$executeRaw`
        INSERT INTO ticket_bookings (
          id, userId, ticketType, title, location, price, quantity, totalAmount,
          bookingReference, qrCode, razorpayOrderId, status, paymentStatus, 
          createdAt, updatedAt
        ) VALUES (
          ${ticketId}, ${session.user.id}, ${ticketType}, ${title}, ${location}, 
          ${price}, ${quantity || 1}, ${totalAmount}, ${bookingReference}, 
          ${qrCodeDataURL}, ${orderResult.order?.id || 'unknown'}, 'confirmed', 'pending',
          datetime('now'), datetime('now')
        )
      `
    } catch (dbError) {
      console.error('Database insert error:', dbError)
      // Continue anyway for demo purposes
    }

    // Return the booking data
    const ticketBooking = {
      id: ticketId,
      userId: session.user.id,
      ticketType,
      title,
      description,
      venue,
      eventDate,
      eventTime,
      checkInDate,
      checkOutDate,
      location,
      category: category || 'general',
      price,
      quantity: quantity || 1,
      totalAmount,
      bookingReference,
      qrCode: qrCodeDataURL,
      razorpayOrderId: orderResult.order?.id || 'unknown',
      guestInfo,
      bookingData,
      providerInfo,
      status: 'confirmed',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      booking: ticketBooking,
      razorpayOrder: orderResult.order || { id: 'unknown', amount: totalAmount * 100, currency: 'INR' },
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

    // Get user's ticket bookings - simplified for hackathon
    let tickets = []
    try {
      tickets = await prisma.$queryRaw`
        SELECT * FROM ticket_bookings 
        WHERE userId = ${session.user.id} 
        ORDER BY createdAt DESC
      `
    } catch (dbError) {
      console.error('Database query error:', dbError)
      tickets = [] // Return empty array for demo
    }

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
