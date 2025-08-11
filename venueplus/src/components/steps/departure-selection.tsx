'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { TripData } from '../trip-planning-modal'

interface DepartureSelectionProps {
  tripData: TripData
  onUpdate: (data: Partial<TripData>) => void
  onNext: () => void
}

export function DepartureSelection({ tripData, onUpdate, onNext }: DepartureSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState(tripData.fromCity || '')

  const indianCities = [
    { name: 'Bengaluru', code: 'BLR' },
    { name: 'Chennai', code: 'MAA' },
    { name: 'New Delhi', code: 'DEL' },
    { name: 'Mumbai', code: 'BOM' },
    { name: 'Hyderabad', code: 'HYD' },
    { name: 'Trivandrum', code: 'TRV' },
    { name: 'Kolkata', code: 'CCU' },
    { name: 'Pune', code: 'PNQ' },
    { name: 'Ahmedabad', code: 'AMD' },
    { name: 'Kochi', code: 'COK' }
  ]

  const filteredCities = indianCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    onUpdate({ fromCity: city })
    // Auto-advance after selection
    setTimeout(() => {
      onNext()
    }, 500)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-center mb-8">
        Where are you travelling from?
      </h3>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search airports"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* City List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredCities.map((city) => (
          <button
            key={city.code}
            onClick={() => handleCitySelect(city.code)}
            className={`w-full text-left px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors border ${
              selectedCity === city.code
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-800">
                {city.name}, {city.code}
              </span>
              {selectedCity === city.code && (
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No cities found matching "{searchTerm}"
        </div>
      )}
    </div>
  )
}

