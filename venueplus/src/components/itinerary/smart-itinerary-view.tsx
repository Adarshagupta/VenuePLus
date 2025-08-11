'use client'

import { useState } from 'react'
import { SmartItinerary, TravelPackage, IndividualBookingOption } from '@/lib/gemini-ai'
import { Calendar, Clock, MapPin, Star, Users, DollarSign, Package, Plane, Building2, Activity, Utensils, Car, ExternalLink, ThumbsUp, ThumbsDown, RefreshCw, Sparkles, Bot } from 'lucide-react'

interface SmartItineraryViewProps {
  itinerary: SmartItinerary
  onRefresh?: () => void
  onBookPackage?: (packageId: string) => void
  onBookIndividual?: (booking: IndividualBookingOption) => void
}

export function SmartItineraryView({ 
  itinerary, 
  onRefresh, 
  onBookPackage, 
  onBookIndividual 
}: SmartItineraryViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'individual' | 'daily'>('overview')
  const [selectedDay, setSelectedDay] = useState(0)

  const tabs = [
    { id: 'overview', label: 'AI Overview', icon: Bot },
    { id: 'packages', label: 'Travel Packages', icon: Package },
    { id: 'individual', label: 'Book Separately', icon: Building2 },
    { id: 'daily', label: 'Daily Plan', icon: Calendar }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text-primary">AI-Powered Itinerary</h1>
              <p className="text-gray-600">Intelligent travel planning with real-time recommendations</p>
            </div>
          </div>
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Regenerate</span>
            </button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-elegant p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-xl font-bold">${itinerary.totalCost}</p>
              </div>
            </div>
          </div>
          
          <div className="card-elegant p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-xl font-bold">{itinerary.days.length} Days</p>
              </div>
            </div>
          </div>
          
          <div className="card-elegant p-4">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Packages</p>
                <p className="text-xl font-bold">{itinerary.packages.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card-elegant p-4">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">AI Rating</p>
                <p className="text-xl font-bold">4.8/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* AI Overview */}
          <div className="card-elegant p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <Bot className="w-6 h-6 text-purple-500" />
              <span>AI Travel Analysis</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">{itinerary.overview}</p>
            
            {/* Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">💰 Money-Saving Tips</h3>
                <ul className="space-y-2">
                  {itinerary.recommendations.moneySavingTips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">🎯 Alternative Options</h3>
                <ul className="space-y-2">
                  {itinerary.recommendations.alternativeOptions.map((option, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">🏛️ Local Insights</h3>
                <ul className="space-y-2">
                  {itinerary.recommendations.localInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Best Package Recommendation */}
          {itinerary.recommendations.bestPackage && (
            <div className="card-elegant p-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <ThumbsUp className="w-6 h-6 text-purple-500" />
                <span>AI Recommended Package</span>
              </h2>
              <PackageCard 
                package={itinerary.recommendations.bestPackage} 
                onBook={onBookPackage}
                isRecommended={true}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Available Travel Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itinerary.packages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} onBook={onBookPackage} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'individual' && (
        <IndividualBookingsTab 
          bookings={itinerary.individualBookings} 
          onBook={onBookIndividual} 
        />
      )}

      {activeTab === 'daily' && (
        <DailyPlanTab 
          days={itinerary.days} 
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
        />
      )}
    </div>
  )
}

function PackageCard({ 
  package: pkg, 
  onBook, 
  isRecommended = false 
}: { 
  package: TravelPackage
  onBook?: (id: string) => void
  isRecommended?: boolean
}) {
  return (
    <div className={`card-elegant overflow-hidden ${isRecommended ? 'ring-2 ring-purple-500' : ''}`}>
      {isRecommended && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white text-center py-2 px-4">
          <span className="text-sm font-semibold">🏆 AI Recommended</span>
        </div>
      )}
      
      <img 
        src={pkg.imageUrl} 
        alt={pkg.name}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
            <p className="text-sm text-gray-600">{pkg.provider}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">${pkg.price}</p>
            <p className="text-sm text-gray-500">{pkg.duration}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold">{pkg.rating}</span>
          <span className="text-sm text-gray-500">({pkg.reviews} reviews)</span>
        </div>

        <p className="text-gray-700 text-sm mb-4">{pkg.description}</p>

        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Includes:</h4>
            <div className="flex flex-wrap gap-2">
              {pkg.includes.map((item, index) => (
                <span key={index} className="badge badge-blue">{item}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Highlights:</h4>
            <div className="flex flex-wrap gap-2">
              {pkg.highlights.map((highlight, index) => (
                <span key={index} className="badge badge-purple">{highlight}</span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onBook?.(pkg.id)}
          className="w-full mt-6 btn-primary flex items-center justify-center space-x-2"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Book Package</span>
        </button>
      </div>
    </div>
  )
}

function IndividualBookingsTab({ 
  bookings, 
  onBook 
}: { 
  bookings: SmartItinerary['individualBookings']
  onBook?: (booking: IndividualBookingOption) => void
}) {
  const sections = [
    { key: 'flights', label: 'Flights', icon: Plane, items: bookings.flights },
    { key: 'hotels', label: 'Hotels', icon: Building2, items: bookings.hotels },
    { key: 'activities', label: 'Activities', icon: Activity, items: bookings.activities },
    { key: 'restaurants', label: 'Restaurants', icon: Utensils, items: bookings.restaurants },
    { key: 'transport', label: 'Transport', icon: Car, items: bookings.transport }
  ]

  return (
    <div className="space-y-8">
      {sections.map((section) => {
        const Icon = section.icon
        return (
          <div key={section.key}>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Icon className="w-6 h-6 text-blue-500" />
              <span>{section.label}</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, index) => (
                <BookingCard key={index} booking={item} onBook={onBook} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BookingCard({ 
  booking, 
  onBook 
}: { 
  booking: IndividualBookingOption
  onBook?: (booking: IndividualBookingOption) => void
}) {
  return (
    <div className="card-elegant p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.name}</h3>
          <p className="text-sm text-gray-600">{booking.provider}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-blue-600">${booking.price}</p>
          <div className="flex items-center space-x-1 mt-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs">{booking.rating}</span>
          </div>
        </div>
      </div>

      {booking.imageUrl && (
        <img 
          src={booking.imageUrl} 
          alt={booking.name}
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
      )}

      <p className="text-gray-700 text-sm mb-4">{booking.description}</p>

      <div className="mb-4">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Features:</h4>
        <div className="flex flex-wrap gap-2">
          {booking.features.map((feature, index) => (
            <span key={index} className="badge badge-gray">{feature}</span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onBook?.(booking)}
        disabled={!booking.availability}
        className={`w-full flex items-center justify-center space-x-2 ${
          booking.availability ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'
        }`}
      >
        <ExternalLink className="w-4 h-4" />
        <span>{booking.availability ? 'Book Now' : 'Not Available'}</span>
      </button>
    </div>
  )
}

function DailyPlanTab({ 
  days, 
  selectedDay, 
  onDaySelect 
}: { 
  days: SmartItinerary['days']
  selectedDay: number
  onDaySelect: (day: number) => void
}) {
  if (!days || days.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No daily plan available</h3>
        <p className="text-gray-500">The AI hasn't generated a detailed daily itinerary yet.</p>
      </div>
    )
  }

  const selectedDayData = days[selectedDay]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Day Selector */}
      <div className="lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4">Select Day</h3>
        <div className="space-y-2">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => onDaySelect(index)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                selectedDay === index
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold">Day {day.day}</div>
              <div className="text-sm opacity-75">{day.date}</div>
              <div className="text-sm opacity-75">{day.city}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Day Details */}
      <div className="lg:col-span-3">
        {selectedDayData && (
          <div className="space-y-6">
            {/* Day Header */}
            <div className="card-elegant p-6">
              <h2 className="text-2xl font-bold mb-2">Day {selectedDayData.day}: {selectedDayData.theme}</h2>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedDayData.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedDayData.city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>${selectedDayData.estimatedCost}</span>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="card-elegant p-6">
              <h3 className="text-xl font-semibold mb-4">Activities</h3>
              <div className="space-y-4">
                {selectedDayData.activities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-semibold">{activity.time}</div>
                        <div className="text-gray-500">${activity.cost}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{activity.duration}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{activity.location}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {selectedDayData.tips.length > 0 && (
              <div className="card-elegant p-6">
                <h3 className="text-xl font-semibold mb-4">Local Tips</h3>
                <ul className="space-y-2">
                  {selectedDayData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                      <span className="text-yellow-500 mt-1">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
