'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface BookingDetails {
  id: string
  bookingReference: string
  status: string
  paymentStatus: string
  destination: string
  totalAmount: number
  paidAmount: number
  paymentMethod: string
  travelStartDate: string
  travelEndDate: string
  travelers: number
}

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const bookingId = searchParams.get('booking_id')
  const paymentId = searchParams.get('payment_id')

  useEffect(() => {
    if (sessionStatus === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href))
      return
    }

    if (!bookingId) {
      setError('Booking ID not found')
      setIsLoading(false)
      return
    }

    fetchBookingDetails()
  }, [bookingId, session, sessionStatus, router])

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/booking/${bookingId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking details')
      }

      const data = await response.json()
      setBooking(data.booking)
    } catch (error: any) {
      console.error('Error fetching booking details:', error)
      setError(error.message || 'Failed to load booking details')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (sessionStatus === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Booking not found</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your booking. Your trip to {booking.destination} is confirmed.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <p className="text-blue-100">Reference: {booking.bookingReference}</p>
          </div>
          
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Trip Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Destination:</span>
                    <span className="ml-2 font-medium">{booking.destination}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Travelers:</span>
                    <span className="ml-2 font-medium">{booking.travelers} person(s)</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-in:</span>
                    <span className="ml-2 font-medium">{formatDate(booking.travelStartDate)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-out:</span>
                    <span className="ml-2 font-medium">{formatDate(booking.travelEndDate)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Payment Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="ml-2 font-medium">{formatCurrency(booking.totalAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Paid Amount:</span>
                    <span className="ml-2 font-medium text-green-600">{formatCurrency(booking.paidAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="ml-2 font-medium capitalize">{booking.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                      booking.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View My Bookings
          </button>
          
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Print Confirmation
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Book Another Trip
          </button>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              You will receive a confirmation email with detailed itinerary shortly
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Check your dashboard for booking status and updates
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Our travel experts will contact you within 24 hours to finalize details
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Save this confirmation page or take a screenshot for your records
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="mt-6 text-center text-gray-600">
          <p>Need help? Contact us at <a href="mailto:support@venueplus.com" className="text-blue-600 hover:underline">support@venueplus.com</a> or call +91-XXXX-XXXXXX</p>
        </div>
      </div>
    </div>
  )
}
