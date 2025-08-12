import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyPaymentSignature } from '@/lib/razorpay-config'
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
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      booking_reference
    } = await request.json()

    // Verify payment signature
    const isValidSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Update ticket booking with payment details
    const updatedBooking = await (prisma as any).ticketBooking.update({
      where: {
        bookingReference: booking_reference
      },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: 'paid',
        status: 'confirmed'
      },
      include: {
        user: true
      }
    })

    // Send confirmation email with QR code
    try {
      await sendTicketConfirmationEmail(
        updatedBooking.user.email,
        updatedBooking.user.name || 'Traveler',
        updatedBooking
      )
      
      // Mark email as sent
      await (prisma as any).ticketBooking.update({
        where: { id: updatedBooking.id },
        data: { emailSent: true }
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the payment verification if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and ticket confirmed',
      booking: updatedBooking
    })

  } catch (error) {
    console.error('Error verifying ticket payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
