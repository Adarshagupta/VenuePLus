'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { SmartBookingPanel } from '@/components/booking/smart-booking-panel'
import { BookingOption } from '@/lib/booking-agent'

export default function BookingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedBookings, setSelectedBookings] = useState<BookingOption[]>([])

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/booking')
      return
    }
  }, [session, status, router])

  const handleBookingSelect = (booking: BookingOption) => {
    setSelectedBookings(prev => {
      const exists = prev.find(b => b.id === booking.id)
      if (exists) {
        return prev.filter(b => b.id !== booking.id)
      }
      return [...prev, booking]
    })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking assistant...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-12">
        <SmartBookingPanel 
          onBookingSelect={handleBookingSelect}
        />

        {/* Selected Bookings Comparison */}
        {selectedBookings.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">Selected for Comparison ({selectedBookings.length})</h3>
                  <div className="flex space-x-2">
                    {selectedBookings.map(booking => (
                      <div key={booking.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm">
                        {booking.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedBookings([])}
                    className="btn-secondary"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => {/* Open comparison modal */}}
                    className="btn-primary"
                    disabled={selectedBookings.length < 2}
                  >
                    Compare Options
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
