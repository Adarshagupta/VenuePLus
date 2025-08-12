'use client'

import { useState, useEffect } from 'react'
import {
  Users, Calendar, TrendingUp, DollarSign, Eye, Settings,
  Search, Filter, Download, Plus, MoreVertical, ArrowUp,
  ArrowDown, User, MapPin, Star, Clock, Shield, Activity,
  BarChart3, PieChart, LineChart, Globe, Plane, Heart,
  ChevronLeft, ChevronRight, RefreshCw, X, BookOpen
} from 'lucide-react'

interface AdminDashboardProps {}

interface User {
  id: string
  name: string
  email: string
  phone?: string
  memberSince: string | null
  totalBookings: number
  totalSpent: number
  totalItineraries: number
  status: 'active' | 'inactive' | 'suspended'
  lastLogin?: string | null
}

interface Booking {
  id: string
  user: {
    name: string
    email: string
  }
  destination: string
  startDate: string | null
  endDate: string | null
  travelers: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  provider: string
  bookingDate: string | null
}

interface Analytics {
  totalUsers: number
  totalBookings: number
  totalRevenue: number
  activeUsers: number
  userGrowth: number
  bookingGrowth: number
  revenueGrowth: number
  topDestinations: Array<{
    name: string
    bookings: number
    revenue: number
  }>
  monthlyStats: Array<{
    month: string
    users: number
    bookings: number
    revenue: number
  }>
}

export function AdminDashboard({}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings' | 'analytics'>('overview')
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  
  // Modal states for detailed views
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
      setCurrentPage(1) // Reset to first page when searching
    }
  }, [users, searchTerm])

  // Filter bookings
  useEffect(() => {
    setFilteredBookings(bookings)
  }, [bookings])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    
    try {
      // Fetch all data in parallel
      const [usersResponse, bookingsResponse, analyticsResponse] = await Promise.all([
        fetch('/api/admin/users?limit=100'),
        fetch('/api/admin/bookings?limit=50'),
        fetch('/api/admin/analytics')
      ])

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
      } else {
        console.error('Failed to fetch users:', usersResponse.statusText)
        setUsers([])
      }

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData.bookings || [])
      } else {
        console.error('Failed to fetch bookings:', bookingsResponse.statusText)
        setBookings([])
      }

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData)
      } else {
        console.error('Failed to fetch analytics:', analyticsResponse.statusText)
        // Set default analytics if API fails
        setAnalytics({
          totalUsers: 0,
          totalBookings: 0,
          totalRevenue: 0,
          activeUsers: 0,
          userGrowth: 0,
          bookingGrowth: 0,
          revenueGrowth: 0,
          topDestinations: [],
          monthlyStats: []
        })
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set empty data on error
      setUsers([])
      setBookings([])
      setAnalytics({
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        activeUsers: 0,
        userGrowth: 0,
        bookingGrowth: 0,
        revenueGrowth: 0,
        topDestinations: [],
        monthlyStats: []
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A'
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date'
      }
      
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(dateObj)
    } catch (error) {
      console.warn('Error formatting date:', date, error)
      return 'Invalid Date'
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700',
      'inactive': 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700',
      'suspended': 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700',
      'pending': 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700',
      'confirmed': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700',
      'completed': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700',
      'cancelled': 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  // Modal handlers
  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowBookingModal(true)
  }

  const closeModals = () => {
    setShowUserModal(false)
    setShowBookingModal(false)
    setSelectedUser(null)
    setSelectedBooking(null)
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{analytics?.userGrowth}%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
            {analytics?.totalUsers.toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Users</p>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{analytics?.bookingGrowth}%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
            {analytics?.totalBookings.toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Bookings</p>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{analytics?.revenueGrowth}%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            {formatCurrency(analytics?.totalRevenue || 0).replace('.00', '')}
          </h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>

        <div className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
            {analytics?.activeUsers.toLocaleString()}
          </h3>
          <p className="text-gray-600">Active Users</p>
        </div>
      </div>

      {/* Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Destinations */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-8">
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Top Destinations
          </h3>
          <div className="space-y-4">
            {analytics?.topDestinations && analytics.topDestinations.length > 0 ? analytics.topDestinations.map((dest, index) => (
              <div key={dest.name} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                    'bg-gradient-to-r from-blue-400 to-cyan-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{dest.name}</h4>
                    <p className="text-sm text-gray-600">{dest.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(dest.revenue).replace('.00', '')}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No destination data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-8">
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Monthly Growth
          </h3>
          <div className="space-y-6">
            {analytics?.monthlyStats && analytics.monthlyStats.length > 0 ? analytics.monthlyStats.slice(-3).map((stat, index) => (
              <div key={stat.month} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{stat.month} 2025</span>
                  <span className="text-sm text-gray-600">{stat.users} users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(stat.users / 1300) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{stat.bookings} bookings</span>
                  <span>{formatCurrency(stat.revenue).replace('.00', '')}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No monthly data available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          User Management
        </h2>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl hover:bg-white/70 transition-all duration-300">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button 
            onClick={loadDashboardData}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Member Since</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Bookings</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Total Spent</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((user) => (
                <tr key={user.id} className="border-t border-gray-100 hover:bg-white/50 transition-all duration-300">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-gray-900">{user.email}</p>
                      {user.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{formatDate(user.memberSince)}</td>
                  <td className="py-4 px-6 text-gray-900">{user.totalBookings}</td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{formatCurrency(user.totalSpent)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewUser(user)}
                        className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors duration-300"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-300">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
          <span className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
              {currentPage}
            </span>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= filteredUsers.length}
              className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBookings = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Bookings Management
        </h2>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings && bookings.length > 0 ? bookings.map((booking) => (
          <div key={booking.id} className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{booking.destination}</h3>
                  <p className="text-gray-600">Booking ID: {booking.id}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {formatCurrency(booking.totalAmount)}
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-t border-gray-100">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer</h4>
                <p className="text-gray-700">{booking.user.name}</p>
                <p className="text-sm text-gray-600">{booking.user.email}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Travel Details</h4>
                <p className="text-gray-700">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                <p className="text-sm text-gray-600">{booking.travelers} travelers</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Provider</h4>
                <p className="text-gray-700">{booking.provider}</p>
                <p className="text-sm text-gray-600">Booked on {formatDate(booking.bookingDate)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Last updated: {formatDate(booking.bookingDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleViewBooking(booking)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors duration-300"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600">No bookings have been made yet or they're still loading.</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Analytics Dashboard
      </h2>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics?.monthlyStats.map((stat, index) => (
              <div key={stat.month} className="flex-1 flex flex-col items-center space-y-2">
                <div 
                  className="w-full bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(stat.revenue / 13000000) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-600">{stat.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Conversion Rate</span>
                <span className="font-bold text-green-600">8.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Customer Satisfaction</span>
                <span className="font-bold text-blue-600">9.2/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Repeat Customers</span>
                <span className="font-bold text-purple-600">67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                VenuePlus Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">System Healthy</span>
              </div>
              <button className="w-10 h-10 bg-white/50 hover:bg-white/70 rounded-xl flex items-center justify-center transition-all duration-300">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/40 backdrop-blur-lg border-b border-white/20 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3, gradient: 'from-blue-500 to-cyan-500' },
              { id: 'users', label: 'Users', icon: Users, gradient: 'from-emerald-500 to-teal-500' },
              { id: 'bookings', label: 'Bookings', icon: Calendar, gradient: 'from-orange-500 to-red-500' },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp, gradient: 'from-purple-500 to-pink-500' }
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group relative flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-white/20' : 'bg-transparent group-hover:bg-white/20'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  User Details
                </h2>
                <button
                  onClick={closeModals}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-300 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      {selectedUser.phone && (
                        <p className="text-gray-500">{selectedUser.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Status</span>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Member Since</span>
                      <p className="font-medium text-gray-900">{formatDate(selectedUser.memberSince)}</p>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{selectedUser.totalBookings}</div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(selectedUser.totalSpent)}</div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{selectedUser.totalItineraries}</div>
                    <div className="text-sm text-gray-600">Itineraries</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Login:</span>
                      <span className="font-medium">{formatDate(selectedUser.lastLogin) || 'Never'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Status:</span>
                      <span className="font-medium capitalize">{selectedUser.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Booking Details
                </h2>
                <button
                  onClick={closeModals}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-300 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Booking Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedBooking.destination}</h3>
                      <p className="text-gray-600">Booking Reference: {selectedBooking.bookingReference}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </div>
                  </div>
                  
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {formatCurrency(selectedBooking.totalAmount)}
                  </div>
                </div>

                {/* Travel Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Travel Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Destination</span>
                        <p className="font-medium">{selectedBooking.destination}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Travel Dates</span>
                        <p className="font-medium">
                          {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Travelers</span>
                        <p className="font-medium">{selectedBooking.travelers} person(s)</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Provider</span>
                        <p className="font-medium">{selectedBooking.provider}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Customer Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Customer Name</span>
                        <p className="font-medium">{selectedBooking.user.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email</span>
                        <p className="font-medium">{selectedBooking.user.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Booking Date</span>
                        <p className="font-medium">{formatDate(selectedBooking.bookingDate)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status</span>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={closeModals}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Edit Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
