'use client'

import { useState } from 'react'
import { 
  Clock, MapPin, Camera, Utensils, Bed, Car, Plane, Train, Bus,
  Sun, Cloud, CloudRain, Thermometer, Star, DollarSign, Users,
  Calendar, ChevronDown, ChevronUp, Navigation, Activity, Coffee,
  ShoppingBag, Heart, Eye, AlertCircle, CheckCircle, Info,
  Mountain, Trees, Building, Waves, Sparkles
} from 'lucide-react'
import { 
  ScrapedPackage, 
  AIGeneratedPackage, 
  PackageItinerary, 
  PackageDay,
  DayTimeline 
} from '@/lib/package-types'
import { DetailedTravelTimeline } from './detailed-travel-timeline'

interface PackageItineraryViewProps {
  package: ScrapedPackage | AIGeneratedPackage
  showDetailed?: boolean
}

export function PackageItineraryView({ package: pkg, showDetailed = false }: PackageItineraryViewProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(showDetailed ? 1 : null)
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'details'>('overview')

  if (!pkg.itinerary) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Detailed itinerary not available for this package</p>
        <p className="text-sm text-gray-500 mt-1">Contact provider for more information</p>
      </div>
    )
  }

  const getActivityIcon = (category: string) => {
    const icons = {
      'sightseeing': Eye,
      'adventure': Mountain,
      'cultural': Building,
      'nature': Trees,
      'beach': Waves,
      'food': Utensils,
      'shopping': ShoppingBag,
      'spiritual': Sparkles,
      'entertainment': Activity,
      'relaxation': Heart
    }
    const Icon = icons[category as keyof typeof icons] || Activity
    return <Icon className="w-4 h-4" />
  }

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes('sunny')) return <Sun className="w-4 h-4 text-yellow-500" />
    if (condition.toLowerCase().includes('rain')) return <CloudRain className="w-4 h-4 text-blue-500" />
    return <Cloud className="w-4 h-4 text-gray-500" />
  }

  const getTransportIcon = (mode: string) => {
    const icons = {
      'flight': Plane,
      'train': Train,
      'bus': Bus,
      'car': Car,
      'taxi': Car,
      'metro': Train
    }
    const Icon = icons[mode.toLowerCase() as keyof typeof icons] || Car
    return <Icon className="w-4 h-4" />
  }

  const getTimelineIcon = (type: string) => {
    const icons = {
      'activity': Activity,
      'meal': Utensils,
      'transport': Car,
      'free_time': Coffee,
      'check_in': Bed,
      'check_out': Navigation
    }
    const Icon = icons[type as keyof typeof icons] || Clock
    return <Icon className="w-4 h-4" />
  }

  const renderItineraryOverview = () => (
    <div className="space-y-6">
      {/* Package Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">{pkg.summary.totalDays}</div>
            <div className="text-sm text-gray-600">Days</div>
          </div>
          <div className="text-center">
            <MapPin className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">{pkg.summary.cities.length}</div>
            <div className="text-sm text-gray-600">Cities</div>
          </div>
          <div className="text-center">
            <Activity className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">{pkg.summary.totalActivities}</div>
            <div className="text-sm text-gray-600">Activities</div>
          </div>
          <div className="text-center">
            <Utensils className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">{pkg.summary.totalMeals}</div>
            <div className="text-sm text-gray-600">Meals</div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Cities Covered</h4>
            <div className="flex flex-wrap gap-2">
              {pkg.summary.cities.map((city, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {city}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Transport Modes</h4>
            <div className="flex flex-wrap gap-2">
              {pkg.summary.transportModes.map((mode, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center space-x-1">
                  {getTransportIcon(mode)}
                  <span>{mode}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      {pkg.itinerary.highlights && pkg.itinerary.highlights.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
            Trip Highlights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pkg.itinerary.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <span className="text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day-by-Day Preview */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-gray-900">Day-by-Day Preview</h4>
        {pkg.itinerary.days.map((day, index) => (
          <div key={day.day} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {day.day}
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900">{day.theme}</h5>
                    <p className="text-gray-600">{day.city} • {day.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">₹{day.estimatedCost.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{day.activities.length} activities</div>
                  </div>
                  {expandedDay === day.day ? 
                    <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  }
                </div>
              </div>
              
              {expandedDay !== day.day && (
                <div className="mt-4 flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    {getWeatherIcon(day.weather.condition)}
                    <span className="text-sm text-gray-600">
                      {day.weather.temperature.min}°-{day.weather.temperature.max}°C
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{day.activities.length} activities</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Utensils className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{day.meals.length} meals</span>
                  </div>
                </div>
              )}
            </div>

            {expandedDay === day.day && (
              <div className="border-t bg-gray-50 p-6">
                {renderDayDetails(day)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderDayDetails = (day: PackageDay) => (
    <div className="space-y-6">
      {/* Weather & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4">
          <h6 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Thermometer className="w-4 h-4 mr-2" />
            Weather & Conditions
          </h6>
          <div className="flex items-center space-x-4">
            {getWeatherIcon(day.weather.condition)}
            <div>
              <div className="font-medium">{day.weather.condition}</div>
              <div className="text-sm text-gray-600">
                {day.weather.temperature.min}°C - {day.weather.temperature.max}°C
              </div>
              <div className="text-xs text-blue-600 mt-1">{day.weather.recommendation}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h6 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Day Statistics
          </h6>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>Walking: {day.walkingDistance}</div>
            <div>Budget: ₹{day.estimatedCost.toLocaleString()}</div>
            <div>Activities: {day.activities.length}</div>
            <div>Free time: {day.freeTime}</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {day.timeline && day.timeline.length > 0 && (
        <div className="bg-white rounded-lg p-6">
          <h6 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Daily Timeline
          </h6>
          <div className="space-y-4">
            {day.timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600">
                  {item.time}
                </div>
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {getTimelineIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.activity}</div>
                  <div className="text-sm text-gray-600">{item.location}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                  {item.cost && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      ₹{item.cost.toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">{item.duration}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      {day.activities.length > 0 && (
        <div className="bg-white rounded-lg p-6">
          <h6 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Activities & Attractions
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {day.activities.map((activity, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getActivityIcon(activity.category)}
                    <h7 className="font-medium text-gray-900">{activity.name}</h7>
                  </div>
                  {activity.optional && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{activity.duration}</span>
                  <span>{activity.difficulty}</span>
                  {activity.additionalCost && (
                    <span className="text-green-600 font-medium">
                      +₹{activity.additionalCost.toLocaleString()}
                    </span>
                  )}
                </div>
                {activity.tips && activity.tips.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xs text-blue-600">
                      💡 {activity.tips[0]}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transport Details */}
      {day.transport && day.transport.length > 0 && (
        <div className="bg-white rounded-lg p-6">
          <h6 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Car className="w-4 h-4 mr-2" />
            Transportation & Journey Details
          </h6>
          {day.transport.map((transport, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <DetailedTravelTimeline 
                transport={transport} 
                showFullDetails={false}
                compact={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Meals */}
      {day.meals.length > 0 && (
        <div className="bg-white rounded-lg p-6">
          <h6 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Utensils className="w-4 h-4 mr-2" />
            Meals & Dining
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {day.meals.map((meal, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h7 className="font-medium text-gray-900 capitalize">{meal.type}</h7>
                  <span className="text-sm text-green-600 font-medium">
                    ₹{meal.cost?.toLocaleString() || 'Included'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{meal.venue}</div>
                <div className="text-xs text-gray-500">{meal.cuisine} Cuisine</div>
                {meal.description && (
                  <div className="text-xs text-gray-600 mt-2">{meal.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accommodation */}
      {day.accommodation && (
        <div className="bg-white rounded-lg p-6">
          <h6 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Bed className="w-4 h-4 mr-2" />
            Accommodation
          </h6>
          <div className="flex items-start justify-between">
            <div>
              <h7 className="font-medium text-gray-900">{day.accommodation.name}</h7>
              <div className="text-sm text-gray-600">{day.accommodation.location}</div>
              <div className="text-xs text-gray-500 mt-1">{day.accommodation.type}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {day.accommodation.amenities.slice(0, 4).map((amenity, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
                {day.accommodation.amenities.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{day.accommodation.amenities.length - 4} more
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{day.accommodation.rating}</span>
              </div>
              <div className="text-sm text-green-600 font-medium">
                ₹{day.accommodation.costPerNight?.toLocaleString() || 'Included'}/night
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Highlights */}
      {day.highlights && day.highlights.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
          <h6 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-600" />
            Day Highlights
          </h6>
          <div className="space-y-2">
            {day.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'timeline', label: 'Timeline', icon: Clock },
          { id: 'details', label: 'Details', icon: Info }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderItineraryOverview()}
      
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Complete Timeline</h3>
          {pkg.itinerary.days.map((day) => (
            <div key={day.day} className="mb-8 last:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {day.day}
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{day.theme}</h4>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{day.city}</span>
              </div>
              {day.timeline && renderDayTimeline(day.timeline)}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'details' && (
        <div className="space-y-6">
          {pkg.itinerary.days.map((day) => (
            <div key={day.day} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                <h4 className="text-lg font-bold">Day {day.day}: {day.theme}</h4>
                <p className="text-blue-100">{day.city} • {day.date}</p>
              </div>
              <div className="p-6">
                {renderDayDetails(day)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const renderDayTimeline = (timeline: DayTimeline[]) => (
  <div className="relative">
    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
    <div className="space-y-4 ml-8">
      {timeline.map((item, index) => (
        <div key={index} className="relative">
          <div className="absolute -left-10 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
            <Clock className="w-3 h-3 text-blue-500" />
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-gray-900">{item.time}</div>
              <div className="text-sm text-gray-500">{item.duration}</div>
            </div>
            <div className="text-lg font-semibold text-gray-900 mb-1">{item.activity}</div>
            <div className="text-gray-600 mb-2">{item.location}</div>
            <div className="text-sm text-gray-600">{item.description}</div>
            {item.cost && (
              <div className="text-green-600 font-medium mt-2">₹{item.cost.toLocaleString()}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)
