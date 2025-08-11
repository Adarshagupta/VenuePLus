'use client'

import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { TripData } from '../trip-planning-modal'
import { Calendar as CalendarIcon, Star, TrendingUp, Sparkles } from 'lucide-react'

interface DateSelectionProps {
  tripData: TripData
  onUpdate: (data: Partial<TripData>) => void
  onNext: () => void
}

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export function DateSelection({ tripData, onUpdate, onNext }: DateSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(tripData.startDate || null)
  const [recommendedDates, setRecommendedDates] = useState<Date[]>([])

  useEffect(() => {
    // Generate recommended dates based on destination and duration
    generateRecommendedDates()
  }, [tripData.destination, tripData.duration])

  const generateRecommendedDates = () => {
    const today = new Date()
    const recommended: Date[] = []
    
    // Add dates based on destination seasonality
    const isBeachDestination = ['Bali', 'Goa', 'Maldives'].includes(tripData.destination || '')
    const isCityDestination = ['Tokyo', 'Paris'].includes(tripData.destination || '')
    
    // Generate next 3 months of good dates
    for (let i = 7; i <= 90; i += 7) { // Every week for next 3 months
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip if it's a bad travel day (example logic)
      const dayOfWeek = date.getDay()
      
      // Beach destinations - avoid monsoon simulation
      if (isBeachDestination) {
        const month = date.getMonth()
        if (month >= 5 && month <= 8) continue // Skip monsoon months
      }
      
      // Weekend starts are generally better
      if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
        recommended.push(new Date(date))
      }
      
      // Add mid-week options for budget travelers
      if (dayOfWeek === 2 || dayOfWeek === 3) { // Tuesday or Wednesday
        recommended.push(new Date(date))
      }
    }
    
    setRecommendedDates(recommended.slice(0, 8)) // Limit to 8 recommendations
  }

  const handleDateSelect = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value)
      onUpdate({ startDate: value })
      
      // Auto-advance after a short delay
      setTimeout(() => {
        onNext()
      }, 800)
    }
  }

  const isRecommendedDate = (date: Date) => {
    return recommendedDates.some(recDate => 
      recDate.toDateString() === date.toDateString()
    )
  }

  const getDateReason = (date: Date) => {
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 5 || dayOfWeek === 6) return 'Weekend start'
    if (dayOfWeek === 2 || dayOfWeek === 3) return 'Budget friendly'
    return 'Good weather'
  }

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
        return 'selected-date'
      }
      if (isRecommendedDate(date)) {
        return 'recommended-date'
      }
    }
    return ''
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && isRecommendedDate(date)) {
      return (
        <div className="absolute top-1 right-1">
          <Star className="w-3 h-3 text-orange-500 fill-current" />
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Enhanced Header */}
      <div className="text-center mb-8 flex-shrink-0">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4 shadow-lg shadow-blue-100/30">
          <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
          <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Travel Date</span>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">
          When would you like to travel?
        </h3>
        <p className="text-gray-600 text-lg">Select your departure date to <span className="font-semibold text-blue-600">{tripData.destination}</span></p>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Enhanced Calendar */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl transition-all duration-300">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <CalendarIcon className="w-5 h-5 text-blue-500 mr-2" />
                Choose Your Date
              </h4>
              <p className="text-sm text-gray-600">Pick the perfect day for your adventure</p>
            </div>
            <div className="custom-calendar">
              <Calendar
                onChange={handleDateSelect}
                value={selectedDate}
                minDate={new Date()}
                maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year from now
                tileClassName={tileClassName}
                tileContent={tileContent}
                showNeighboringMonth={false}
                locale="en-US"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Recommended Dates */}
        <div className="w-96 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 h-full hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full">
                <Sparkles className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Recommended Dates</h4>
                <p className="text-sm text-gray-600">Best times to visit</p>
              </div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {recommendedDates.map((date, index) => (
                <div
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  className={`group p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    selectedDate && date.toDateString() === selectedDate.toDateString()
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-orange-100 rounded-full">
                        <Star className="w-4 h-4 text-orange-500 fill-current" />
                      </div>
                      <div className="p-1 bg-green-100 rounded-full">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-3 font-medium">
                    {getDateReason(date)}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1.5 rounded-full font-semibold">
                      Great weather
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Legend */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-orange-100 rounded-full">
                    <Star className="w-4 h-4 text-orange-500 fill-current" />
                  </div>
                  <span className="font-medium">Recommended dates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-green-100 rounded-full">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="font-medium">Best prices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="flex-shrink-0 mt-8 text-center">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-4 inline-block shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CalendarIcon className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-lg font-bold text-green-800">Trip Confirmed!</span>
            </div>
            <div className="text-base text-green-700 font-medium">
              ✈️ Departing on {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-sm text-green-600 mt-2">
              Get ready for your amazing adventure to {tripData.destination}!
            </div>
          </div>
        </div>
      )}
    </div>
  )
}