'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TripData } from '../trip-planning-modal'
import RazorpayPayment from '../payment/razorpay-payment'

interface PaymentStepProps {
  tripData: TripData
  isAuthenticated: boolean
  onClose: () => void
}

export function PaymentStep({ tripData, isAuthenticated, onClose }: PaymentStepProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h3 className="text-xl font-semibold text-amber-800 mb-2">Authentication Required</h3>
          <p className="text-amber-700 mb-6">
            Please sign in to continue with the booking and payment process.
          </p>
          <button
            onClick={() => router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/create-trip'))}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  // Calculate trip details for payment
  const calculateDuration = () => {
    if (!tripData.duration) return 3
    const durationMap: { [key: string]: number } = {
      '4-6 Days': 5,
      '7-9 Days': 8,
      '10-12 Days': 11,
      '13-15 Days': 14,
    }
    return durationMap[tripData.duration] || 5
  }

  const calculateAmount = () => {
    if (tripData.budget?.total) {
      return tripData.budget.total
    }
    
    // Fallback calculation based on package price or estimated cost
    if (tripData.selectedPackage?.price) {
      return tripData.selectedPackage.price
    }
    
    // Basic estimation if no budget is set
    const baseCost = 3000 // Base cost per day per person
    const duration = calculateDuration()
    const travelers = parseInt(tripData.travelers?.replace(/\D/g, '') || '1')
    
    return baseCost * duration * travelers
  }

  const calculateEndDate = () => {
    if (!tripData.startDate) return new Date()
    const endDate = new Date(tripData.startDate)
    endDate.setDate(endDate.getDate() + calculateDuration())
    return endDate
  }

  const travelers = parseInt(tripData.travelers?.replace(/\D/g, '') || '1')
  const totalAmount = calculateAmount()
  const endDate = calculateEndDate()

  const bookingData = {
    packageId: tripData.selectedPackage?.id || 'custom-trip',
    amount: totalAmount,
    destination: tripData.destination || 'Unknown Destination',
    travelStartDate: tripData.startDate?.toISOString() || new Date().toISOString(),
    travelEndDate: endDate.toISOString(),
    travelers: travelers,
    contactInfo: {
      phone: '',
      email: '',
    },
    bookingData: {
      packageType: tripData.selectedPackage?.name || 'Custom Trip Package',
      fromCity: tripData.fromCity,
      selectedCities: tripData.selectedCities,
      duration: tripData.duration,
      budget: tripData.budget,
      itinerary: tripData.itinerary,
      rooms: tripData.rooms,
    },
    specialRequests: [],
  }

  const handlePaymentSuccess = async (result: any) => {
    console.log('Payment successful:', result)
    setIsProcessing(true)

    try {
      // Update user stats after successful booking
      const statsResponse = await fetch('/api/user/update-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingAmount: totalAmount,
          bookingId: result.booking.id,
        }),
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        console.log('User stats updated:', statsData.stats)
      } else {
        console.error('Failed to update user stats:', await statsResponse.text())
      }

      // Close the modal
      onClose()

      // Redirect to booking confirmation
      router.push(`/booking-confirmation?booking_id=${result.booking.id}&payment_id=${result.payment.id}`)

    } catch (error) {
      console.error('Error updating profile:', error)
      // Still redirect to confirmation even if profile update fails
      onClose()
      router.push(`/booking-confirmation?booking_id=${result.booking.id}&payment_id=${result.payment.id}`)
    }
  }

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error)
    // Don't close the modal, allow user to retry
  }

  const handlePaymentCancel = () => {
    console.log('Payment cancelled by user')
    // Don't close the modal, allow user to retry
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Trip Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Booking Summary</h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-3">Trip Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Destination:</span>
                  <span className="font-medium">{tripData.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{tripData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">
                    {tripData.startDate?.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">
                    {endDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travelers:</span>
                  <span className="font-medium">{travelers} person(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">From City:</span>
                  <span className="font-medium">{tripData.fromCity}</span>
                </div>
              </div>
            </div>

            {tripData.selectedPackage && (
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h4 className="font-semibold text-purple-900 mb-3">Selected Package</h4>
                <div className="space-y-2">
                  <div className="font-medium">{tripData.selectedPackage.name}</div>
                  <div className="text-sm text-gray-600">{tripData.selectedPackage.description}</div>
                  <div className="text-sm">
                    <span className="text-gray-600">Provider:</span> {tripData.selectedPackage.provider}
                  </div>
                </div>
              </div>
            )}

            {tripData.budget && (
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <h4 className="font-semibold text-green-900 mb-3">Budget Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Accommodation:</span>
                    <span>₹{tripData.budget.breakdown.accommodation?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transportation:</span>
                    <span>₹{tripData.budget.breakdown.transportation?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food:</span>
                    <span>₹{tripData.budget.breakdown.food?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activities:</span>
                    <span>₹{tripData.budget.breakdown.activities?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Budget:</span>
                    <span>₹{tripData.budget.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-900">
                ₹{totalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">Total Booking Amount</div>
            </div>
          </div>
        </div>

        {/* Right Side - Payment */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Complete Your Booking</h3>
              <p className="text-gray-600 mt-1">
                Secure payment powered by Razorpay
              </p>
            </div>

            <div className="p-6">
              <RazorpayPayment
                bookingData={bookingData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Security & Support Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Why Choose VenuePlus?</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>100% Secure Payment Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Instant Booking Confirmation</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Flexible Cancellation Policy</span>
              </div>
            </div>
          </div>

          {/* Test Mode Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">⚠️</span>
              <span className="text-sm font-medium text-yellow-800">Test Mode</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              This is using test payment credentials. No real money will be charged.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
