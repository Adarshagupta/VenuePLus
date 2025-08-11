'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight } from 'lucide-react'
import { DateSelection } from './steps/date-selection'
import { DurationSelection } from './steps/duration-selection'
import { TravelerSelection } from './steps/traveler-selection'
import { DepartureSelection } from './steps/departure-selection'
import { CitySelection } from './steps/city-selection'
import { TripSummary } from './steps/trip-summary'

interface TripPlanningModalProps {
  onClose: () => void
  isAuthenticated: boolean
}

export interface TripData {
  destination?: string
  duration?: string
  startDate?: Date
  travelers?: string
  rooms?: { adults: number; children: number }[]
  fromCity?: string
  selectedCities?: string[]
}

export function TripPlanningModal({ onClose, isAuthenticated }: TripPlanningModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tripData, setTripData] = useState<TripData>({
    destination: 'Bali',
    duration: '10-12 Days'
  })

  const steps = [
    'destination',
    'dates', 
    'duration',
    'travelers',
    'departure',
    'cities',
    'summary'
  ]

  const updateTripData = (data: Partial<TripData>) => {
    setTripData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100
  }

  const renderCurrentStep = () => {
    switch (steps[currentStep]) {
      case 'dates':
        return <DateSelection tripData={tripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'duration':
        return <DurationSelection tripData={tripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'travelers':
        return <TravelerSelection tripData={tripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'departure':
        return <DepartureSelection tripData={tripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'cities':
        return <CitySelection tripData={tripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'summary':
        return <TripSummary tripData={tripData} isAuthenticated={isAuthenticated} onClose={onClose} />
      default:
        return <DateSelection tripData={tripData} onUpdate={updateTripData} onNext={nextStep} />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 p-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentStep > 0 && (
                <button 
                  onClick={prevStep}
                  className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 hover:bg-white transition-all-smooth hover:scale-110"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                  Let's Plan Your Perfect Trip
                </h2>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 hover:bg-white transition-all-smooth hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Trip Info Pills */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              🌟 {tripData.destination || 'Destination'}
            </div>
            {tripData.duration && (
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-white/50">
                ⏱️ {tripData.duration}
              </div>
            )}
            {tripData.startDate && (
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-white/50">
                📅 {tripData.startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </div>
            )}
            {tripData.fromCity && (
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-white/50">
                ✈️ {tripData.fromCity}
              </div>
            )}
            {tripData.rooms && tripData.rooms.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-white/50">
                👥 {tripData.rooms.reduce((total, room) => total + room.adults, 0)} Pax, {tripData.rooms.length} Room
              </div>
            )}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            
            {/* Step indicators */}
            <div className="flex justify-between mt-3">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-110'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <div className="animate-fade-in-up">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  )
}
