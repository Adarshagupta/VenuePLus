'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight } from 'lucide-react'
import { DestinationSelection } from './steps/destination-selection'
import { DateSelection } from './steps/date-selection'
import { DurationSelection } from './steps/duration-selection'
import { TravelerSelection } from './steps/traveler-selection'
import { DepartureSelection } from './steps/departure-selection'
import { CitySelection } from './steps/city-selection'
import { TripSummary } from './steps/trip-summary'
import { useTripContext } from '@/contexts/TripContext'

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
  const [validationError, setValidationError] = useState<string>('')
  const { tripData, setTripData } = useTripContext()

  const steps = [
    'destination',
    'duration',
    'dates', 
    'travelers',
    'departure',
    'cities',
    'summary'
  ]

  const updateTripData = (data: Partial<TripData>) => {
    const updatedData = { ...(tripData || {}), ...data }
    setTripData(updatedData)
  }

  const nextStep = () => {
    // Clear any previous validation errors
    setValidationError('')
    
    // Validate current step before proceeding
    if (!canProceedToNextStep()) {
      setValidationError(getValidationMessage())
      return
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const canProceedToNextStep = () => {
    if (!tripData) return false
    
    switch (steps[currentStep]) {
      case 'destination':
        return !!tripData.destination
      case 'duration':
        return !!tripData.duration
      case 'dates':
        return !!tripData.startDate
      case 'travelers':
        return !!tripData.travelers && !!tripData.rooms
      case 'departure':
        return !!tripData.fromCity
      case 'cities':
        return !!tripData.selectedCities && tripData.selectedCities.length > 0
      default:
        return true
    }
  }

  const getValidationMessage = () => {
    switch (steps[currentStep]) {
      case 'destination':
        return 'Please select a destination'
      case 'duration':
        return 'Please select trip duration'
      case 'dates':
        return 'Please select your travel dates'
      case 'travelers':
        return 'Please select travelers and room configuration'
      case 'departure':
        return 'Please select your departure city'
      case 'cities':
        return 'Please select at least one city to visit'
      default:
        return 'Please complete this step'
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
    const currentTripData = tripData || {}
    
    switch (steps[currentStep]) {
      case 'destination':
        return <DestinationSelection tripData={currentTripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'duration':
        return <DurationSelection tripData={currentTripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'dates':
        return <DateSelection tripData={currentTripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'travelers':
        return <TravelerSelection tripData={currentTripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'departure':
        return <DepartureSelection tripData={currentTripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'cities':
        return <CitySelection tripData={currentTripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'summary':
        return <TripSummary tripData={currentTripData} isAuthenticated={isAuthenticated} onClose={onClose} />
      default:
        return <DestinationSelection tripData={currentTripData} onUpdate={updateTripData} onNext={nextStep} />
    }
  }

  return (
    <div className="modal-backdrop flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Compact Header */}
        <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {currentStep > 0 && (
                <button 
                  onClick={prevStep}
                  className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 hover:bg-white transition-smooth"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h2 className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Plan Your Perfect Trip
                </h2>
                <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 hover:bg-white transition-smooth"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Compact Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Compact Trip Info Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              🌟 {tripData?.destination || 'Select Destination'}
            </div>
            {tripData?.duration && (
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-white/50">
                ⏱️ {tripData.duration}
              </div>
            )}
            {tripData?.startDate && (
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-white/50">
                📅 {tripData.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}
            {tripData?.fromCity && (
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-white/50">
                ✈️ {tripData.fromCity}
              </div>
            )}
            {tripData?.rooms && tripData.rooms.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-white/50">
                👥 {tripData.rooms.reduce((total, room) => total + room.adults, 0)} Pax
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Validation Error */}
          {validationError && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-soft-fade-in flex-shrink-0">
              {validationError}
            </div>
          )}
          
          {/* Step Content */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <div className="h-full">
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
