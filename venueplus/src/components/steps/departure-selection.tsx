'use client'

import { useState } from 'react'
import { Search, MapPin, Plane, CheckCircle, Navigation, Compass } from 'lucide-react'
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
    <div className="max-w-3xl mx-auto bg-white">
      {/* Enhanced Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-6 shadow-lg shadow-blue-100/30">
          <Navigation className="w-5 h-5 text-blue-600 mr-2" />
          <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Departure Point</span>
        </div>
        <h3 className="text-4xl font-bold text-gray-900 mb-4">
          Where are you <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">travelling</span> from?
        </h3>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">Select your departure city to begin your amazing journey</p>
      </div>

      {/* Enhanced Search Bar */}
      <div className="relative mb-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 hover:shadow-3xl transition-all duration-300">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <input
              type="text"
              placeholder="Search airports or cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-20 pr-6 py-5 text-lg font-medium text-gray-900 placeholder-gray-500 bg-transparent border-none rounded-3xl focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Enhanced City List */}
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredCities.map((city, index) => (
          <button
            key={city.code}
            onClick={() => handleCitySelect(city.code)}
            className={`group w-full text-left bg-white rounded-3xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-102 ${
              selectedCity === city.code
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl ring-4 ring-blue-200/30'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50'
            }`}
          >
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  selectedCity === city.code 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-indigo-100'
                } transition-all duration-300`}>
                  <Plane className={`w-6 h-6 ${
                    selectedCity === city.code 
                      ? 'text-white' 
                      : 'text-gray-600 group-hover:text-blue-600'
                  }`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {city.name}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    Airport Code: {city.code}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  selectedCity === city.code
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                } transition-all duration-300`}>
                  <MapPin className="w-3 h-3" />
                  <span>Major Hub</span>
                </div>
                
                {selectedCity === city.code && (
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredCities.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full">
                <Compass className="w-8 h-8 text-gray-500" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">No Results Found</h4>
            <p className="text-gray-600">
              No cities found matching "<span className="font-semibold text-blue-600">{searchTerm}</span>"
            </p>
            <p className="text-sm text-gray-500 mt-2">Try searching with a different term or city code</p>
          </div>
        </div>
      )}
    </div>
  )
}

