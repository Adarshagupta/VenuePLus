'use client'

import React, { useEffect, useRef } from 'react'

interface RecentViewItem {
  itemType: 'package' | 'destination' | 'activity' | 'hotel' | 'itinerary'
  itemId: string
  itemData: {
    name: string
    description?: string
    imageUrl?: string
    price?: number
    rating?: number
    location?: string
  }
  viewDuration?: number
  source?: 'search' | 'recommendation' | 'shared' | 'direct'
}

interface UseRecentViewsOptions {
  userId: string
  enabled?: boolean
  trackDuration?: boolean
}

export function useRecentViews({ userId, enabled = true, trackDuration = true }: UseRecentViewsOptions) {
  const startTimeRef = useRef<number>(Date.now())
  const isTrackingRef = useRef<boolean>(false)

  const trackView = async (item: RecentViewItem) => {
    if (!enabled || !userId) return

    try {
      const params = new URLSearchParams({ userId })
      
      const viewData = {
        ...item,
        viewDuration: trackDuration ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0,
        source: item.source || 'direct'
      }

      await fetch(`/api/user/recent-views?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(viewData)
      })
    } catch (error) {
      console.error('Error tracking recent view:', error)
    }
  }

  const startTracking = () => {
    if (trackDuration && !isTrackingRef.current) {
      startTimeRef.current = Date.now()
      isTrackingRef.current = true
    }
  }

  const stopTracking = () => {
    isTrackingRef.current = false
  }

  // Auto-start tracking when component mounts
  useEffect(() => {
    startTracking()
    
    return () => {
      stopTracking()
    }
  }, [])

  // Track page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTracking()
      } else {
        startTracking()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return {
    trackView,
    startTracking,
    stopTracking
  }
}

// Higher-order component to automatically track views
export function withRecentViews<T extends object>(
  Component: React.ComponentType<T>,
  getViewData: (props: T) => RecentViewItem
) {
  return function WrappedComponent(props: T & { userId?: string }) {
    const { trackView } = useRecentViews({ 
      userId: props.userId || '',
      enabled: !!props.userId 
    })

    useEffect(() => {
      if (props.userId) {
        const viewData = getViewData(props)
        trackView(viewData)
      }
    }, [props.userId, trackView])

    return React.createElement(Component, props)
  }
}

// Utility function to log activity
export async function logUserActivity(
  userId: string,
  activity: {
    type: 'view' | 'save' | 'book' | 'share' | 'review' | 'search'
    description: string
    metadata?: any
    location?: string
    device?: string
  }
) {
  try {
    const params = new URLSearchParams({ userId })
    
    await fetch(`/api/user/activities?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity)
    })
  } catch (error) {
    console.error('Error logging user activity:', error)
  }
}
