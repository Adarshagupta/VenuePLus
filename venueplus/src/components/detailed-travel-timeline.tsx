'use client'

import { useState } from 'react'
import { 
  Clock, MapPin, Plane, Train, Bus, Car, AlertCircle, 
  CheckCircle, Info, User, Luggage, Shield, CreditCard, 
  Phone, Wifi, Coffee, UtensilsCrossed, Bed, Navigation,
  ArrowRight, ChevronDown, ChevronUp, Timer, Route,
  Camera, Smartphone, FileText, Key, Users, Building2,
  Zap, Star, ThumbsUp, ThumbsDown, TrendingUp, Ship
} from 'lucide-react'
import { 
  PackageTransport, 
  TravelSchedule, 
  TravelTimelineItem, 
  LocationDetails,
  TravelRecommendation 
} from '@/lib/package-types'

interface DetailedTravelTimelineProps {
  transport: PackageTransport
  showFullDetails?: boolean
  compact?: boolean
}

export function DetailedTravelTimeline({ 
  transport, 
  showFullDetails = false, 
  compact = false 
}: DetailedTravelTimelineProps) {
  const [expandedTimeline, setExpandedTimeline] = useState(showFullDetails)
  const [activeTab, setActiveTab] = useState<'timeline' | 'tips' | 'docs'>('timeline')

  if (!transport.detailedSchedule) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">Basic schedule: {transport.departure} - {transport.arrival}</p>
        <p className="text-xs text-gray-500">{transport.duration}</p>
      </div>
    )
  }

  const schedule = transport.detailedSchedule

  const getTransportIcon = (mode: string) => {
    const icons = {
      'flight': Plane,
      'train': Train,
      'bus': Bus,
      'car': Car,
      'boat': Ship,
      'metro': Train,
      'taxi': Car
    }
    const Icon = icons[mode as keyof typeof icons] || Car
    return <Icon className="w-5 h-5" />
  }

  const getTimelineIcon = (type: string) => {
    const icons = {
      'departure_prep': User,
      'check_in': FileText,
      'security': Shield,
      'boarding': Users,
      'travel': ArrowRight,
      'layover': Clock,
      'arrival': MapPin,
      'baggage': Luggage,
      'customs': Building2,
      'ground_transport': Car,
      'hotel_transfer': Bed
    }
    const Icon = icons[type as keyof typeof icons] || Clock
    return <Icon className="w-4 h-4" />
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'required': 'text-red-600 bg-red-50 border-red-200',
      'recommended': 'text-blue-600 bg-blue-50 border-blue-200',
      'optional': 'text-green-600 bg-green-50 border-green-200'
    }
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'text-red-600 bg-red-100',
      'medium': 'text-yellow-600 bg-yellow-100',
      'low': 'text-green-600 bg-green-100'
    }
    return colors[priority as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  }

  const formatDuration = (duration: string) => {
    // Convert "2h 30m" format to readable format
    return duration.replace('h', ' hr').replace('m', ' min')
  }

  const renderLocationDetails = (location: LocationDetails) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
            {getTransportIcon(transport.mode)}
            <span>{location.name}</span>
            {location.code && (
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {location.code}
              </span>
            )}
          </h4>
          <p className="text-sm text-gray-600">{location.address}</p>
          {location.terminal && (
            <p className="text-xs text-blue-600">Terminal: {location.terminal}</p>
          )}
        </div>
        <div className="text-right">
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${
            location.type === 'airport' ? 'bg-blue-100 text-blue-700' :
            location.type === 'railway_station' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {location.type.replace('_', ' ')}
          </span>
        </div>
      </div>

      {location.facilities.length > 0 && (
        <div className="mb-3">
          <h5 className="text-xs font-semibold text-gray-700 mb-2">Facilities</h5>
          <div className="flex flex-wrap gap-1">
            {location.facilities.map((facility, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {facility}
              </span>
            ))}
          </div>
        </div>
      )}

      {location.transportOptions.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-gray-700 mb-2">Transport Options</h5>
          <div className="flex flex-wrap gap-1">
            {location.transportOptions.map((option, index) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {option}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderTimelineItem = (item: TravelTimelineItem, index: number) => (
    <div key={index} className="relative">
      {/* Timeline connector */}
      {index < schedule.hourlyBreakdown.length - 1 && (
        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
      )}
      
      <div className="flex items-start space-x-4 pb-6">
        {/* Time & Icon */}
        <div className="flex-shrink-0 w-20 text-right">
          <div className="text-sm font-semibold text-gray-900">{item.time}</div>
          {item.estimatedTime && (
            <div className="text-xs text-gray-500">~{item.estimatedTime}</div>
          )}
        </div>
        
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
          item.status === 'required' ? 'bg-red-50 border-red-200 text-red-600' :
          item.status === 'recommended' ? 'bg-blue-50 border-blue-200 text-blue-600' :
          'bg-green-50 border-green-200 text-green-600'
        }`}>
          {getTimelineIcon(item.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-start justify-between mb-2">
              <h5 className="font-semibold text-gray-900">{item.activity}</h5>
              <div className="flex items-center space-x-2">
                {item.duration && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {formatDuration(item.duration)}
                  </span>
                )}
                <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            
            <div className="text-xs text-gray-500 mb-2">
              📍 {item.location}
            </div>

            {item.cost && (
              <div className="text-sm font-semibold text-green-600 mb-3">
                Cost: ₹{item.cost.toLocaleString()}
              </div>
            )}

            {item.requirements && item.requirements.length > 0 && (
              <div className="mb-3">
                <h6 className="text-xs font-semibold text-red-700 mb-1">Requirements:</h6>
                <ul className="text-xs text-gray-600 space-y-1">
                  {item.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start space-x-1">
                      <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.tips && item.tips.length > 0 && (
              <div className="mb-3">
                <h6 className="text-xs font-semibold text-blue-700 mb-1">Tips:</h6>
                <ul className="text-xs text-gray-600 space-y-1">
                  {item.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-1">
                      <Info className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.alternatives && item.alternatives.length > 0 && (
              <div>
                <h6 className="text-xs font-semibold text-green-700 mb-1">Alternatives:</h6>
                <div className="flex flex-wrap gap-1">
                  {item.alternatives.map((alt, idx) => (
                    <span key={idx} className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderRecommendations = () => (
    <div className="space-y-4">
      {schedule.recommendations.map((rec, index) => (
        <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
          <div className="flex items-start justify-between mb-2">
            <h5 className="font-semibold">{rec.title}</h5>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full uppercase font-semibold ${getPriorityColor(rec.priority)}`}>
                {rec.priority}
              </span>
              <span className="text-xs bg-white px-2 py-1 rounded capitalize">
                {rec.type}
              </span>
            </div>
          </div>
          <p className="text-sm mb-3">{rec.description}</p>
          {rec.timeRelevant && (
            <div className="text-xs opacity-75">
              ⏰ Best time: {rec.timeRelevant}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderDocumentation = () => (
    <div className="space-y-6">
      {transport.checkInInfo && (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Check-in Information
          </h5>
          
          {transport.checkInInfo.onlineCheckIn.available && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h6 className="font-medium text-blue-900 mb-2">Online Check-in</h6>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>Opens: {transport.checkInInfo.onlineCheckIn.opensHoursBefore} hours before departure</li>
                <li>Closes: {transport.checkInInfo.onlineCheckIn.closesHoursBefore} hours before departure</li>
                {transport.checkInInfo.onlineCheckIn.website && (
                  <li>Website: {transport.checkInInfo.onlineCheckIn.website}</li>
                )}
                {transport.checkInInfo.onlineCheckIn.mobileApp && (
                  <li>Mobile App: {transport.checkInInfo.onlineCheckIn.mobileApp}</li>
                )}
              </ul>
            </div>
          )}

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h6 className="font-medium text-gray-900 mb-2">Airport Check-in</h6>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Opens: {transport.checkInInfo.airportCheckIn.opensHoursBefore} hours before departure</li>
              <li>Closes: {transport.checkInInfo.airportCheckIn.closesMinutesBefore} minutes before departure</li>
              <li>Recommended arrival: {transport.checkInInfo.airportCheckIn.recommendedArrival}</li>
            </ul>
          </div>

          <div className="mb-4">
            <h6 className="font-medium text-gray-900 mb-2">Required Documents</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {transport.checkInInfo.documents.map((doc, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {transport.baggageInfo && (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Luggage className="w-4 h-4 mr-2" />
            Baggage Information
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h6 className="font-medium text-blue-900 mb-2">Checked Bags</h6>
              <div className="text-sm text-blue-700">
                <div>Weight: {transport.baggageInfo.allowance.checkedBags.weight}</div>
                <div>Size: {transport.baggageInfo.allowance.checkedBags.dimensions}</div>
                <div>Count: {transport.baggageInfo.allowance.checkedBags.count}</div>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <h6 className="font-medium text-green-900 mb-2">Carry-on</h6>
              <div className="text-sm text-green-700">
                <div>Weight: {transport.baggageInfo.allowance.carryOn.weight}</div>
                <div>Size: {transport.baggageInfo.allowance.carryOn.dimensions}</div>
                <div>Count: {transport.baggageInfo.allowance.carryOn.count}</div>
              </div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h6 className="font-medium text-yellow-900 mb-2">Personal Item</h6>
              <div className="text-sm text-yellow-700">
                <div>Weight: {transport.baggageInfo.allowance.personalItem.weight}</div>
                <div>Size: {transport.baggageInfo.allowance.personalItem.dimensions}</div>
                <div>Count: {transport.baggageInfo.allowance.personalItem.count}</div>
              </div>
            </div>
          </div>

          {transport.baggageInfo.restrictions.length > 0 && (
            <div className="mb-4">
              <h6 className="font-medium text-red-900 mb-2">Restrictions</h6>
              <ul className="text-sm text-red-700 space-y-1">
                {transport.baggageInfo.restrictions.map((restriction, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{restriction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {transport.baggageInfo.tips.length > 0 && (
            <div>
              <h6 className="font-medium text-gray-900 mb-2">Packing Tips</h6>
              <ul className="text-sm text-gray-600 space-y-1">
                {transport.baggageInfo.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )

  if (compact) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getTransportIcon(transport.mode)}
            <div>
              <h4 className="font-semibold text-gray-900">
                {transport.from} → {transport.to}
              </h4>
              <p className="text-sm text-gray-600">{transport.provider} • {transport.class}</p>
            </div>
          </div>
          <button
            onClick={() => setExpandedTimeline(!expandedTimeline)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <span className="text-sm">Details</span>
            {expandedTimeline ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </button>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{transport.departure} - {transport.arrival}</span>
          <span className="text-gray-600">{formatDuration(transport.duration)}</span>
        </div>

        {expandedTimeline && (
          <div className="mt-4 pt-4 border-t">
            <div className="space-y-4">
              {schedule.hourlyBreakdown.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <span className="w-12 text-gray-600">{item.time}</span>
                  {getTimelineIcon(item.type)}
                  <span className="flex-1">{item.activity}</span>
                </div>
              ))}
              {schedule.hourlyBreakdown.length > 3 && (
                <div className="text-center">
                  <span className="text-xs text-gray-500">
                    +{schedule.hourlyBreakdown.length - 3} more steps
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getTransportIcon(transport.mode)}
            <div>
              <h3 className="text-xl font-bold">{transport.from} → {transport.to}</h3>
              <p className="text-blue-100">{transport.provider} • {transport.class}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{transport.departure} - {transport.arrival}</div>
            <div className="text-blue-100">
              {formatDuration(schedule.totalJourneyTime)} • {schedule.distanceCovered}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Route className="w-4 h-4" />
            <span className="text-sm capitalize">{schedule.journeyType.replace('_', ' ')}</span>
          </div>
          {transport.cost && (
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">₹{transport.cost.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b">
        {[
          { id: 'timeline', label: 'Timeline', icon: Clock },
          { id: 'tips', label: 'Tips & Recommendations', icon: Star },
          { id: 'docs', label: 'Documents & Baggage', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Departure Location</h4>
                {renderLocationDetails(schedule.departureLocation)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Arrival Location</h4>
                {renderLocationDetails(schedule.arrivalLocation)}
              </div>
            </div>

            {/* Hourly Timeline */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">Detailed Timeline</h4>
              <div className="relative">
                {schedule.hourlyBreakdown.map((item, index) => renderTimelineItem(item, index))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tips' && renderRecommendations()}
        {activeTab === 'docs' && renderDocumentation()}
      </div>
    </div>
  )
}
