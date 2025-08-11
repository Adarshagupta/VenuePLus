import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { 
      name, 
      destination, 
      duration, 
      startDate, 
      endDate,
      travelers, 
      fromCity, 
      selectedCities,
      rooms
    } = await request.json()

    if (!name || !destination) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate end date if not provided
    let calculatedEndDate = endDate ? new Date(endDate) : null
    if (!calculatedEndDate && startDate && duration) {
      calculatedEndDate = new Date(startDate)
      if (duration === '4-6 Days') {
        calculatedEndDate.setDate(calculatedEndDate.getDate() + 5)
      } else if (duration === '7-9 Days') {
        calculatedEndDate.setDate(calculatedEndDate.getDate() + 8)
      } else if (duration === '10-12 Days') {
        calculatedEndDate.setDate(calculatedEndDate.getDate() + 11)
      } else if (duration === '13-15 Days') {
        calculatedEndDate.setDate(calculatedEndDate.getDate() + 14)
      }
    }

    // Create the trip
    const trip = await prisma.trip.create({
      data: {
        userId: session.user.id,
        name,
        destination,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: calculatedEndDate || undefined,
        duration: duration || '',
        travelers: travelers || '',
        fromCity: fromCity || ''
      }
    })

    // Create trip stops for selected cities
    if (selectedCities && selectedCities.length > 0) {
      for (let i = 0; i < selectedCities.length; i++) {
        const cityName = selectedCities[i]
        
        // Find or create the city
        let city = await prisma.city.findFirst({
          where: { name: cityName }
        })
        
        if (!city) {
          // Create a new city entry
          city = await prisma.city.create({
            data: {
              name: cityName,
              country: destination === 'Bali' ? 'Indonesia' : 'Unknown',
              countryCode: destination === 'Bali' ? 'ID' : 'XX',
              description: `Explore the beautiful ${cityName}`
            }
          })
        }
        
        // Create trip stop
        await prisma.tripStop.create({
          data: {
            tripId: trip.id,
            cityId: city.id,
            orderIndex: i
          }
        })
      }
    }

    return NextResponse.json(trip, { status: 201 })
  } catch (error) {
    console.error('Trip creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const trips = await prisma.trip.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        stops: {
          include: {
            city: true
          },
          orderBy: {
            orderIndex: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Trips fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

