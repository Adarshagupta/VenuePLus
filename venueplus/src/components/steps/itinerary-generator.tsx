'use client'

import { useState } from 'react'
import { MapPin, Clock, DollarSign, Star, Users, Calendar, Sparkles, Zap, Crown } from 'lucide-react'
import { TripData } from '../trip-planning-modal'

interface ItineraryGeneratorProps {
  tripData: TripData
  onUpdate: (data: Partial<TripData>) => void
  onNext: () => void
}

export function ItineraryGenerator({ tripData, onUpdate, onNext }: ItineraryGeneratorProps) {
  const [selectedType, setSelectedType] = useState<'budget' | 'balanced' | 'luxury'>('balanced')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState(null)

  const itineraryTypes = [
    {
      id: 'budget' as const,
      name: 'Budget Explorer',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      description: 'Great experiences without breaking the bank',
      features: ['Budget accommodations', 'Local transport', 'Street food experiences', 'Free attractions'],
      budgetRange: '₹15,000 - ₹35,000',
      recommended: tripData.budget?.total && tripData.budget.total < 40000
    },
    {
      id: 'balanced' as const,
      name: 'Balanced Adventure',
      icon: Zap,
      color: 'from-blue-500 to-purple-600',
      description: 'Perfect mix of comfort and adventure',
      features: ['Mid-range hotels', 'Mix of transport', 'Popular restaurants', 'Top attractions'],
      budgetRange: '₹35,000 - ₹75,000',
      recommended: tripData.budget?.total && tripData.budget.total >= 40000 && tripData.budget.total <= 80000
    },
    {
      id: 'luxury' as const,
      name: 'Luxury Experience',
      icon: Crown,
      color: 'from-purple-500 to-pink-600',
      description: 'Premium comfort and exclusive experiences',
      features: ['Luxury hotels', 'Private transport', 'Fine dining', 'Exclusive tours'],
      budgetRange: '₹75,000+',
      recommended: tripData.budget?.total && tripData.budget.total > 80000
    }
  ]

  const handleGenerateItinerary = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockItinerary = {
      type: selectedType,
      activities: [
        {
          day: 1,
          title: 'Arrival & City Exploration',
          activities: ['Airport transfer', 'Hotel check-in', 'Local market visit', 'Welcome dinner'],
          estimated_cost: Math.round(tripData.budget?.breakdown?.food || 0) * 0.3
        },
        {
          day: 2,
          title: 'Cultural Discovery',
          activities: ['Temple visits', 'Cultural show', 'Traditional lunch', 'Shopping'],
          estimated_cost: Math.round(tripData.budget?.breakdown?.activities || 0) * 0.4
        },
        {
          day: 3,
          title: 'Adventure & Relaxation',
          activities: ['Adventure activity', 'Spa treatment', 'Beach time', 'Sunset dinner'],
          estimated_cost: Math.round(tripData.budget?.breakdown?.activities || 0) * 0.6
        }
      ],
      accommodation: [
        {
          name: selectedType === 'luxury' ? 'Luxury Resort & Spa' : selectedType === 'balanced' ? 'Boutique Hotel' : 'Comfortable Guesthouse',
          type: selectedType,
          rating: selectedType === 'luxury' ? 5 : selectedType === 'balanced' ? 4 : 3,
          price_per_night: Math.round((tripData.budget?.breakdown?.accommodation || 0) / parseInt(tripData.duration?.split(' ')[0] || '3'))
        }
      ],
      transportation: [
        {
          type: selectedType === 'luxury' ? 'Private car' : selectedType === 'balanced' ? 'Mix of private/public' : 'Public transport',
          total_cost: tripData.budget?.breakdown?.transportation || 0
        }
      ]
    }
    
    setGeneratedItinerary(mockItinerary)
    setIsGenerating(false)
  }

  const handleContinue = () => {
    if (generatedItinerary) {
      onUpdate({ itinerary: generatedItinerary })
      onNext()
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">AI-Powered Itinerary</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Generate Your Perfect Itinerary
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your preferences for {tripData.destination}, we'll create a personalized {tripData.duration} itinerary within your ₹{tripData.budget?.total?.toLocaleString()} budget
        </p>
      </div>

      {!generatedItinerary ? (
        <>
          {/* Itinerary Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {itineraryTypes.map((type) => {
              const Icon = type.icon
              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {type.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        RECOMMENDED
                      </span>
                    </div>
                  )}
                  
                  <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    {type.name}
                  </h3>
                  
                  <p className="text-gray-600 text-center mb-4 text-sm">
                    {type.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {type.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {type.budgetRange}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Trip Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-semibold text-gray-900">{tripData.destination}</p>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">{tripData.duration}</p>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Travelers</p>
                <p className="font-semibold text-gray-900">{tripData.travelers}</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Budget</p>
                <p className="font-semibold text-gray-900">₹{tripData.budget?.total?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={handleGenerateItinerary}
              disabled={isGenerating}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
                  Generating Your Perfect Itinerary...
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Generate {itineraryTypes.find(t => t.id === selectedType)?.name} Itinerary
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Generated Itinerary Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Your {itineraryTypes.find(t => t.id === selectedType)?.name}
              </h3>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-600">AI Generated</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Activities */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Daily Itinerary</h4>
                <div className="space-y-4">
                  {generatedItinerary.activities.map((day, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-semibold text-gray-900">Day {day.day}: {day.title}</h5>
                        <span className="text-sm font-medium text-green-600">
                          ₹{day.estimated_cost?.toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accommodation & Transport */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Accommodation</h4>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold text-gray-900">
                        {generatedItinerary.accommodation[0].name}
                      </h5>
                      <div className="flex items-center">
                        {[...Array(generatedItinerary.accommodation[0].rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      ₹{generatedItinerary.accommodation[0].price_per_night?.toLocaleString()} per night
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      selectedType === 'luxury' ? 'bg-purple-100 text-purple-800' :
                      selectedType === 'balanced' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Category
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Transportation</h4>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {generatedItinerary.transportation[0].type}
                    </h5>
                    <p className="text-sm text-gray-600">
                      Total cost: ₹{generatedItinerary.transportation[0].total_cost?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Summary
            </button>
          </div>
        </>
      )}
    </div>
  )
}
