'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  User, Phone, Mail, MapPin, Calendar, Users, CreditCard, 
  Lock, Shield, CheckCircle, AlertCircle, ArrowLeft, Plus, Minus 
} from 'lucide-react'
import RazorpayPayment from '@/components/payment/razorpay-payment'

interface TravelerDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  passportNumber: string
  passportExpiry: string
  nationality: string
  gender: 'male' | 'female' | 'other'
  specialRequests?: string
}

interface PackageData {
  id: string
  name: string
  description: string
  price: number
  duration: string
  destination: string
  inclusions: string[]
  exclusions: string[]
  provider: string
  images: string[]
}

export default function BookPackagePage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [packageData, setPackageData] = useState<PackageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Booking details
  const [bookingDetails, setBookingDetails] = useState({
    travelDate: '',
    returnDate: '',
    numberOfTravelers: 1,
    roomRequirement: 'single',
    specialRequests: '',
  })

  // Traveler details
  const [travelers, setTravelers] = useState<TravelerDetails[]>([
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      passportNumber: '',
      passportExpiry: '',
      nationality: 'India',
      gender: 'male',
      specialRequests: '',
    }
  ])

  const packageId = searchParams.get('packageId')
  const destination = searchParams.get('destination')
  const price = searchParams.get('price')
  const duration = searchParams.get('duration')

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href))
      return
    }

    loadPackageData()
  }, [packageId, session, status, router])

  const loadPackageData = async () => {
    try {
      setLoading(true)
      
      // Check if this is a dynamic package (scraped or AI generated) or custom package
      const isDynamicPackage = packageId?.startsWith('scraped_') || packageId?.startsWith('ai_') || packageId === 'custom-package' || !packageId
      
      if (isDynamicPackage) {
        // Create package data from URL parameters for dynamic/custom packages
        const provider = searchParams.get('provider') || 'VenuePlus'
        const name = searchParams.get('name') || `${destination} Adventure Package`
        const description = searchParams.get('description') || `Explore the beautiful ${destination} with our carefully curated package`
        
        const mockPackage: PackageData = {
          id: packageId || 'custom-package',
          name: decodeURIComponent(name),
          description: decodeURIComponent(description),
          price: parseInt(price || '15000'),
          duration: duration || '5 Days 4 Nights',
          destination: destination || 'Unknown',
          inclusions: [
            'Accommodation',
            'Daily Breakfast',
            'Airport Transfers',
            'Local Sightseeing',
            'Professional Guide'
          ],
          exclusions: [
            'International Flights',
            'Personal Expenses',
            'Travel Insurance',
            'Lunch and Dinner'
          ],
          provider: decodeURIComponent(provider),
          images: [`https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`]
        }
        setPackageData(mockPackage)
        setLoading(false)
        return
      }

      // For database packages, try to fetch from API
      const response = await fetch(`/api/packages/${packageId}`)
      if (response.ok) {
        const data = await response.json()
        
        // Transform API data to match PackageData interface
        const transformedPackage: PackageData = {
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
          destination: data.destination,
          provider: data.provider,
          inclusions: data.inclusions || [],
          exclusions: data.exclusions || [],
          images: data.images && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80']
        }
        
        setPackageData(transformedPackage)
      } else if (response.status === 404) {
        // If database package not found, fall back to URL parameters
        console.warn(`Package ${packageId} not found in database, falling back to URL parameters`)
        const provider = searchParams.get('provider') || 'VenuePlus'
        const name = searchParams.get('name') || `${destination} Adventure Package`
        const description = searchParams.get('description') || `Explore the beautiful ${destination} with our carefully curated package`
        
        const fallbackPackage: PackageData = {
          id: packageId,
          name: decodeURIComponent(name),
          description: decodeURIComponent(description),
          price: parseInt(price || '15000'),
          duration: duration || '5 Days 4 Nights',
          destination: destination || 'Unknown',
          inclusions: [
            'Accommodation',
            'Daily Breakfast',
            'Airport Transfers',
            'Local Sightseeing',
            'Professional Guide'
          ],
          exclusions: [
            'International Flights',
            'Personal Expenses',
            'Travel Insurance',
            'Lunch and Dinner'
          ],
          provider: decodeURIComponent(provider),
          images: [`https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`]
        }
        setPackageData(fallbackPackage)
      } else {
        throw new Error('Failed to fetch package details')
      }
    } catch (error) {
      console.error('Error loading package:', error)
      setError('Failed to load package details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateTravelerCount = (count: number) => {
    setBookingDetails(prev => ({ ...prev, numberOfTravelers: count }))
    
    // Adjust travelers array
    if (count > travelers.length) {
      const newTravelers = [...travelers]
      for (let i = travelers.length; i < count; i++) {
        newTravelers.push({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          passportNumber: '',
          passportExpiry: '',
          nationality: 'India',
          gender: 'male',
          specialRequests: '',
        })
      }
      setTravelers(newTravelers)
    } else {
      setTravelers(travelers.slice(0, count))
    }
  }

  const updateTraveler = (index: number, field: keyof TravelerDetails, value: string) => {
    const updated = [...travelers]
    updated[index] = { ...updated[index], [field]: value }
    setTravelers(updated)
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return bookingDetails.travelDate && bookingDetails.returnDate && bookingDetails.numberOfTravelers > 0
      case 2:
        return travelers.every(traveler => 
          traveler.firstName && 
          traveler.lastName && 
          traveler.email && 
          traveler.phone &&
          traveler.dateOfBirth
        )
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const calculateTotalAmount = () => {
    if (!packageData) return 0
    return packageData.price * bookingDetails.numberOfTravelers
  }

  const handlePaymentSuccess = async (result: any) => {
    console.log('Payment successful:', result)
    
    try {
      // Update user stats
      await fetch('/api/user/update-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingAmount: calculateTotalAmount(),
          bookingId: result.booking.id,
        }),
      })

      // Redirect to booking confirmation
      router.push(`/booking-confirmation?booking_id=${result.booking.id}&payment_id=${result.payment.id}`)

    } catch (error) {
      console.error('Error updating profile:', error)
      // Still redirect to confirmation even if profile update fails
      router.push(`/booking-confirmation?booking_id=${result.booking.id}&payment_id=${result.payment.id}`)
    }
  }

  const createBookingData = () => {
    if (!packageData) return null

    return {
      packageId: packageData.id,
      amount: calculateTotalAmount(),
      destination: packageData.destination,
      travelStartDate: bookingDetails.travelDate,
      travelEndDate: bookingDetails.returnDate,
      travelers: bookingDetails.numberOfTravelers,
      contactInfo: {
        name: `${travelers[0]?.firstName} ${travelers[0]?.lastName}`,
        email: travelers[0]?.email,
        phone: travelers[0]?.phone,
      },
      bookingData: {
        packageName: packageData.name,
        duration: packageData.duration,
        roomRequirement: bookingDetails.roomRequirement,
        travelerDetails: travelers,
        inclusions: packageData.inclusions,
        exclusions: packageData.exclusions,
      },
      specialRequests: [
        bookingDetails.specialRequests,
        ...travelers.map(t => t.specialRequests)
      ].filter((request): request is string => Boolean(request)),
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'Package not found'}
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{packageData.name}</h1>
                <p className="text-gray-600 mb-4">{packageData.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {packageData.destination}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {packageData.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {bookingDetails.numberOfTravelers} Traveler(s)
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  ₹{calculateTotalAmount().toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  ₹{packageData.price.toLocaleString()} per person
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 1, title: 'Travel Details', icon: Calendar },
              { step: 2, title: 'Traveler Information', icon: User },
              { step: 3, title: 'Payment', icon: CreditCard },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= item.step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > item.step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <item.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 ${
                  currentStep >= item.step ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {item.title}
                </span>
                {index < 2 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > item.step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Travel Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      value={bookingDetails.travelDate}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, travelDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return Date *
                    </label>
                    <input
                      type="date"
                      value={bookingDetails.returnDate}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, returnDate: e.target.value }))}
                      min={bookingDetails.travelDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Travelers *
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateTravelerCount(Math.max(1, bookingDetails.numberOfTravelers - 1))}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{bookingDetails.numberOfTravelers}</span>
                      <button
                        onClick={() => updateTravelerCount(bookingDetails.numberOfTravelers + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Requirement
                    </label>
                    <select
                      value={bookingDetails.roomRequirement}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, roomRequirement: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="single">Single Room</option>
                      <option value="double">Double Room</option>
                      <option value="triple">Triple Room</option>
                      <option value="family">Family Room</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={bookingDetails.specialRequests}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special requirements or requests..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                {travelers.map((traveler, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Traveler {index + 1} {index === 0 && '(Primary Contact)'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={traveler.firstName}
                          onChange={(e) => updateTraveler(index, 'firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={traveler.lastName}
                          onChange={(e) => updateTraveler(index, 'lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={traveler.email}
                          onChange={(e) => updateTraveler(index, 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={traveler.phone}
                          onChange={(e) => updateTraveler(index, 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          value={traveler.dateOfBirth}
                          onChange={(e) => updateTraveler(index, 'dateOfBirth', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          value={traveler.gender}
                          onChange={(e) => updateTraveler(index, 'gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passport Number
                        </label>
                        <input
                          type="text"
                          value={traveler.passportNumber}
                          onChange={(e) => updateTraveler(index, 'passportNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Optional for domestic travel"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passport Expiry
                        </label>
                        <input
                          type="date"
                          value={traveler.passportExpiry}
                          onChange={(e) => updateTraveler(index, 'passportExpiry', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nationality
                        </label>
                        <input
                          type="text"
                          value={traveler.nationality}
                          onChange={(e) => updateTraveler(index, 'nationality', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests
                      </label>
                      <textarea
                        value={traveler.specialRequests}
                        onChange={(e) => updateTraveler(index, 'specialRequests', e.target.value)}
                        placeholder="Dietary requirements, accessibility needs, etc."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Complete Your Booking</h2>
                
                <RazorpayPayment
                  bookingData={createBookingData()!}
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => console.error('Payment failed:', error)}
                  onCancel={() => console.log('Payment cancelled')}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Package Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium">{packageData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Destination:</span>
                  <span className="font-medium">{packageData.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{packageData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travelers:</span>
                  <span className="font-medium">{bookingDetails.numberOfTravelers}</span>
                </div>
                {bookingDetails.travelDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Date:</span>
                    <span className="font-medium">
                      {new Date(bookingDetails.travelDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <hr className="my-4" />
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per person:</span>
                  <span className="font-medium">₹{packageData.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">₹{calculateTotalAmount().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-900">Secure Booking</h4>
              </div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• SSL encrypted payment</li>
                <li>• Instant confirmation</li>
                <li>• 24/7 customer support</li>
                <li>• Flexible cancellation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>
          
          {currentStep < 3 && (
            <button
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
              className={`px-6 py-3 rounded-lg font-medium ${
                validateStep(currentStep)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
