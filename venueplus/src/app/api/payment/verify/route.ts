import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyPaymentSignature, fetchPaymentDetails } from '@/lib/razorpay-config'

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
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = body

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      )
    }

    console.log('🔍 Payment Verification Debug:', {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      signature: razorpay_signature?.substring(0, 20) + '...',
      user_id: session.user.id,
    })

    // Find the payment record
    const payment = await prisma.payment.findUnique({
      where: {
        razorpayOrderId: razorpay_order_id,
      },
      include: {
        booking: true,
      },
    })

    if (!payment) {
      console.error('❌ Payment record not found for order:', razorpay_order_id)
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      )
    }

    // Verify that the payment belongs to the authenticated user
    if (payment.booking.userId !== session.user.id) {
      console.error('❌ Payment verification failed - user mismatch:', {
        payment_user: payment.booking.userId,
        session_user: session.user.id,
      })
      return NextResponse.json(
        { error: 'Unauthorized payment verification' },
        { status: 403 }
      )
    }

    // Verify payment signature
    const isSignatureValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isSignatureValid) {
      console.error('❌ Invalid payment signature:', {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      })

      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'failed',
          failureReason: 'Invalid signature',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      })

      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Fetch payment details from Razorpay to get additional information
    const paymentDetailsResult = await fetchPaymentDetails(razorpay_payment_id)
    
    let paymentMethod = 'unknown'
    let paymentMetadata = {}

    if (paymentDetailsResult.success && paymentDetailsResult.payment) {
      paymentMethod = paymentDetailsResult.payment.method || 'unknown'
      paymentMetadata = {
        status: paymentDetailsResult.payment.status,
        method: paymentDetailsResult.payment.method,
        bank: paymentDetailsResult.payment.bank,
        wallet: paymentDetailsResult.payment.wallet,
        vpa: paymentDetailsResult.payment.vpa,
        card_id: paymentDetailsResult.payment.card_id,
        email: paymentDetailsResult.payment.email,
        contact: paymentDetailsResult.payment.contact,
        created_at: paymentDetailsResult.payment.created_at,
      }
    }

    // Update payment record
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
        paymentMethod,
        metadata: paymentMetadata,
      },
    })

    // Update booking record
    const updatedBooking = await prisma.booking.update({
      where: { id: payment.booking.id },
      data: {
        status: 'confirmed',
        paymentStatus: 'paid',
        paidAmount: payment.amount / 100, // Convert paise to rupees
        paymentMethod,
      },
    })

    console.log('✅ Payment verified successfully:', {
      booking_id: payment.booking.id,
      booking_reference: payment.booking.bookingReference,
      payment_id: razorpay_payment_id,
      amount: payment.amount / 100,
      method: paymentMethod,
    })

    // TODO: Send confirmation email to user
    // TODO: Send booking confirmation SMS
    // TODO: Trigger any post-booking workflows

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      booking: {
        id: updatedBooking.id,
        bookingReference: updatedBooking.bookingReference,
        status: updatedBooking.status,
        paymentStatus: updatedBooking.paymentStatus,
        destination: updatedBooking.destination,
        totalAmount: updatedBooking.totalAmount,
        paidAmount: updatedBooking.paidAmount,
        paymentMethod: updatedBooking.paymentMethod,
        travelStartDate: updatedBooking.travelStartDate,
        travelEndDate: updatedBooking.travelEndDate,
        travelers: updatedBooking.travelers,
      },
      payment: {
        id: updatedPayment.id,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: updatedPayment.amount / 100,
        currency: updatedPayment.currency,
        method: paymentMethod,
        status: updatedPayment.status,
      },
    })

  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
