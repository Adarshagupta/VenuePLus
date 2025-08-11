'use client'

import { useState, useEffect } from 'react'
import { Search, Edit } from 'lucide-react'
import { TripData } from '../trip-planning-modal'

interface CitySelectionProps {
  tripData: TripData
  onUpdate: (data: Partial<TripData>) => void
  onNext: () => void
}

interface City {
  id: string
  name: string
  country: string
  description: string
  tags: string[]
  imageUrl?: string
  costIndex: number
}

export function CitySelection({ tripData, onUpdate, onNext }: CitySelectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCities, setSelectedCities] = useState<string[]>(tripData.selectedCities || [])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [showDestinations, setShowDestinations] = useState(false)

  // Mock cities data based on screenshots
  const mockCities: City[] = [
    {
      id: '1',
      name: 'Ubud',
      country: 'Indonesia',
      description: 'The cultural homeland',
      tags: ['Theme Parks', 'Must See'],
      costIndex: 2,
      imageUrl: 'https://images.unsplash.com/photo-1555400143-4fb4b2dc73ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '2',
      name: 'Kuta',
      country: 'Indonesia',
      description: 'Hotspot for surfers',
      tags: ['Theme Parks', 'Must See'],
      costIndex: 2,
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '3',
      name: 'Seminyak',
      country: 'Indonesia',
      description: 'Happening heartland of modern Bali',
      tags: ['Theme Parks', 'Must See'],
      costIndex: 3,
      imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '4',
      name: 'Nusa Penida',
      country: 'Indonesia',
      description: 'Broken Beach',
      tags: ['Theme Parks', 'Must See'],
      costIndex: 2,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '5',
      name: 'Gili Trawangan',
      country: 'Indonesia',
      description: 'Three elusive islands',
      tags: ['Theme Parks', 'Must See'],
      costIndex: 2,
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    }
  ]

  const popularDestinations = [
    { name: 'Bali', tag: 'IN SEASON', color: 'bg-green-100 text-green-800' },
    { name: 'Maldives', tag: 'HONEYMOON', color: 'bg-pink-100 text-pink-800' },
    { name: 'Europe', tag: 'TRENDING', color: 'bg-green-100 text-green-800' },
    { name: 'Thailand', tag: 'BUDGET', color: 'bg-orange-100 text-orange-800' },
    { name: 'Singapore', tag: 'FAMILY', color: 'bg-blue-100 text-blue-800' },
    { name: 'Abu Dhabi', tag: 'POPULAR', color: 'bg-purple-100 text-purple-800' },
    { name: 'Vietnam', tag: '', color: '' },
    { name: 'Dubai', tag: '', color: '' },
    { name: 'Australia', tag: '', color: '' }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCities(mockCities)
      setLoading(false)
    }, 500)
  }, [])

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCityToggle = (cityName: string) => {
    console.log('City clicked:', cityName) // Debug log
    const newSelected = selectedCities.includes(cityName)
      ? selectedCities.filter(c => c !== cityName)
      : [...selectedCities, cityName]
    
    console.log('New selected cities:', newSelected) // Debug log
    setSelectedCities(newSelected)
    onUpdate({ selectedCities: newSelected })
  }

  const handleContinue = () => {
    onNext()
  }

  const getCostLabel = (costIndex: number) => {
    if (costIndex <= 2) return { label: 'BUDGET', color: 'text-green-600' }
    if (costIndex <= 3) return { label: 'AFFORDABLE', color: 'text-orange-600' }
    return { label: 'LUXURY', color: 'text-purple-600' }
  }

  if (!showDestinations) {
    return (
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-semibold text-center mb-8">
          What's <span className="text-green-500">your pick</span> for your next vacation?
        </h3>
        
        {/* Debug Test Button */}
        <div className="text-center mb-4">
          <button 
            onClick={() => {
              console.log('Test button clicked!')
              handleCityToggle('Test City')
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Test Click (Debug)
          </button>
          <p className="text-sm text-gray-500 mt-2">Selected: {selectedCities.join(', ') || 'None'}</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Pick your destination"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Popular Destinations */}
        <div className="space-y-4">
          {popularDestinations.map((destination, index) => (
            <button
              key={index}
              onClick={() => {
                if (destination.name === 'Bali') {
                  setShowDestinations(true)
                }
              }}
              className="w-full text-left px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 hover:border-gray-300 flex items-center justify-between"
            >
              <span className="text-lg font-medium text-gray-800">
                {destination.name}
              </span>
              {destination.tag && (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${destination.color}`}>
                  {destination.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Find a city"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <h3 className="text-xl font-semibold mb-6">
        Or, start with these popular choices
      </h3>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {filteredCities.map((city) => {
          const costInfo = getCostLabel(city.costIndex)
          const isSelected = selectedCities.includes(city.name)
          
          return (
            <div
              key={city.id}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleCityToggle(city.name)
              }}
              className={`bg-white rounded-xl overflow-hidden shadow-sm border cursor-pointer hover:shadow-md transition-all duration-200 ${
                isSelected ? 'border-orange-500 ring-2 ring-orange-100 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ userSelect: 'none' }}
            >
              <div className="h-32 bg-gray-200 overflow-hidden relative">
                {city.imageUrl && (
                  <img 
                    src={city.imageUrl} 
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {city.name}, {city.country}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {city.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${costInfo.color}`}>
                    {costInfo.label}
                  </span>
                  
                  <div className="flex space-x-1">
                    {city.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Selection Bar */}
      {selectedCities.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span>
                {selectedCities[0]} Great choice, keep adding
              </span>
            </div>
            
            <div className="flex space-x-3">
              <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Edit
              </button>
              <button 
                onClick={handleContinue}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Build itinerary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

