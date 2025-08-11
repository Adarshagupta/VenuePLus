'use client'

import { useCallback } from 'react'

interface ActivityMetadata {
  packageId?: string
  packageName?: string
  destination?: string
  price?: number
  source?: string
  [key: string]: any
}

export function useUserActivity() {
  const logActivity = useCallback(async (
    type: 'view' | 'save' | 'book' | 'share' | 'review' | 'search',
    description: string,
    metadata?: ActivityMetadata
  ) => {
    if (typeof window === 'undefined') return

    try {
      await fetch('/api/user/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          description,
          metadata,
          location: window.location.pathname,
          device: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
        })
      })
    } catch (error) {
      console.error('Error logging user activity:', error)
    }
  }, [])

  const trackPackageView = useCallback(async (pkg: any) => {
    await logActivity('view', `Viewed package: ${pkg.name} to ${pkg.destination}`, {
      packageId: pkg.id,
      packageName: pkg.name,
      destination: pkg.destination,
      price: pkg.price,
      source: pkg.source
    })

    // Also add to recently viewed
    try {
      await fetch('/api/user/recent-views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemType: 'package' as const,
          itemId: pkg.id,
          itemData: {
            name: pkg.name,
            description: pkg.description,
            imageUrl: pkg.images?.[0],
            price: pkg.price,
            location: pkg.destination
          },
          viewDuration: 0,
          source: 'search'
        })
      })
    } catch (error) {
      console.error('Error tracking recently viewed:', error)
    }
  }, [logActivity])

  const trackPackageSelection = useCallback(async (pkg: any) => {
    await logActivity('save', `Selected package: ${pkg.name} to ${pkg.destination}`, {
      packageId: pkg.id,
      packageName: pkg.name,
      destination: pkg.destination,
      price: pkg.price,
      source: pkg.source
    })
  }, [logActivity])

  const trackBooking = useCallback(async (pkg: any, bookingData: any) => {
    await logActivity('book', `Booked package: ${pkg.name} to ${pkg.destination}`, {
      packageId: pkg.id,
      packageName: pkg.name,
      destination: pkg.destination,
      price: pkg.price,
      bookingReference: bookingData.bookingReference,
      travelers: bookingData.travelers
    })
  }, [logActivity])

  const trackSearch = useCallback(async (searchTerm: string, filters: any) => {
    await logActivity('search', `Searched for packages: ${searchTerm}`, {
      searchTerm,
      filters,
      resultsCount: filters.resultsCount
    })
  }, [logActivity])

  const trackShare = useCallback(async (pkg: any, platform: string) => {
    await logActivity('share', `Shared package: ${pkg.name} on ${platform}`, {
      packageId: pkg.id,
      packageName: pkg.name,
      platform,
      destination: pkg.destination
    })
  }, [logActivity])

  const saveItinerary = useCallback(async (itineraryData: any) => {
    try {
      const response = await fetch('/api/user/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itineraryData)
      })
      
      if (response.ok) {
        const savedItinerary = await response.json()
        
        await logActivity('save', `Saved itinerary: ${itineraryData.name}`, {
          itineraryId: savedItinerary.id,
          destination: itineraryData.destination,
          duration: itineraryData.duration,
          travelers: itineraryData.travelers,
          totalCost: itineraryData.totalCost
        })
        
        return savedItinerary
      }
      
      return null
    } catch (error) {
      console.error('Error saving itinerary:', error)
      return null
    }
  }, [logActivity])

  const createBooking = useCallback(async (bookingData: any) => {
    try {
      const response = await fetch('/api/user/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })
      
      if (response.ok) {
        const booking = await response.json()
        
        await logActivity('book', `Created booking: ${booking.bookingReference}`, {
          bookingId: booking.id,
          bookingReference: booking.bookingReference,
          destination: booking.destination,
          travelers: booking.travelers,
          totalAmount: booking.totalAmount
        })
        
        return booking
      }
      
      return null
    } catch (error) {
      console.error('Error creating booking:', error)
      return null
    }
  }, [logActivity])

  return {
    logActivity,
    trackPackageView,
    trackPackageSelection,
    trackBooking,
    trackSearch,
    trackShare,
    saveItinerary,
    createBooking
  }
}
