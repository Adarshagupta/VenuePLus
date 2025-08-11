'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, Edit2, Maximize, Minimize } from 'lucide-react'
import { DestinationSelection } from './steps/destination-selection'
import { DateSelection } from './steps/date-selection'
import { DurationSelection } from './steps/duration-selection'
import { TravelerSelection } from './steps/traveler-selection'
import { DepartureSelection } from './steps/departure-selection'
import { BudgetPlanner } from './steps/budget-planner'
import { PackageSelectionStep } from './steps/package-selection-step'
import { EnhancedItineraryGenerator } from './steps/enhanced-itinerary-generator'
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
  budget?: {
    total: number
    breakdown: {
      accommodation: number
      transportation: number
      food: number
      activities: number
      shopping: number
    }
  }
  selectedPackage?: {
    id: string
    name: string
    price: number
    source: 'scraped' | 'ai_generated'
    provider: string
    description: string
    fullData?: any
  }
  itinerary?: {
    type: 'budget' | 'balanced' | 'luxury'
    activities: any[]
    accommodation: any[]
    transportation: any[]
  }
}

export function TripPlanningModal({ onClose, isAuthenticated }: TripPlanningModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [validationError, setValidationError] = useState<string>('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { tripData, setTripData } = useTripContext()

  const steps = [
    'destination',
    'duration',
    'dates', 
    'travelers',
    'departure',
    'budget',
    'packages',
    'itinerary',
    'summary'
  ]

  const updateTripData = (data: Partial<TripData>) => {
    console.log('updateTripData called with:', data)
    const updatedData = { ...(tripData || {}), ...data }
    console.log('Updated trip data:', updatedData)
    setTripData(updatedData)
  }

  const nextStep = () => {
    console.log('nextStep called - Current step:', steps[currentStep])
    console.log('Trip data:', tripData)
    
    // Clear any previous validation errors
    setValidationError('')
    
    // Validate current step before proceeding
    if (!canProceedToNextStep()) {
      console.log('Validation failed:', getValidationMessage())
      setValidationError(getValidationMessage())
      return
    }
    
    console.log('Validation passed, moving to next step')
    
    if (currentStep < steps.length - 1) {
      // Add completion animation trigger
      const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`)
      if (currentStepElement) {
        currentStepElement.classList.add('animate-step-completion')
        setTimeout(() => {
          currentStepElement.classList.remove('animate-step-completion')
        }, 600)
      }
      
      setCurrentStep(currentStep + 1)
      console.log('Moved to step:', currentStep + 1, '(' + steps[currentStep + 1] + ')')
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
      case 'budget':
        return !!tripData.budget
      case 'packages':
        return !!tripData.selectedPackage
      case 'itinerary':
        return !!tripData.itinerary
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
      case 'budget':
        return 'Please set your travel budget'
      case 'packages':
        return 'Please select a travel package'
      case 'itinerary':
        return 'Please generate your itinerary'
      default:
        return 'Please complete this step'
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    // Allow navigation to completed steps or current step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
      setValidationError('') // Clear any validation errors
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
      case 'budget':
        return <BudgetPlanner tripData={currentTripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'packages':
        return <PackageSelectionStep tripData={currentTripData} onUpdate={updateTripData} onNext={nextStep} onBack={prevStep} />
      case 'itinerary':
        return <EnhancedItineraryGenerator tripData={currentTripData} onUpdate={updateTripData} onNext={nextStep} />
      case 'summary':
        return <TripSummary tripData={currentTripData} isAuthenticated={isAuthenticated} onClose={onClose} />
      default:
        return <DestinationSelection tripData={currentTripData} onUpdate={updateTripData} onNext={nextStep} />
    }
  }

  const getStepIcon = (stepName: string, index: number) => {
    const icons = {
      destination: '🌍',
      duration: '⏰',
      dates: '📅',
      travelers: '👥',
      departure: '✈️',
      budget: '💰',
      packages: '📦',
      itinerary: '🗺️',
      summary: '📋'
    }
    return icons[stepName as keyof typeof icons] || '●'
  }

  const getStepTitle = (stepName: string) => {
    const titles = {
      destination: 'Destination',
      duration: 'Duration',
      dates: 'Dates',
      travelers: 'Travelers',
      departure: 'Departure',
      budget: 'Budget',
      packages: 'Packages',
      itinerary: 'Itinerary',
      summary: 'Summary'
    }
    return titles[stepName as keyof typeof titles] || stepName
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F11') {
        event.preventDefault()
        toggleFullscreen()
      } else if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  return (
    <div className={`modal-backdrop flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white ${isFullscreen ? 'rounded-none w-full h-full' : 'rounded-3xl w-full max-w-7xl h-[85vh] max-h-[900px] min-h-[600px]'} flex shadow-2xl overflow-hidden animate-soft-fade-in transition-all duration-300`}>
        {/* Left Sidebar - Progress Navigation */}
        <div className={`${isFullscreen ? 'w-96' : 'w-80'} bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 border-r border-gray-100 flex flex-col transition-all duration-300`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-lg font-semibold text-gray-800">Travel Planning</h1>
                    {isFullscreen && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full animate-bounce-in">
                        Fullscreen
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Plan Your Perfect Trip</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md transition-all duration-200 group relative"
                  title={isFullscreen ? 'Exit Fullscreen (ESC)' : 'Enter Fullscreen (F11)'}
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  
                  {/* Tooltip */}
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {isFullscreen ? 'Exit Fullscreen (ESC)' : 'Enter Fullscreen (F11)'}
                  </div>
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold gradient-text-primary">{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 ease-out transform relative overflow-hidden"
                  style={{ width: `${getProgressPercentage()}%` }}
                >
                  <div className="absolute inset-0 animate-progress-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex-1 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Planning Steps</h3>
            <p className="text-xs text-gray-500 mb-4">Click on completed steps to edit your preferences</p>
            {steps.map((step, index) => (
              <div
                key={step}
                data-step={index}
                className={`relative group transition-all duration-300 transform ${
                  index === currentStep
                    ? 'scale-105 animate-glow-pulse'
                    : index < currentStep
                    ? 'scale-100 opacity-80'
                    : 'scale-95 opacity-60'
                }`}
              >
                <button
                  onClick={() => goToStep(index)}
                  disabled={index > currentStep}
                  className={`w-full text-left relative p-3 rounded-2xl border transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent shadow-lg text-white'
                      : index < currentStep
                      ? 'bg-white border-green-200 shadow-sm hover:border-green-300 hover:shadow-md cursor-pointer'
                      : 'bg-white/60 border-gray-200 cursor-not-allowed'
                  } ${index <= currentStep ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        index === currentStep
                          ? 'bg-white/20 backdrop-blur-sm text-white'
                          : index < currentStep
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {index < currentStep ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <span className="text-lg">{getStepIcon(step, index)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-semibold transition-colors duration-300 ${
                          index === currentStep
                            ? 'text-white'
                            : index < currentStep
                            ? 'text-gray-800'
                            : 'text-gray-500'
                        }`}
                      >
                        {getStepTitle(step)}
                      </h4>
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm transition-colors duration-300 ${
                            index === currentStep
                              ? 'text-white/80'
                              : index < currentStep
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {index < currentStep
                            ? 'Complete'
                            : index === currentStep
                            ? 'In Progress'
                            : 'Pending'
                          }
                        </p>
                        {index < currentStep && (
                          <Edit2 className="w-3 h-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Connecting Lines */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-9 -bottom-3 w-0.5 h-6 transition-colors duration-300 ${
                        index < currentStep ? 'bg-green-300' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Trip Summary Pills */}
          <div className="p-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Trip Details</h4>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 animate-bounce-in">
                <span>🌟</span>
                <span>{tripData?.destination || 'Select Destination'}</span>
              </div>
              {tripData?.duration && (
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 flex items-center space-x-2 animate-slide-in-left animation-delay-100">
                  <span>⏱️</span>
                  <span>{tripData.duration}</span>
                </div>
              )}
              {tripData?.startDate && (
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 flex items-center space-x-2 animate-slide-in-left animation-delay-200">
                  <span>📅</span>
                  <span>{tripData.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              {tripData?.fromCity && (
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 flex items-center space-x-2 animate-slide-in-left animation-delay-300">
                  <span>✈️</span>
                  <span>{tripData.fromCity}</span>
                </div>
              )}
              {tripData?.rooms && tripData.rooms.length > 0 && (
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 flex items-center space-x-2 animate-slide-in-left animation-delay-400">
                  <span>👥</span>
                  <span>{tripData.rooms.reduce((total, room) => total + room.adults, 0)} Travelers</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="p-4 border-t border-gray-100 space-y-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}
            {currentStep < steps.length - 1 && canProceedToNextStep() && (
              <button
                onClick={nextStep}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Step Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl">
                {getStepIcon(steps[currentStep], currentStep)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getStepTitle(steps[currentStep])}</h2>
                <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            
            {/* Validation Error */}
            {validationError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-soft-fade-in flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <span>{validationError}</span>
              </div>
            )}
          </div>
          
          {/* Step Content */}
          <div className="flex-1 overflow-hidden">
            <div 
              key={currentStep}
              className={`h-full overflow-y-auto custom-scrollbar ${isFullscreen ? 'p-8' : 'p-6'} animate-slide-in-right transition-all duration-300`}
            >
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
