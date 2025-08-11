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

    const profile = await userService.getUserProfile(session.user.id)
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const updates = await request.json()
    const updatedProfile = await userService.updateUserProfile(session.user.id, updates)
    
    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 400 }
      )
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
