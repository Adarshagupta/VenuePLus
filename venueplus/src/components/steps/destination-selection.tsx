'use client'

import { useState } from 'react'
import { Search, MapPin, Star, TrendingUp, Globe, Sparkles, Heart, Users, Calendar } from 'lucide-react'

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
  highlights: string[]
  bestTime: string
  popularWith: string[]
  gradient: string
}

export function DestinationSelection({ tripData, onUpdate, onNext }: DestinationSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null)

  const destinations: Destination[] = [
    {
      id: 'bali',
      name: 'Bali',
      country: 'Indonesia',
      description: 'Tropical paradise with stunning beaches, ancient temples, and vibrant culture',
      imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      trending: true,
      category: 'Beach',
      avgCost: '$50-80/day',
      highlights: ['Rice Terraces', 'Temples', 'Beaches', 'Yoga Retreats'],
      bestTime: 'Apr-Oct',
      popularWith: ['Couples', 'Solo Travelers'],
      gradient: 'from-orange-400 to-pink-500'
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      country: 'Japan',
      description: 'Modern metropolis blending tradition with cutting-edge technology',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      trending: true,
      category: 'City',
      avgCost: '$100-150/day',
      highlights: ['Shibuya Crossing', 'Sushi', 'Cherry Blossoms', 'Tech Culture'],
      bestTime: 'Mar-May',
      popularWith: ['Families', 'Culture Enthusiasts'],
      gradient: 'from-purple-400 to-blue-500'
    },
    {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      description: 'City of Light with iconic landmarks, world-class cuisine, and rich history',
      imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      trending: false,
      category: 'City',
      avgCost: '$90-120/day',
      highlights: ['Eiffel Tower', 'Louvre', 'Seine River', 'Cafés'],
      bestTime: 'Apr-Jun',
      popularWith: ['Couples', 'Art Lovers'],
      gradient: 'from-rose-400 to-pink-500'
    },
    {
      id: 'maldives',
      name: 'Maldives',
      country: 'Maldives',
      description: 'Pristine white beaches, crystal clear waters, and luxury overwater villas',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      trending: true,
      category: 'Beach',
      avgCost: '$200-400/day',
      highlights: ['Overwater Villas', 'Diving', 'Pristine Beaches', 'Luxury Resorts'],
      bestTime: 'Nov-Apr',
      popularWith: ['Honeymooners', 'Luxury Travelers'],
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'switzerland',
      name: 'Switzerland',
      country: 'Switzerland',
      description: 'Alpine landscapes, pristine lakes, and charming mountain villages',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      trending: false,
      category: 'Mountains',
      avgCost: '$120-180/day',
      highlights: ['Matterhorn', 'Lake Geneva', 'Skiing', 'Scenic Trains'],
      bestTime: 'Jun-Sep',
      popularWith: ['Adventure Seekers', 'Nature Lovers'],
      gradient: 'from-green-400 to-blue-500'
    },
    {
      id: 'goa',
      name: 'Goa',
      country: 'India',
      description: 'Coastal paradise with golden beaches, Portuguese heritage, and vibrant nightlife',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.5,
      trending: true,
      category: 'Beach',
      avgCost: '$30-50/day',
      highlights: ['Beach Parties', 'Portuguese Architecture', 'Seafood', 'Water Sports'],
      bestTime: 'Oct-Mar',
      popularWith: ['Party Lovers', 'Budget Travelers'],
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'kerala',
      name: 'Kerala',
      country: 'India',
      description: 'God\'s Own Country with backwaters, hill stations, and spice plantations',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.6,
      trending: false,
      category: 'Nature',
      avgCost: '$25-40/day',
      highlights: ['Houseboats', 'Tea Plantations', 'Ayurveda', 'Backwaters'],
      bestTime: 'Oct-Mar',
      popularWith: ['Nature Lovers', 'Wellness Seekers'],
      gradient: 'from-emerald-400 to-green-500'
    },
    {
      id: 'rajasthan',
      name: 'Rajasthan',
      country: 'India',
      description: 'Royal heritage with magnificent palaces, desert landscapes, and rich culture',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      trending: false,
      category: 'Heritage',
      avgCost: '$35-60/day',
      highlights: ['Palaces', 'Desert Safari', 'Forts', 'Royal Culture'],
      bestTime: 'Oct-Mar',
      popularWith: ['History Buffs', 'Culture Enthusiasts'],
      gradient: 'from-amber-400 to-orange-500'
    }
  ]

  const categories = [
    { id: 'All', name: 'All Destinations', icon: '🌍' },
    { id: 'Beach', name: 'Beach Paradise', icon: '🏖️' },
    { id: 'City', name: 'Urban Adventures', icon: '🏙️' },
    { id: 'Mountains', name: 'Mountain Escapes', icon: '⛰️' },
    { id: 'Nature', name: 'Nature & Wildlife', icon: '🌿' },
    { id: 'Heritage', name: 'Cultural Heritage', icon: '🏛️' }
  ]

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
      {/* Hero Section */}
      <div className="text-center mb-8 flex-shrink-0">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium gradient-text-primary">Choose Your Dream Destination</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Where would you like to explore?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          From tropical beaches to bustling cities, discover your perfect getaway destination
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex-shrink-0">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search destinations, countries, or experiences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
          />
        </div>
        
        {/* Category Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-2xl font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <span className="mr-2 text-lg">{category.icon}</span>
              <span className="text-sm font-semibold">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              onClick={() => handleDestinationSelect(destination)}
              onMouseEnter={() => setHoveredDestination(destination.id)}
              onMouseLeave={() => setHoveredDestination(null)}
              className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${destination.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {destination.trending && (
                    <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold shadow-lg animate-bounce-in">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </div>
                  )}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-sm font-semibold shadow-lg">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current mr-1" />
                  {destination.rating}
                </div>

                {/* Bottom Location */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                  <div className="flex items-center text-white/90">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{destination.country}</span>
                  </div>
                </div>

                {/* Favorite Heart */}
                <div className="absolute bottom-4 right-4">
                  <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {destination.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {destination.highlights.slice(0, 3).map((highlight, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                    >
                      {highlight}
                    </span>
                  ))}
                  {destination.highlights.length > 3 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                      +{destination.highlights.length - 3}
                    </span>
                  )}
                </div>

                {/* Trip Details */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Best time: {destination.bestTime}</span>
                    </div>
                    <div className="font-bold text-gray-900">
                      {destination.avgCost}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Popular with: {destination.popularWith.join(', ')}</span>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                    hoveredDestination === destination.id
                      ? `bg-gradient-to-r ${destination.gradient} text-white shadow-lg transform scale-105`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {hoveredDestination === destination.id ? 'Select Destination' : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any destinations matching your search. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}