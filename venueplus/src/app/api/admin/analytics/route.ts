import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth for debugging
    console.log('Admin analytics API called')
    
    // TODO: Re-enable authentication after debugging
    // const session = await getServerSession(authOptions)
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Get date ranges for analytics
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)

    // Get total users
    const totalUsers = await prisma.user.count()

    // Get active users (logged in within last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: sevenDaysAgo
        }
      }
    })

    // Get user growth (users from last 30 days vs previous 30 days)
    const usersLast30Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    const usersPrevious30Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    })

    const userGrowth = usersPrevious30Days > 0 
      ? ((usersLast30Days - usersPrevious30Days) / usersPrevious30Days) * 100 
      : 0

    // Get total bookings
    const totalBookings = await prisma.booking.count()

    // Get booking growth
    const bookingsLast30Days = await prisma.booking.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const bookingsPrevious30Days = await prisma.booking.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    })

    const bookingGrowth = bookingsPrevious30Days > 0 
      ? ((bookingsLast30Days - bookingsPrevious30Days) / bookingsPrevious30Days) * 100 
      : 0

    // Get total revenue
    const revenueData = await prisma.booking.aggregate({
      where: {
        status: {
          in: ['confirmed', 'completed']
        }
      },
      _sum: {
        totalAmount: true
      }
    })
    const totalRevenue = revenueData._sum.totalAmount || 0

    // Get revenue growth
    const revenueLast30Days = await prisma.booking.aggregate({
      where: {
        status: {
          in: ['confirmed', 'completed']
        },
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _sum: {
        totalAmount: true
      }
    })

    const revenuePrevious30Days = await prisma.booking.aggregate({
      where: {
        status: {
          in: ['confirmed', 'completed']
        },
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      },
      _sum: {
        totalAmount: true
      }
    })

    const currentRevenue = revenueLast30Days._sum.totalAmount || 0
    const previousRevenue = revenuePrevious30Days._sum.totalAmount || 0
    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0

    // Get top destinations
    const topDestinations = await prisma.booking.groupBy({
      by: ['destination'],
      where: {
        status: {
          in: ['confirmed', 'completed']
        }
      },
      _count: {
        destination: true
      },
      _sum: {
        totalAmount: true
      },
      orderBy: {
        _count: {
          destination: 'desc'
        }
      },
      take: 5
    })

    const formattedDestinations = topDestinations.map(dest => ({
      name: dest.destination,
      bookings: dest._count.destination,
      revenue: dest._sum.totalAmount || 0
    }))

    // Get monthly stats for last 6 months
    const monthlyStats = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })

      const monthBookings = await prisma.booking.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })

      const monthRevenue = await prisma.booking.aggregate({
        where: {
          status: {
            in: ['confirmed', 'completed']
          },
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        },
        _sum: {
          totalAmount: true
        }
      })

      monthlyStats.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        users: monthUsers,
        bookings: monthBookings,
        revenue: monthRevenue._sum.totalAmount || 0
      })
    }

    const analytics = {
      totalUsers,
      totalBookings,
      totalRevenue,
      activeUsers,
      userGrowth: Math.round(userGrowth * 100) / 100,
      bookingGrowth: Math.round(bookingGrowth * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      topDestinations: formattedDestinations,
      monthlyStats
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Error fetching admin analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
