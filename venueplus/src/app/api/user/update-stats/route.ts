import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { userService } from '@/lib/user-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const { bookingAmount, bookingId } = await request.json()

    if (!bookingAmount || bookingAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid booking amount' },
        { status: 400 }
      )
    }

    console.log('Updating user stats after booking:', {
      userId: session.user.id,
      bookingAmount,
      bookingId,
    })

    // Update user stats
    const updatedProfile = await userService.updateUserStatsAfterBooking(
      session.user.id,
      bookingAmount
    )

    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Failed to update user stats' },
        { status: 500 }
      )
    }

    console.log('User stats updated successfully:', {
      totalTrips: updatedProfile.stats?.totalTrips,
      totalSpent: updatedProfile.stats?.totalSpent,
      lastBookingDate: updatedProfile.stats?.lastBookingDate,
    })

    return NextResponse.json({
      success: true,
      message: 'User stats updated successfully',
      stats: updatedProfile.stats,
    })

  } catch (error) {
    console.error('Error updating user stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

