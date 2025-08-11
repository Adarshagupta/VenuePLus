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
      travelers, 
      fromCity, 
      selectedCities 
    } = await request.json()

    if (!name || !destination) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate end date based on duration
    let endDate = new Date(startDate)
    if (duration === '4-6 Days') {
      endDate.setDate(endDate.getDate() + 5)
    } else if (duration === '7-9 Days') {
      endDate.setDate(endDate.getDate() + 8)
    } else if (duration === '10-12 Days') {
      endDate.setDate(endDate.getDate() + 11)
    } else if (duration === '13-15 Days') {
      endDate.setDate(endDate.getDate() + 14)
    }

    const trip = await prisma.trip.create({
      data: {
        userId: session.user.id,
        name,
        destination,
        startDate: new Date(startDate),
        endDate,
        duration: duration || '',
        travelers: travelers || '',
        fromCity: fromCity || ''
      }
    })

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

