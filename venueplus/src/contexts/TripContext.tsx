'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { TripData } from '@/components/trip-planning-modal'

interface TripContextType {
  tripData: TripData | null
  setTripData: (data: TripData) => void
  clearTripData: () => void
  hasPendingTrip: boolean
}

const TripContext = createContext<TripContextType | undefined>(undefined)

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripData, setTripDataState] = useState<TripData | null>(null)

  // Load trip data from localStorage on mount
  useEffect(() => {
    const savedTripData = localStorage.getItem('pendingTripData')
    if (savedTripData) {
      try {
        const parsed = JSON.parse(savedTripData)
        // Convert date strings back to Date objects
        if (parsed.startDate) {
          parsed.startDate = new Date(parsed.startDate)
        }
        setTripDataState(parsed)
      } catch (error) {
        console.error('Error parsing saved trip data:', error)
        localStorage.removeItem('pendingTripData')
      }
    }
  }, [])

  const setTripData = useCallback((data: TripData) => {
    setTripDataState(data)
    // Save to localStorage for persistence
    localStorage.setItem('pendingTripData', JSON.stringify(data))
  }, [])

  const clearTripData = useCallback(() => {
    setTripDataState(null)
    localStorage.removeItem('pendingTripData')
  }, [])

  const hasPendingTrip = tripData !== null && Object.keys(tripData).length > 0

  return (
    <TripContext.Provider value={{
      tripData,
      setTripData,
      clearTripData,
      hasPendingTrip
    }}>
      {children}
    </TripContext.Provider>
  )
}

export function useTripContext() {
  const context = useContext(TripContext)
  if (context === undefined) {
    throw new Error('useTripContext must be used within a TripProvider')
  }
  return context
}

