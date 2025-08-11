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
        className="group card-elegant p-2 cursor-pointer hover:shadow-xl transition-elegant"
      >
        <div className="flex items-center">
          {/* Destination */}
          <div className="flex-1 px-6 py-4 border-r border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Where to?</div>
                <div className="text-slate-700 font-medium">Search destinations</div>
              </div>
            </div>
          </div>

          {/* When */}
          <div className="flex-1 px-6 py-4 border-r border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">When?</div>
                <div className="text-slate-700 font-medium">Add dates</div>
              </div>
            </div>
          </div>

          {/* Who */}
          <div className="flex-1 px-6 py-4 border-r border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Who?</div>
                <div className="text-slate-700 font-medium">Add travelers</div>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="px-4">
            <div className="bg-blue-600 p-4 rounded-lg text-white hover:bg-blue-700 transition-smooth">
              <Search className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {['🏝️ Bali', '🏔️ Switzerland', '🎌 Japan', '🏛️ Greece', '🦘 Australia'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={onOpenModal}
            className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 hover:bg-white transition-gentle border border-slate-200 hover:border-slate-300"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
