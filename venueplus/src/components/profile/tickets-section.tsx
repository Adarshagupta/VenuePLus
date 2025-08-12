'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Clock, 
  QrCode, 
  Download,
  Star,
  Users,
  Hotel,
  Plane,
  Car,
  Coffee,
  Music,
  Camera,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface TicketBooking {
  id: string
  ticketType: string
  title: string
  description?: string
  venue?: string
  eventDate?: string
  eventTime?: string
  checkInDate?: string
  checkOutDate?: string
  location: string
  category: string
  price: number
  quantity: number
  totalAmount: number
  status: string
  paymentStatus: string
  bookingReference: string
  qrCode?: string
  guestInfo?: any
  bookingData?: any
  createdAt: string
}

interface TicketsSectionProps {
  userId: string
}

export function TicketsSection({ userId }: TicketsSectionProps) {
  const [tickets, setTickets] = useState<TicketBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<TicketBooking | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTickets()
  }, [userId])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets/book', {
        method: 'GET'
      })
      const data = await response.json()

      if (data.success) {
        setTickets(data.tickets)
      } else {
        setError('Failed to fetch tickets')
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setError('Failed to fetch tickets')
    } finally {
      setLoading(false)
    }
  }

  const getTicketIcon = (ticketType: string) => {
    switch (ticketType) {
      case 'hotel': return Hotel
      case 'event': return Music
      case 'flight': return Plane
      case 'transport': return Car
      case 'activity': return Camera
      default: return Ticket
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      case 'expired': return 'text-gray-600 bg-gray-100'
      case 'used': return 'text-blue-600 bg-blue-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle
      case 'cancelled': return XCircle
      case 'expired': return AlertCircle
      case 'used': return CheckCircle
      default: return AlertCircle
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true
    if (filter === 'upcoming') {
      const eventDate = ticket.eventDate || ticket.checkInDate
      return eventDate && new Date(eventDate) > new Date()
    }
    if (filter === 'past') {
      const eventDate = ticket.eventDate || ticket.checkInDate
      return eventDate && new Date(eventDate) <= new Date()
    }
    return ticket.ticketType === filter
  })

  const downloadQRCode = (ticket: TicketBooking) => {
    if (!ticket.qrCode) return

    const link = document.createElement('a')
    link.href = ticket.qrCode
    link.download = `ticket-${ticket.bookingReference}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchTickets}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Ticket className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">My Tickets</h3>
            <p className="text-gray-600">View and manage your bookings</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{tickets.length}</div>
          <div className="text-sm text-gray-500">Total Bookings</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All Tickets' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'past', label: 'Past' },
          { key: 'hotel', label: 'Hotels' },
          { key: 'event', label: 'Events' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tickets Grid */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? "You haven't booked any tickets yet. Use our AI assistant to find and book amazing experiences!"
              : `No ${filter} tickets found. Try a different filter.`
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((ticket, index) => {
            const Icon = getTicketIcon(ticket.ticketType)
            const StatusIcon = getStatusIcon(ticket.status)
            
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                {/* Ticket Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 line-clamp-1">{ticket.title}</h4>
                      <p className="text-sm text-gray-500 capitalize">{ticket.ticketType}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span className="capitalize">{ticket.status}</span>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="space-y-2 mb-4">
                  {ticket.venue && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{ticket.venue}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{ticket.location}</span>
                  </div>
                  {(ticket.eventDate || ticket.checkInDate) && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {ticket.eventDate 
                          ? new Date(ticket.eventDate).toLocaleDateString()
                          : new Date(ticket.checkInDate!).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {ticket.eventTime && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{ticket.eventTime}</span>
                    </div>
                  )}
                </div>

                {/* Ticket Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-lg font-bold text-purple-600">₹{ticket.totalAmount}</div>
                    <div className="text-xs text-gray-500">{ticket.quantity} ticket(s)</div>
                  </div>
                  {ticket.qrCode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadQRCode(ticket)
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>QR Code</span>
                    </button>
                  )}
                </div>

                {/* Booking Reference */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Ref: <span className="font-mono font-medium">{ticket.bookingReference}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  )
}

// Ticket Detail Modal Component
function TicketDetailModal({ ticket, onClose }: { ticket: TicketBooking, onClose: () => void }) {
  const Icon = ticket.ticketType === 'hotel' ? Hotel : 
               ticket.ticketType === 'event' ? Music :
               ticket.ticketType === 'flight' ? Plane :
               ticket.ticketType === 'transport' ? Car : Ticket

  const downloadQRCode = () => {
    if (!ticket.qrCode) return

    const link = document.createElement('a')
    link.href = ticket.qrCode
    link.download = `ticket-${ticket.bookingReference}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{ticket.title}</h3>
              <p className="text-gray-500 capitalize">{ticket.ticketType} Booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* QR Code */}
        {ticket.qrCode && (
          <div className="text-center mb-6 p-6 bg-gray-50 rounded-xl">
            <img 
              src={ticket.qrCode} 
              alt="QR Code" 
              className="w-48 h-48 mx-auto mb-4 border border-gray-200 rounded-lg"
            />
            <button
              onClick={downloadQRCode}
              className="flex items-center space-x-2 mx-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download QR Code</span>
            </button>
          </div>
        )}

        {/* Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Booking Reference</label>
              <p className="font-mono font-medium text-purple-600">{ticket.bookingReference}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
              <p className="font-medium capitalize text-green-600">{ticket.status}</p>
            </div>
          </div>

          {ticket.venue && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Venue</label>
              <p className="font-medium text-gray-900">{ticket.venue}</p>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
            <p className="font-medium text-gray-900">{ticket.location}</p>
          </div>

          {ticket.eventDate && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</label>
                <p className="font-medium text-gray-900">{new Date(ticket.eventDate).toLocaleDateString()}</p>
              </div>
              {ticket.eventTime && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Time</label>
                  <p className="font-medium text-gray-900">{ticket.eventTime}</p>
                </div>
              )}
            </div>
          )}

          {ticket.checkInDate && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in</label>
                <p className="font-medium text-gray-900">{new Date(ticket.checkInDate).toLocaleDateString()}</p>
              </div>
              {ticket.checkOutDate && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-out</label>
                  <p className="font-medium text-gray-900">{new Date(ticket.checkOutDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quantity</label>
              <p className="font-medium text-gray-900">{ticket.quantity} ticket(s)</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Amount</label>
              <p className="text-xl font-bold text-purple-600">₹{ticket.totalAmount}</p>
            </div>
          </div>

          {ticket.description && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</label>
              <p className="text-gray-700">{ticket.description}</p>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Booked On</label>
            <p className="font-medium text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
