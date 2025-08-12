import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth for debugging
    console.log('Admin users API called')
    
    // TODO: Re-enable authentication after debugging
    // const session = await getServerSession(authOptions)
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    // Build where clause for filtering
    const whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Get total count for pagination
    const totalUsers = await prisma.user.count({
      where: whereClause
    })

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        // Calculate stats from related tables
        _count: {
          select: {
            bookings: true,
            savedItineraries: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Get booking totals for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Get total spent from bookings
        const bookingStats = await prisma.booking.aggregate({
          where: {
            userId: user.id,
            status: {
              in: ['confirmed', 'completed']
            }
          },
          _sum: {
            totalAmount: true
          },
          _count: true
        })

        return {
          id: user.id,
          name: user.name || 'Unknown User',
          email: user.email,
          phone: user.phone,
          memberSince: user.createdAt?.toISOString() || null,
          lastLogin: user.lastLoginAt?.toISOString() || null,
          totalBookings: bookingStats._count || 0,
          totalSpent: bookingStats._sum.totalAmount || 0,
          totalItineraries: user._count.savedItineraries || 0,
          status: determineUserStatus(user.lastLoginAt)
        }
      })
    )

    return NextResponse.json({
      users: usersWithStats,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function determineUserStatus(lastLoginAt: Date | null): 'active' | 'inactive' | 'suspended' {
  if (!lastLoginAt) return 'inactive'
  
  const daysSinceLogin = Math.floor(
    (Date.now() - lastLoginAt.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  if (daysSinceLogin <= 7) return 'active'
  if (daysSinceLogin <= 30) return 'inactive'
  return 'suspended'
}
