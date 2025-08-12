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
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Destination */}
          <div className="flex-1 px-4 md:px-6 py-3 md:py-4 border-b md:border-b-0 md:border-r border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Where to?</div>
                <div className="text-slate-700 font-medium text-sm md:text-base">Search destinations</div>
              </div>
            </div>
          </div>

          {/* When */}
          <div className="flex-1 px-4 md:px-6 py-3 md:py-4 border-b md:border-b-0 md:border-r border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">When?</div>
                <div className="text-slate-700 font-medium text-sm md:text-base">Add dates</div>
              </div>
            </div>
          </div>

          {/* Who */}
          <div className="flex-1 px-4 md:px-6 py-3 md:py-4 border-b md:border-b-0 md:border-r border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Who?</div>
                <div className="text-slate-700 font-medium text-sm md:text-base">Add travelers</div>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="px-3 md:px-4 py-3 md:py-0 border-t md:border-t-0 md:border-l border-slate-100 flex items-center">
            <div className="bg-blue-600 p-3 md:p-4 rounded-lg text-white hover:bg-blue-700 transition-smooth w-full md:w-auto flex items-center justify-center">
              <Search className="w-5 md:w-6 h-5 md:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
        {['🏝️ Bali', '🏔️ Switzerland', '🎌 Japan', '🏛️ Greece', '🦘 Australia'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={onOpenModal}
            className="px-3 md:px-4 py-1.5 md:py-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 hover:bg-white transition-gentle border border-slate-200 hover:border-slate-300 text-sm md:text-base"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
