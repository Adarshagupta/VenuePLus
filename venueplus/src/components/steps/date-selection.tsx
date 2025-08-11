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
    <div className="h-full flex flex-col">
      <div className="text-center mb-6 flex-shrink-0">
        <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          When would you like to travel?
        </h3>
        <p className="text-slate-600">Select your departure date to {tripData.destination}</p>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Calendar */}
        <div className="flex-1">
          <div className="card-elegant p-4">
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

        {/* Recommended Dates */}
        <div className="w-80 flex-shrink-0">
          <div className="card-elegant p-4 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <h4 className="font-semibold text-slate-800">Recommended Dates</h4>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {recommendedDates.map((date, index) => (
                <div
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-102 ${
                    selectedDate && date.toDateString() === selectedDate.toDateString()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-slate-800">
                      {date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-orange-500 fill-current" />
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-600 mb-2">
                    {getDateReason(date)}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Great weather
                    </div>
                    <div className="text-xs text-slate-500">
                      {Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-orange-500 fill-current" />
                  <span>Recommended dates</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span>Best prices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="flex-shrink-0 mt-6 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 inline-block">
            <div className="text-sm text-green-700">
              ✈️ Departing on {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}