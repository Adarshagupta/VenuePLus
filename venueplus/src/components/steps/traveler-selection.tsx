'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
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
      icon: '❤️',
      description: 'Romantic getaway for two'
    },
    {
      id: 'family',
      label: 'Family',
      icon: '👨‍👩‍👧‍👦',
      description: 'Perfect for family vacation'
    },
    {
      id: 'friends',
      label: 'Friends',
      icon: '👥',
      description: 'Group adventure with friends'
    },
    {
      id: 'solo',
      label: 'Solo',
      icon: '🎒',
      description: 'Individual travel experience'
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
      <div className="max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-center mb-8">
          How to configure your rooms?
        </h3>

        <div className="bg-white border rounded-xl p-6 space-y-6">
          {rooms.map((room, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-gray-800">ROOM {index + 1}</h4>
              
              {/* Adults */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Adults</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateRoom(index, 'adults', room.adults - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    disabled={room.adults <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{room.adults}</span>
                  <button
                    onClick={() => updateRoom(index, 'adults', room.adults + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Children 0 to 15 yrs</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateRoom(index, 'children', room.children - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    disabled={room.children <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{room.children}</span>
                  <button
                    onClick={() => updateRoom(index, 'children', room.children + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex space-x-3">
            <button
              onClick={addRoom}
              className="flex-1 border-2 border-green-500 text-green-500 py-3 rounded-lg hover:bg-green-50 transition-colors"
            >
              Add new room
            </button>
            <button
              onClick={handleConfirmRooms}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Confirm changes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-center mb-8">
        Who are you travelling with?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {travelerTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleTypeSelect(type.id)}
            className={`bg-white border-2 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all text-center ${
              selectedType === type.id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            {/* Icon Circle */}
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-purple-700 opacity-80"></div>
              <div className="relative text-3xl">
                {type.id === 'couple' && '❤️'}
                {type.id === 'family' && '👨‍👩‍👧‍👦'}
                {type.id === 'friends' && '👥'}
                {type.id === 'solo' && '🎒'}
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {type.label}
            </h4>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid grid-cols-4 gap-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex text-blue-500">
              <span>f</span><span className="text-green-500">G</span>
            </div>
            <div>
              <div className="font-bold">4.5 ⭐</div>
              <div className="text-sm text-gray-600">5400+ reviews</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <div className="font-bold">100%</div>
              <div className="text-sm text-gray-600">Customised Trips</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <div className="font-bold">95%</div>
              <div className="text-sm text-gray-600">Visa Success Rate</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <div className="font-bold">24x7</div>
              <div className="text-sm text-gray-600">Concierge</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

