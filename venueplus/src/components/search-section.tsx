'use client'

import { Search, MapPin, Calendar, Users } from 'lucide-react'

interface SearchSectionProps {
  onOpenModal: () => void
}

export function SearchSection({ onOpenModal }: SearchSectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div 
        onClick={onOpenModal}
        className="group bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/20 cursor-pointer hover:shadow-3xl transition-all-smooth hover:scale-105"
      >
        <div className="flex items-center">
          {/* Destination */}
          <div className="flex-1 px-6 py-4 border-r border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Where to?</div>
                <div className="text-gray-700 font-medium">Search destinations</div>
              </div>
            </div>
          </div>

          {/* When */}
          <div className="flex-1 px-6 py-4 border-r border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">When?</div>
                <div className="text-gray-700 font-medium">Add dates</div>
              </div>
            </div>
          </div>

          {/* Who */}
          <div className="flex-1 px-6 py-4 border-r border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-50 rounded-xl">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Who?</div>
                <div className="text-gray-700 font-medium">Add travelers</div>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="px-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl text-white hover:from-blue-700 hover:to-purple-700 transition-all-smooth group-hover:scale-110">
              <Search className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {['🏝️ Bali', '🏔️ Switzerland', '🎌 Japan', '🏛️ Greece', '🦘 Australia'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={onOpenModal}
            className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-gray-700 hover:bg-white transition-all-smooth hover:scale-105 border border-white/30"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
