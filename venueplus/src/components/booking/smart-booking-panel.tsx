'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, TrendingUp, DollarSign, Star, Clock, ExternalLink, Bot, Zap, AlertTriangle, ThumbsUp, Sparkles } from 'lucide-react'
import { SmartBookingResult, BookingOption } from '@/lib/booking-agent'

interface SmartBookingPanelProps {
  tripData?: any
  onBookingSelect?: (booking: BookingOption) => void
}

export function SmartBookingPanel({ tripData, onBookingSelect }: SmartBookingPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [bookingResults, setBookingResults] = useState<SmartBookingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'recommended' | 'packages' | 'flights' | 'hotels' | 'activities'>('recommended')
  const [filters, setFilters] = useState({
    budget: 'all',
    rating: 0,
    provider: 'all'
  })

  useEffect(() => {
    if (tripData) {
      performSmartSearch()
    }
  }, [tripData])

  const performSmartSearch = async () => {
    if (!tripData) return

    setLoading(true)
    try {
      const response = await fetch('/api/booking/smart-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'package',
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          travelers: parseInt(tripData.travelers.split(' ')[0]) || 2,
          budget: 'mid-range',
          preferences: {
            interests: ['culture', 'sightseeing'],
            travelStyle: 'balanced'
          }
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setBookingResults(data.results)
      }
    } catch (error) {
      console.error('Error performing smart search:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/booking/smart-search?query=${encodeURIComponent(searchQuery)}&type=${activeTab}`)
      
      if (response.ok) {
        const data = await response.json()
        setBookingResults(data.results)
      }
    } catch (error) {
      console.error('Error in quick search:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'recommended', label: 'AI Recommended', icon: Bot },
    { id: 'packages', label: 'Packages', icon: Sparkles },
    { id: 'flights', label: 'Flights', icon: '✈️' },
    { id: 'hotels', label: 'Hotels', icon: '🏨' },
    { id: 'activities', label: 'Activities', icon: '🎯' }
  ]

  const getActiveResults = () => {
    if (!bookingResults) return []
    
    switch (activeTab) {
      case 'recommended':
        return bookingResults.recommended
      case 'packages':
        return bookingResults.packages
      case 'flights':
        return bookingResults.individual.flights
      case 'hotels':
        return bookingResults.individual.hotels
      case 'activities':
        return bookingResults.individual.activities
      default:
        return bookingResults.recommended
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header with AI branding */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text-primary">Smart Booking Assistant</h1>
            <p className="text-gray-600">AI-powered travel booking with real-time price comparison</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search flights, hotels, activities, or destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && quickSearch()}
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            onClick={quickSearch}
            disabled={loading}
            className="btn-primary px-8 py-4 flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            <span>Smart Search</span>
          </button>
        </div>

        {/* AI Insights Banner */}
        {bookingResults?.insights && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Market Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-800 mb-2">{bookingResults.insights.bestValue}</p>
                    <p className="text-blue-700">{bookingResults.insights.priceAlert}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Smart Tips:</h4>
                    <ul className="space-y-1 text-blue-700">
                      {bookingResults.insights.seasonalTips.slice(0, 2).map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
                {typeof Icon === 'string' ? (
                  <span className="text-lg">{Icon}</span>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI is analyzing thousands of options for you...</p>
        </div>
      ) : bookingResults ? (
        <div className="space-y-6">
          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getActiveResults().map((option, index) => (
              <BookingCard
                key={option.id || index}
                booking={option}
                onSelect={onBookingSelect}
                isRecommended={activeTab === 'recommended' && index === 0}
              />
            ))}
          </div>

          {/* Comparison Section */}
          {bookingResults.insights?.comparisons && bookingResults.insights.comparisons.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <ThumbsUp className="w-5 h-5 text-green-500" />
                <span>AI Comparison Analysis</span>
              </h3>
              <div className="space-y-4">
                {bookingResults.insights.comparisons.map((comparison, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{comparison.option1}</h4>
                        <p className="text-sm text-gray-600">vs</p>
                        <h4 className="font-semibold text-gray-900">{comparison.option2}</h4>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{comparison.difference}</p>
                        <p className="text-sm text-gray-500">Price Difference</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">{comparison.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Start Your Smart Search</h3>
          <p className="text-gray-500">Enter a destination or search query to get AI-powered booking recommendations</p>
        </div>
      )}
    </div>
  )
}

function BookingCard({ 
  booking, 
  onSelect, 
  isRecommended = false 
}: { 
  booking: BookingOption
  onSelect?: (booking: BookingOption) => void
  isRecommended?: boolean
}) {
  return (
    <div className={`card-elegant overflow-hidden ${isRecommended ? 'ring-2 ring-purple-500' : ''}`}>
      {isRecommended && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white text-center py-2 px-4">
          <span className="text-sm font-semibold flex items-center justify-center space-x-1">
            <Bot className="w-4 h-4" />
            <span>AI Top Pick</span>
          </span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{booking.provider}</p>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold">{booking.rating}</span>
              </div>
              
              {booking.aiScore && (
                <div className="flex items-center space-x-1">
                  <Bot className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-600">{booking.aiScore}% match</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">${booking.price}</p>
            {booking.savings && (
              <p className="text-sm text-green-600 font-medium">Save ${booking.savings}</p>
            )}
          </div>
        </div>

        {booking.features && booking.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {booking.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="badge badge-blue">{feature}</span>
              ))}
              {booking.features.length > 3 && (
                <span className="badge badge-gray">+{booking.features.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {booking.urgent && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Limited availability - Book soon!</span>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => window.open(booking.bookingUrl, '_blank')}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Book Now</span>
          </button>
          
          {onSelect && (
            <button
              onClick={() => onSelect(booking)}
              className="btn-secondary px-4"
            >
              Compare
            </button>
          )}
        </div>

        {!booking.availability && (
          <div className="mt-3 text-center text-sm text-red-600">
            Currently unavailable
          </div>
        )}
      </div>
    </div>
  )
}
