'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { UserProfile } from '@/components/user-profile'
import { User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(session.user.id)
    }
  }, [session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Component */}
      <UserProfile userId={userId} />
    </div>
  )
}
