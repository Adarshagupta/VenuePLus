import Razorpay from 'razorpay'

// Razorpay instance for server-side operations
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_sQhv40TIPF75eP',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'eSvXAUqb4jv9pDyMoZgzBOWv',
})

// Client-side configuration
export const razorpayConfig = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_sQhv40TIPF75eP',
  currency: 'INR',
  name: 'VenuePlus',
  description: 'Travel Package Booking',
  image: '/logo.png',
  theme: {
    color: '#667eea'
  }
}

// Payment options interface
export interface RazorpayPaymentOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  image: string
  order_id: string
  handler: (response: RazorpayPaymentResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, any>
  theme?: {
    color: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

// Razorpay payment response interface
export interface RazorpayPaymentResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

// Order creation options
export interface CreateOrderOptions {
  amount: number // Amount in paise (multiply by 100)
  currency?: string
  receipt: string
  notes?: Record<string, any>
}

// Create Razorpay order
export async function createRazorpayOrder(options: CreateOrderOptions) {
  try {
    const order = await razorpay.orders.create({
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt,
      notes: options.notes,
    })
    
    return {
      success: true,
      order,
    }
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    return {
      success: false,
      error: error.message || 'Failed to create order',
    }
  }
}

// Verify payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'eSvXAUqb4jv9pDyMoZgzBOWv')
      .update(`${orderId}|${paymentId}`)
      .digest('hex')
    
    return expectedSignature === signature
  } catch (error) {
    console.error('Error verifying payment signature:', error)
    return false
  }
}

// Fetch payment details
export async function fetchPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId)
    return {
      success: true,
      payment,
    }
  } catch (error: any) {
    console.error('Error fetching payment details:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch payment details',
    }
  }
}

// Refund payment
export async function createRefund(paymentId: string, amount?: number, notes?: Record<string, any>) {
  try {
    const refundData: any = {}
    
    if (amount) {
      refundData.amount = amount
    }
    
    if (notes) {
      refundData.notes = notes
    }
    
    const refund = await razorpay.payments.refund(paymentId, refundData)
    
    return {
      success: true,
      refund,
    }
  } catch (error: any) {
    console.error('Error creating refund:', error)
    return {
      success: false,
      error: error.message || 'Failed to create refund',
    }
  }
}

// Format amount for display (convert paise to rupees)
export function formatAmount(amountInPaise: number): string {
  const amountInRupees = amountInPaise / 100
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amountInRupees)
}

// Convert rupees to paise for Razorpay
export function convertToPaise(amountInRupees: number): number {
  return Math.round(amountInRupees * 100)
}
