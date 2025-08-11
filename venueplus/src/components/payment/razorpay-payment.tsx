'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { formatAmount } from '@/lib/razorpay-config'

interface RazorpayPaymentProps {
  bookingData: {
    packageId?: string
    itineraryId?: string
    amount: number
    currency?: string
    destination: string
    travelStartDate: string
    travelEndDate: string
    travelers: number
    contactInfo?: any
    bookingData?: any
    specialRequests?: string[]
  }
  onSuccess?: (result: any) => void
  onError?: (error: any) => void
  onCancel?: () => void
  disabled?: boolean
  className?: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  image: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name?: string
    email?: string
    contact?: string
  }
  notes: Record<string, any>
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayPayment({
  bookingData,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
  className = '',
}: RazorpayPaymentProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          setRazorpayLoaded(true)
          resolve(true)
        }
        script.onerror = () => {
          console.error('Failed to load Razorpay script')
          setError('Failed to load payment gateway')
          resolve(false)
        }
        document.body.appendChild(script)
      })
    }

    if (!window.Razorpay) {
      loadRazorpayScript()
    } else {
      setRazorpayLoaded(true)
    }
  }, [])

  const handlePayment = async () => {
    if (!session?.user) {
      setError('Please sign in to continue with payment')
      return
    }

    if (!razorpayLoaded) {
      setError('Payment gateway is still loading. Please try again.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('🚀 Initiating payment for:', {
        destination: bookingData.destination,
        amount: bookingData.amount,
        travelers: bookingData.travelers,
      })

      // Create payment order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      console.log('✅ Payment order created:', {
        orderId: orderData.order.id,
        bookingReference: orderData.booking.bookingReference,
      })

      // Prepare Razorpay options
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_sQhv40TIPF75eP',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'VenuePlus',
        description: `${bookingData.destination} - ${bookingData.travelers} traveler(s)`,
        image: '/logo.png',
        order_id: orderData.order.id,
        handler: async (response: any) => {
          console.log('💳 Payment response received:', {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
          })

          // Verify payment
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed')
            }

            console.log('✅ Payment verified successfully:', {
              booking_reference: verifyData.booking.bookingReference,
              payment_method: verifyData.payment.method,
            })

            onSuccess?.(verifyData)
          } catch (verifyError: any) {
            console.error('❌ Payment verification failed:', verifyError)
            onError?.(verifyError)
          }
        },
        prefill: {
          name: session.user.name || '',
          email: session.user.email || '',
          contact: bookingData.contactInfo?.phone || '',
        },
        notes: {
          booking_reference: orderData.booking.bookingReference,
          destination: bookingData.destination,
          travelers: bookingData.travelers.toString(),
        },
        theme: {
          color: '#667eea',
        },
        modal: {
          ondismiss: () => {
            console.log('💔 Payment cancelled by user')
            setIsLoading(false)
            onCancel?.()
          },
        },
      }

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error: any) {
      console.error('❌ Payment initiation failed:', error)
      setError(error.message || 'Failed to initiate payment')
      setIsLoading(false)
      onError?.(error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  return (
    <div className={`payment-container ${className}`}>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Destination:</span>
              <span className="font-medium">{bookingData.destination}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Travelers:</span>
              <span className="font-medium">{bookingData.travelers} person(s)</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Travel Dates:</span>
              <span className="font-medium">
                {new Date(bookingData.travelStartDate).toLocaleDateString()} - {' '}
                {new Date(bookingData.travelEndDate).toLocaleDateString()}
              </span>
            </div>
            
            <hr className="my-4" />
            
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-blue-600">{formatCurrency(bookingData.amount)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={disabled || isLoading || !razorpayLoaded || !session?.user}
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200
            ${
              disabled || isLoading || !razorpayLoaded || !session?.user
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : !session?.user ? (
            'Please Sign In to Pay'
          ) : !razorpayLoaded ? (
            'Loading Payment Gateway...'
          ) : (
            `Pay ${formatCurrency(bookingData.amount)}`
          )}
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔐 Secured by Razorpay | Test Mode
          </p>
        </div>
      </div>
    </div>
  )
}

