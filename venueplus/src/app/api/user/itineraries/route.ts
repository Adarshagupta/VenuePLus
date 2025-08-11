import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { userService } from '@/lib/user-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)

    // Parse filter parameters
    const filter: any = {}
    
    const status = searchParams.get('status')
    if (status) {
      filter.status = status.split(',')
    }
    
    const destination = searchParams.get('destination')
    if (destination) {
      filter.destination = destination.split(',')
    }
    
    const minBudget = searchParams.get('minBudget')
    const maxBudget = searchParams.get('maxBudget')
    if (minBudget && maxBudget) {
      filter.budgetRange = {
        min: parseFloat(minBudget),
        max: parseFloat(maxBudget)
      }
    }
    
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate && endDate) {
      filter.dateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      }
    }
    
    const tags = searchParams.get('tags')
    if (tags) {
      filter.tags = tags.split(',')
    }
    
    const sortBy = searchParams.get('sortBy')
    const sortOrder = searchParams.get('sortOrder')
    if (sortBy) {
      filter.sortBy = sortBy
      filter.sortOrder = sortOrder || 'desc'
    }

    const itineraries = await userService.getUserItineraries(session.user.id, filter)
    return NextResponse.json(itineraries)
  } catch (error) {
    console.error('Error fetching user itineraries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const itineraryData = await request.json()
    const savedItinerary = await userService.saveItinerary(session.user.id, itineraryData)
    
    if (!savedItinerary) {
      return NextResponse.json(
        { error: 'Failed to save itinerary' },
        { status: 400 }
      )
    }

    return NextResponse.json(savedItinerary, { status: 201 })
  } catch (error) {
    console.error('Error saving itinerary:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
