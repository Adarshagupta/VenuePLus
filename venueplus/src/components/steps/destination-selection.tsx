'use client'

import { useState } from 'react'
import { Search, MapPin, Star, TrendingUp, Globe } from 'lucide-react'

interface DestinationSelectionProps {
  tripData: any
  onUpdate: (data: any) => void
  onNext: () => void
}

interface Destination {
  id: string
  name: string
  country: string
  description: string
  imageUrl: string
  rating: number
  trending: boolean
  category: string
  avgCost: string
}

export function DestinationSelection({ tripData, onUpdate, onNext }: DestinationSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const destinations: Destination[] = [
    {
      id: 'bali',
      name: 'Bali',
      country: 'Indonesia',
      description: 'Tropical paradise with stunning beaches, ancient temples, and vibrant culture',
      imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      trending: true,
      category: 'Beach',
      avgCost: '$50-80/day'
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      country: 'Japan',
      description: 'Modern metropolis blending tradition with cutting-edge technology',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      trending: true,
      category: 'City',
      avgCost: '$100-150/day'
    },
    {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      description: 'City of Light with iconic landmarks, world-class cuisine, and rich history',
      imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      trending: false,
      category: 'City',
      avgCost: '$90-120/day'
    },
    {
      id: 'maldives',
      name: 'Maldives',
      country: 'Maldives',
      description: 'Pristine white beaches, crystal clear waters, and luxury overwater villas',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      trending: true,
      category: 'Beach',
      avgCost: '$200-400/day'
    },
    {
      id: 'switzerland',
      name: 'Switzerland',
      country: 'Switzerland',
      description: 'Alpine landscapes, pristine lakes, and charming mountain villages',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      trending: false,
      category: 'Mountains',
      avgCost: '$120-180/day'
    },
    {
      id: 'goa',
      name: 'Goa',
      country: 'India',
      description: 'Coastal paradise with golden beaches, Portuguese heritage, and vibrant nightlife',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      trending: true,
      category: 'Beach',
      avgCost: '$30-50/day'
    },
    {
      id: 'kerala',
      name: 'Kerala',
      country: 'India',
      description: 'God\'s Own Country with backwaters, hill stations, and spice plantations',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      trending: false,
      category: 'Nature',
      avgCost: '$25-40/day'
    },
    {
      id: 'rajasthan',
      name: 'Rajasthan',
      country: 'India',
      description: 'Royal heritage with magnificent palaces, desert landscapes, and rich culture',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      trending: false,
      category: 'Heritage',
      avgCost: '$35-60/day'
    }
  ]

  const categories = ['All', 'Beach', 'City', 'Mountains', 'Nature', 'Heritage']

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || destination.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDestinationSelect = (destination: Destination) => {
    onUpdate({ destination: destination.name })
    onNext()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-6 flex-shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Where would you like to go?</h2>
        <p className="text-slate-600">Choose your dream destination to start planning your perfect trip</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-elegant w-full pl-10 pr-4 py-2.5 text-sm"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-smooth ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              onClick={() => handleDestinationSelect(destination)}
              className="card-elegant overflow-hidden cursor-pointer group hover:shadow-lg transition-elegant"
            >
              {/* Image */}
              <div className="relative h-32 overflow-hidden">
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {destination.trending && (
                    <div className="bg-orange-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                      <TrendingUp className="w-2.5 h-2.5" />
                      Hot
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                  {destination.rating}
                </div>

                {/* Location */}
                <div className="absolute bottom-2 left-2 text-white">
                  <h3 className="font-bold text-sm">{destination.name}</h3>
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <MapPin className="w-2.5 h-2.5" />
                    {destination.country}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <p className="text-slate-600 text-xs mb-2 line-clamp-2">{destination.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    {destination.avgCost}
                  </div>
                  <div className="text-blue-600 font-medium text-xs group-hover:text-blue-700 transition-smooth">
                    Select →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-600 mb-1">No destinations found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
