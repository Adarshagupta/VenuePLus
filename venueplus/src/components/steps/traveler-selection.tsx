'use client'

import { useState } from 'react'
import { Plus, Minus, Heart, Users, Backpack, Baby, Star, CheckCircle, Shield, Sparkles, Award, User, UserCheck, Plane, Coffee, MapPin, Compass } from 'lucide-react'
import { TripData } from '../trip-planning-modal'

interface TravelerSelectionProps {
  tripData: TripData
  onUpdate: (data: Partial<TripData>) => void
  onNext: () => void
}

export function TravelerSelection({ tripData, onUpdate, onNext }: TravelerSelectionProps) {
  const [selectedType, setSelectedType] = useState<string>(tripData.travelers || '')
  const [showRoomConfig, setShowRoomConfig] = useState(false)
  const [rooms, setRooms] = useState(tripData.rooms || [{ adults: 2, children: 0 }])

  const travelerTypes = [
    {
      id: 'couple',
      label: 'Couple',
      icon: UserCheck,
      description: 'Romantic getaway for two',
      gradient: 'from-rose-400 via-pink-500 to-red-500',
      bgGradient: 'from-rose-50 to-pink-50',
      borderColor: 'border-rose-500',
      hoverBorder: 'hover:border-rose-400',
      accentIcon: Heart,
      tag: 'Romantic'
    },
    {
      id: 'family',
      label: 'Family',
      icon: Users,
      description: 'Perfect for family vacation',
      gradient: 'from-blue-400 via-sky-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-sky-50',
      borderColor: 'border-blue-500',
      hoverBorder: 'hover:border-blue-400',
      accentIcon: Baby,
      tag: 'Kid-Friendly'
    },
    {
      id: 'friends',
      label: 'Friends',
      icon: Coffee,
      description: 'Group adventure with friends',
      gradient: 'from-emerald-400 via-green-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-500',
      hoverBorder: 'hover:border-emerald-400',
      accentIcon: MapPin,
      tag: 'Group Fun'
    },
    {
      id: 'solo',
      label: 'Solo',
      icon: Compass,
      description: 'Individual travel experience',
      gradient: 'from-violet-400 via-purple-500 to-indigo-500',
      bgGradient: 'from-violet-50 to-purple-50',
      borderColor: 'border-violet-500',
      hoverBorder: 'hover:border-violet-400',
      accentIcon: Backpack,
      tag: 'Self Discovery'
    }
  ]

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    onUpdate({ travelers: type })
    
    if (type === 'couple') {
      setShowRoomConfig(true)
    } else {
      // Auto-advance for other types
      setTimeout(() => {
        onNext()
      }, 500)
    }
  }

  const updateRoom = (index: number, field: 'adults' | 'children', value: number) => {
    const newRooms = [...rooms]
    newRooms[index] = { ...newRooms[index], [field]: Math.max(0, value) }
    setRooms(newRooms)
    onUpdate({ rooms: newRooms })
  }

  const addRoom = () => {
    const newRooms = [...rooms, { adults: 1, children: 0 }]
    setRooms(newRooms)
    onUpdate({ rooms: newRooms })
  }

  const handleConfirmRooms = () => {
    onNext()
  }

  if (showRoomConfig) {
    return (
      <div className="max-w-lg mx-auto bg-white" style={{ scrollBehavior: 'smooth' }}>
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4 shadow-lg shadow-blue-100/30">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Room Configuration</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            How to configure your rooms?
          </h3>
          <p className="text-gray-600 text-lg">Customize your accommodation preferences</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 space-y-6 hover:shadow-3xl transition-all duration-300">
          {rooms.map((room, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">ROOM {index + 1}</h4>
              </div>
              
              {/* Adults */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-800">Adults</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => updateRoom(index, 'adults', room.adults - 1)}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 flex items-center justify-center hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-500 ease-out transform hover:scale-110 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={room.adults <= 1}
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-12 text-center font-bold text-xl text-gray-900">{room.adults}</span>
                  <button
                    onClick={() => updateRoom(index, 'adults', room.adults + 1)}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 flex items-center justify-center hover:from-blue-200 hover:to-indigo-200 hover:border-blue-400 transition-all duration-500 ease-out transform hover:scale-110 hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                    <Baby className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Children</span>
                    <p className="text-xs text-gray-500">0 to 15 years</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => updateRoom(index, 'children', room.children - 1)}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 flex items-center justify-center hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-500 ease-out transform hover:scale-110 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={room.children <= 0}
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-12 text-center font-bold text-xl text-gray-900">{room.children}</span>
                  <button
                    onClick={() => updateRoom(index, 'children', room.children + 1)}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 flex items-center justify-center hover:from-green-200 hover:to-emerald-200 hover:border-green-400 transition-all duration-500 ease-out transform hover:scale-110 hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <button
              onClick={addRoom}
              className="flex-1 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 text-blue-700 py-4 rounded-2xl hover:from-blue-200 hover:to-indigo-200 hover:border-blue-400 transition-all duration-500 ease-out font-semibold flex items-center justify-center gap-2 transform hover:scale-105 hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              Add New Room
            </button>
            <button
              onClick={handleConfirmRooms}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-500 ease-out font-semibold flex items-center justify-center gap-2 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm Changes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto bg-white">
      {/* Enhanced Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-full mb-4 shadow-lg shadow-purple-100/30">
          <Users className="w-5 h-5 text-purple-600 mr-2" />
          <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Travel Companions</span>
        </div>
        <h3 className="text-4xl font-bold text-gray-900 mb-4">
          Who are you <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">travelling</span> with?
        </h3>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">Choose your travel style and let us customize the perfect experience for your group</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {travelerTypes.map((type) => {
          const IconComponent = type.icon
          const AccentIcon = type.accentIcon
          return (
            <div
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={`relative bg-white border-3 rounded-3xl p-8 cursor-pointer text-center shadow-lg ${
                selectedType === type.id
                  ? `${type.borderColor} bg-gradient-to-br ${type.bgGradient} shadow-2xl ring-4 ring-opacity-30`
                  : `border-gray-200 hover:shadow-xl transition-shadow duration-300`
              }`}
            >
              {/* Selection indicator */}
              {selectedType === type.id && (
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
              
              {/* Tag Badge */}
              <div className={`absolute -top-2 left-4 px-3 py-1 bg-gradient-to-r ${type.gradient} rounded-full shadow-md`}>
                <span className="text-xs font-bold text-white">{type.tag}</span>
              </div>
              
              {/* Enhanced Icon Circle */}
              <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${type.gradient} flex items-center justify-center relative overflow-hidden shadow-2xl border-4 border-white`}>
                {/* Subtle inner glow */}
                <div className="absolute inset-2 bg-white opacity-15 rounded-full"></div>
                
                {/* Main Icon */}
                <IconComponent className="w-14 h-14 text-white relative z-20 drop-shadow-lg" />
                
                {/* Accent Icon */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <AccentIcon className="w-4 h-4 text-white" />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-3 left-3 w-2 h-2 bg-white opacity-40 rounded-full"></div>
                <div className="absolute top-6 right-4 w-1 h-1 bg-white opacity-60 rounded-full"></div>
                <div className="absolute bottom-4 left-5 w-1.5 h-1.5 bg-white opacity-30 rounded-full"></div>
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                {type.label}
              </h4>
              
              <p className="text-sm text-gray-600 leading-relaxed px-2">
                {type.description}
              </p>
              
              {/* Bottom accent line */}
              <div className={`mt-4 mx-auto w-12 h-1 bg-gradient-to-r ${type.gradient} rounded-full opacity-30`}></div>
            </div>
          )
        })}
      </div>


    </div>
  )
}

