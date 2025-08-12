'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { Shield, Lock, User } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Temporarily bypass authentication for debugging
    setIsAuthorized(true)
    
    // TODO: Re-enable authentication after debugging
    // if (status === 'authenticated' && session?.user) {
    //   setIsAuthorized(true)
    // }
  }, [session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Admin Access Required
          </h2>
          <p className="text-gray-600 mb-6">Please sign in with admin credentials to access the admin panel</p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <User className="w-4 h-4 mr-2" />
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Insufficient Permissions
          </h2>
          <p className="text-gray-600 mb-6">You don't have admin privileges to access this panel</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return <AdminDashboard />
}
