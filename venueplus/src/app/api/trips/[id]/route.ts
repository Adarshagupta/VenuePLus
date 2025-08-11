import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        stops: {
          include: {
            city: true,
            activities: {
              include: {
                activity: true
              }
            }
          },
          orderBy: {
            orderIndex: 'asc'
          }
        }
      }
    })

    if (!trip) {
      return NextResponse.json(
        { message: 'Trip not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(trip)
  } catch (error) {
    console.error('Trip fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const trip = await prisma.trip.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!trip) {
      return NextResponse.json(
        { message: 'Trip not found' },
        { status: 404 }
      )
    }

    const updatedTrip = await prisma.trip.update({
      where: {
        id: params.id
      },
      data: {
        name: data.name,
        destination: data.destination,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        duration: data.duration,
        travelers: data.travelers,
        fromCity: data.fromCity
      }
    })

    return NextResponse.json(updatedTrip)
  } catch (error) {
    console.error('Trip update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!trip) {
      return NextResponse.json(
        { message: 'Trip not found' },
        { status: 404 }
      )
    }

    await prisma.trip.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Trip deleted successfully' })
  } catch (error) {
    console.error('Trip deletion error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

