'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import RazorpayPayment from '@/components/payment/razorpay-payment'

export default function TestPaymentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [bookingData, setBookingData] = useState({
    packageId: 'test-package-001',
    amount: 15000, // ₹15,000
    destination: 'Goa Beach Paradise',
    travelStartDate: '2024-12-25',
    travelEndDate: '2024-12-28',
    travelers: 2,
    contactInfo: {
      phone: '+91-9876543210',
      email: session?.user?.email || '',
    },
    bookingData: {
      packageType: 'Luxury Beach Resort',
      inclusions: ['Hotel Stay', 'Breakfast', 'Airport Transfer', 'Sightseeing'],
    },
    specialRequests: ['Late checkout', 'Sea view room'],
  })

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)

  const handlePaymentSuccess = (result: any) => {
    console.log('Payment Success:', result)
    setPaymentStatus('success')
    setResult(result)
    
    // Redirect to booking confirmation page
    setTimeout(() => {
      router.push(`/booking-confirmation?booking_id=${result.booking.id}&payment_id=${result.payment.id}`)
    }, 2000)
  }

  const handlePaymentError = (error: any) => {
    console.error('Payment Error:', error)
    setPaymentStatus('error')
    setResult(error)
  }

  const handlePaymentCancel = () => {
    console.log('Payment Cancelled')
    setPaymentStatus('idle')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to test the payment functionality.</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Razorpay Payment</h1>
          <p className="text-lg text-gray-600">
            Test the payment integration with sample booking data
          </p>
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              🧪 <strong>Test Mode:</strong> This is using Razorpay test credentials. No real money will be charged.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Package Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Package:</span>
                <span className="font-medium">{bookingData.bookingData.packageType}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Destination:</span>
                <span className="font-medium">{bookingData.destination}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {new Date(bookingData.travelStartDate).toLocaleDateString()} - {' '}
                  {new Date(bookingData.travelEndDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Travelers:</span>
                <span className="font-medium">{bookingData.travelers} person(s)</span>
              </div>

              <hr className="my-4" />

              <div>
                <span className="text-gray-600 block mb-2">Inclusions:</span>
                <ul className="list-disc list-inside space-y-1">
                  {bookingData.bookingData.inclusions.map((inclusion: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700">{inclusion}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-gray-600 block mb-2">Special Requests:</span>
                <ul className="list-disc list-inside space-y-1">
                  {bookingData.specialRequests.map((request: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700">{request}</li>
                  ))}
                </ul>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-green-600">₹{bookingData.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Edit Booking Data */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Customize Test Data</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={bookingData.amount}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      amount: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={bookingData.destination}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      destination: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travelers
                  </label>
                  <input
                    type="number"
                    value={bookingData.travelers}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      travelers: parseInt(e.target.value) || 1
                    })}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            {paymentStatus === 'idle' && (
              <RazorpayPayment
                bookingData={bookingData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
                className="h-fit"
              />
            )}

            {paymentStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <svg className="h-8 w-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <h3 className="text-lg font-semibold text-green-900">Payment Successful!</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p><strong>Booking Reference:</strong> {result?.booking?.bookingReference}</p>
                  <p><strong>Payment ID:</strong> {result?.payment?.paymentId}</p>
                  <p><strong>Amount:</strong> ₹{result?.payment?.amount}</p>
                  <p><strong>Method:</strong> {result?.payment?.method}</p>
                </div>
                
                <p className="text-green-700 mt-4">
                  Redirecting to confirmation page...
                </p>
              </div>
            )}

            {paymentStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <svg className="h-8 w-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <h3 className="text-lg font-semibold text-red-900">Payment Failed</h3>
                </div>
                
                <p className="text-red-700 mb-4">{result?.message || 'Something went wrong'}</p>
                
                <button
                  onClick={() => setPaymentStatus('idle')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Test Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Test Payment Instructions</h3>
              <div className="text-blue-800 text-sm space-y-2">
                <p><strong>Test Card Numbers:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Success:</strong> 4111 1111 1111 1111</li>
                  <li><strong>Failure:</strong> 4000 0000 0000 0002</li>
                </ul>
                <p><strong>CVV:</strong> Any 3 digits</p>
                <p><strong>Expiry:</strong> Any future date</p>
                <p><strong>OTP:</strong> Any 6 digits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
