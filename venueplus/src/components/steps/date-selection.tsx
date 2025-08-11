'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TripData } from '../trip-planning-modal'

interface DateSelectionProps {
  tripData: TripData
  onUpdate: (data: Partial<TripData>) => void
  onNext: () => void
}

export function DateSelection({ tripData, onUpdate, onNext }: DateSelectionProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7)) // August 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(tripData.startDate || null)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    onUpdate({ startDate: date })
  }

  const handleContinue = () => {
    if (selectedDate) {
      onNext()
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-light text-gray-800 mb-4">
          When do you want to <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">depart</span>?
        </h3>
        <p className="text-gray-600">
          Choose your perfect departure date to start planning your journey
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xl">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigateMonth('prev')}
            className="p-3 hover:bg-blue-50 rounded-xl transition-all-smooth hover:scale-110 text-gray-600 hover:text-blue-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h4 className="text-xl font-semibold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h4>
          
          <button 
            onClick={() => navigateMonth('next')}
            className="p-3 hover:bg-blue-50 rounded-xl transition-all-smooth hover:scale-110 text-gray-600 hover:text-blue-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-400 py-3">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {days.map((day, index) => (
            <div key={index} className="aspect-square">
              {day && (
                <button
                  onClick={() => handleDateSelect(day)}
                  className={`w-full h-full flex items-center justify-center text-sm rounded-xl font-medium transition-all-smooth ${
                    day.getDate() === 13 && day.getMonth() === currentMonth.getMonth()
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg scale-110 ring-2 ring-green-200'
                      : selectedDate && day.toDateString() === selectedDate.toDateString()
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-110'
                      : 'hover:bg-blue-50 hover:text-blue-600 hover:scale-105'
                  }`}
                >
                  {day.getDate()}
                </button>
              )}
            </div>
          ))}
        </div>

        {selectedDate && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-sm text-blue-600 font-medium mb-1">Selected Date</div>
              <div className="text-lg font-semibold text-gray-800">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all-smooth hover:scale-105 font-semibold shadow-lg"
            >
              Continue to Duration →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
