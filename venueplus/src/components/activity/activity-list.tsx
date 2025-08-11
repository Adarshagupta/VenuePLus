'use client'

import { useState, useEffect } from 'react'
import { Star, Clock, MapPin, Users, Plus, Search, Filter } from 'lucide-react'

interface Activity {
  id: string
  name: string
  description: string
  category: string
  duration: number
  estimatedCost: number
  rating: number
  reviewCount: number
  imageUrl: string
  location: string
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  groupSize: string
  includes: string[]
  isBooked: boolean
}

interface ActivityListProps {
  tripId: string
}

export function ActivityList({ tripId }: ActivityListProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'booked' | 'available'>('all')

  const categories = ['All', 'Sightseeing', 'Adventure', 'Culture', 'Food', 'Nature', 'Wellness', 'Shopping']

  useEffect(() => {
    fetchActivities()
  }, [tripId])

  useEffect(() => {
    filterActivities()
  }, [activities, searchTerm, selectedCategory, selectedFilter])

  const fetchActivities = async () => {
    try {
      // Mock data for demonstration
      const mockActivities: Activity[] = [
        {
          id: '1',
          name: 'Tanah Lot Temple Sunset Tour',
          description: 'Visit the iconic sea temple and watch a breathtaking sunset over the Indian Ocean',
          category: 'Sightseeing',
          duration: 180,
          estimatedCost: 45,
          rating: 4.8,
          reviewCount: 1247,
          imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          location: 'Tanah Lot, Bali',
          difficulty: 'Easy',
          groupSize: '2-15 people',
          includes: ['Transportation', 'English Guide', 'Entrance Fees'],
          isBooked: true
        },
        {
          id: '2',
          name: 'White Water Rafting Adventure',
          description: 'Thrilling rafting experience through tropical rainforest rapids',
          category: 'Adventure',
          duration: 240,
          estimatedCost: 65,
          rating: 4.6,
          reviewCount: 892,
          imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          location: 'Ayung River, Ubud',
          difficulty: 'Moderate',
          groupSize: '4-12 people',
          includes: ['Equipment', 'Safety Briefing', 'Lunch', 'Insurance'],
          isBooked: false
        },
        {
          id: '3',
          name: 'Traditional Balinese Cooking Class',
          description: 'Learn to cook authentic Balinese dishes with local ingredients',
          category: 'Food',
          duration: 210,
          estimatedCost: 55,
          rating: 4.9,
          reviewCount: 634,
          imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          location: 'Ubud Village',
          difficulty: 'Easy',
          groupSize: '2-8 people',
          includes: ['Ingredients', 'Recipes', 'Market Tour', 'Meal'],
          isBooked: false
        },
        {
          id: '4',
          name: 'Mount Batur Sunrise Trekking',
          description: 'Early morning trek to catch the spectacular sunrise from the volcano summit',
          category: 'Adventure',
          duration: 360,
          estimatedCost: 75,
          rating: 4.7,
          reviewCount: 1523,
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          location: 'Mount Batur, Kintamani',
          difficulty: 'Hard',
          groupSize: '2-20 people',
          includes: ['Guide', 'Breakfast', 'Flashlight', 'Transport'],
          isBooked: true
        },
        {
          id: '5',
          name: 'Ubud Rice Terraces & Art Villages Tour',
          description: 'Explore stunning rice terraces and visit traditional art villages',
          category: 'Culture',
          duration: 300,
          estimatedCost: 50,
          rating: 4.5,
          reviewCount: 756,
          imageUrl: 'https://images.unsplash.com/photo-1555400143-4fb4b2dc73ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          location: 'Tegallalang, Ubud',
          difficulty: 'Easy',
          groupSize: '2-12 people',
          includes: ['Transportation', 'Guide', 'Entrance Fees'],
          isBooked: false
        },
        {
          id: '6',
          name: 'Balinese Spa & Wellness Experience',
          description: 'Rejuvenating traditional spa treatment with natural ingredients',
          category: 'Wellness',
          duration: 120,
          estimatedCost: 85,
          rating: 4.8,
          reviewCount: 423,
          imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          location: 'Spa Resort, Ubud',
          difficulty: 'Easy',
          groupSize: '1-2 people',
          includes: ['Full Body Massage', 'Herbal Treatment', 'Refreshments'],
          isBooked: false
        }
      ]
      
      setActivities(mockActivities)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching activities:', error)
      setLoading(false)
    }
  }

  const filterActivities = () => {
    let filtered = activities

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(activity => activity.category === selectedCategory)
    }

    // Filter by booking status
    if (selectedFilter === 'booked') {
      filtered = filtered.filter(activity => activity.isBooked)
    } else if (selectedFilter === 'available') {
      filtered = filtered.filter(activity => !activity.isBooked)
    }

    setFilteredActivities(filtered)
  }

  const handleBookActivity = async (activityId: string) => {
    try {
      // Mock booking - replace with actual API call
      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, isBooked: !activity.isBooked }
          : activity
      ))
    } catch (error) {
      console.error('Error booking activity:', error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700'
      case 'Moderate': return 'bg-yellow-100 text-yellow-700'
      case 'Hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Sightseeing': 'bg-blue-100 text-blue-700',
      'Adventure': 'bg-red-100 text-red-700',
      'Culture': 'bg-purple-100 text-purple-700',
      'Food': 'bg-orange-100 text-orange-700',
      'Nature': 'bg-green-100 text-green-700',
      'Wellness': 'bg-pink-100 text-pink-700',
      'Shopping': 'bg-indigo-100 text-indigo-700'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="animate-gentle-pulse text-slate-600 text-center py-12">
        Loading activities...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card-elegant p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-smooth ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'booked', label: 'Booked' },
              { key: 'available', label: 'Available' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-smooth ${
                  selectedFilter === filter.key
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="card-elegant overflow-hidden">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={activity.imageUrl}
                alt={activity.name}
                className="w-full h-full object-cover transition-smooth hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                  {activity.difficulty}
                </span>
              </div>
              {activity.isBooked && (
                <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Booked
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-800 text-lg leading-tight">{activity.name}</h3>
                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-slate-800">${activity.estimatedCost}</div>
                  <div className="text-sm text-slate-500">per person</div>
                </div>
              </div>

              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{activity.description}</p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(activity.duration / 60)}h {activity.duration % 60}min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{activity.groupSize}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(activity.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">
                    {activity.rating} ({activity.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Includes */}
              <div className="mb-4">
                <div className="text-xs text-slate-500 mb-2">Includes:</div>
                <div className="flex flex-wrap gap-1">
                  {activity.includes.slice(0, 3).map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                      {item}
                    </span>
                  ))}
                  {activity.includes.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                      +{activity.includes.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleBookActivity(activity.id)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-smooth ${
                  activity.isBooked
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {activity.isBooked ? 'Remove from Trip' : 'Add to Trip'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-500 mb-4">No activities found matching your criteria</div>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('All')
              setSelectedFilter('all')
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
