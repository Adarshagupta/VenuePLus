'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Hotel, 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  CreditCard,
  Ticket,
  Coffee,
  Car,
  Plane,
  Bot,
  Loader2,
  X,
  Sparkles
} from 'lucide-react'
import { useSession } from 'next-auth/react'

interface UserInfo {
  name?: string
  email?: string
  phone?: string
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: any
}

interface AIAgentDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function AIAgentDrawer({ isOpen, onClose }: AIAgentDrawerProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello${session?.user?.name ? ` ${session.user.name}` : ''}! 👋 I'm your AI travel assistant. I can help you with:

🏨 Find & Book Hotels
   Search and compare hotels with real-time pricing

🎫 Event Tickets  
   Book tickets for concerts, sports, tours & attractions

✈️ Travel Planning
   Complete itinerary suggestions

💳 Instant Booking
   Secure payments with Razorpay

What would you like to explore today?`,
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Quick action buttons
  const quickActions = [
    { icon: Hotel, label: 'Find Hotels', action: 'find hotels in ' },
    { icon: Ticket, label: 'Event Tickets', action: 'show me events in ' },
    { icon: Plane, label: 'Plan Trip', action: 'plan a trip to ' },
    { icon: Car, label: 'Book Transport', action: 'book transport from ' },
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Call the AI agent API
      const response = await fetch('/api/ai-agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          context: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        data: data.data || null,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const renderMessageContent = (message: Message) => {
    if (message.data) {
      // Render special UI for different data types
      if (message.data.type === 'hotels') {
        return (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line">{message.content}</div>
            </div>
            <div className="grid gap-3">
              {message.data.hotels?.slice(0, 3).map((hotel: any, index: number) => (
                <HotelCard key={index} hotel={hotel} session={session} />
              ))}
            </div>
          </div>
        )
      } else if (message.data.type === 'events') {
        return (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line">{message.content}</div>
            </div>
            <div className="grid gap-3">
              {message.data.events?.slice(0, 3).map((event: any, index: number) => (
                <EventCard key={index} event={event} session={session} />
              ))}
            </div>
          </div>
        )
      }
    }

    return (
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-line leading-relaxed">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot size={24} />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles size={12} className="text-yellow-300" />
                </motion.div>
              </div>
              <div>
                <h3 className="font-semibold">AI Travel Assistant</h3>
                <p className="text-xs text-purple-100">Powered by Gemini AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-600 mb-3 font-medium">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-sm"
                >
                  <action.icon size={16} className="text-purple-600" />
                  <span className="text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {renderMessageContent(message)}
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center space-x-2">
                  <Loader2 size={16} className="animate-spin text-purple-600" />
                  <span className="text-gray-600 text-sm">AI is thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about hotels, events, or travel plans..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Gemini AI • Secure payments via Razorpay
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hotel Card Component
function HotelCard({ hotel, session }: { hotel: any, session: any }) {
  const handleBookNow = async () => {
    try {
      // Create ticket booking
      const response = await fetch('/api/tickets/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketType: 'hotel',
          title: hotel.name,
          description: `Hotel booking for ${hotel.name}`,
          venue: hotel.name,
          checkInDate: hotel.checkIn,
          checkOutDate: hotel.checkOut,
          location: hotel.location,
          category: 'accommodation',
          price: hotel.price,
          quantity: 1,
          guestInfo: {
            name: hotel.guestName || session?.user?.name || '',
            email: hotel.guestEmail || session?.user?.email || '',
            phone: hotel.guestPhone || '',
          },
          bookingData: {
            amenities: hotel.amenities,
            rating: hotel.rating,
          },
          providerInfo: {
            name: 'Hotel Direct',
            type: 'accommodation'
          }
        }),
      })

      const bookingData = await response.json()

      if (bookingData.success) {
        // Initialize Razorpay payment
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_sQhv40TIPF75eP',
          amount: bookingData.razorpayOrder.amount,
          currency: bookingData.razorpayOrder.currency,
          name: 'VenuePlus',
          description: `Hotel Booking - ${hotel.name}`,
          image: '/logo.png',
          order_id: bookingData.razorpayOrder.id,
          handler: function (response: any) {
            // Verify payment and send confirmation email
            fetch('/api/tickets/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                booking_reference: bookingData.booking.bookingReference,
              }),
            }).then(() => {
              window.alert('Hotel booking confirmed! Check your email for tickets with QR code.')
            })
          },
          prefill: {
            name: hotel.guestName || session?.user?.name || '',
            email: hotel.guestEmail || session?.user?.email || '',
            contact: hotel.guestPhone || '',
          },
          theme: {
            color: '#667eea',
          },
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      window.alert('Failed to initiate booking. Please try again.')
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-sm text-gray-800">{hotel.name}</h4>
        <div className="flex items-center space-x-1">
          <Star size={12} className="text-yellow-400 fill-current" />
          <span className="text-xs text-gray-600">{hotel.rating}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
        <MapPin size={12} />
        <span>{hotel.location}</span>
      </div>
      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-3">
        <Calendar size={12} />
        <span>{hotel.checkIn} - {hotel.checkOut}</span>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-lg font-bold text-purple-600">₹{hotel.price}</span>
          <span className="text-xs text-gray-500">/night</span>
        </div>
        <button
          onClick={handleBookNow}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-1"
        >
          <CreditCard size={12} />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  )
}

// Event Card Component
function EventCard({ event, session }: { event: any, session: any }) {
  const handleBookTicket = async () => {
    try {
      // Create ticket booking
      const response = await fetch('/api/tickets/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketType: 'event',
          title: event.name,
          description: event.description,
          venue: event.venue,
          eventDate: event.date,
          eventTime: event.time,
          location: event.venue,
          category: event.category,
          price: event.price,
          quantity: 1,
          guestInfo: {
            name: event.guestName || session?.user?.name || '',
            email: event.guestEmail || session?.user?.email || '',
            phone: event.guestPhone || '',
          },
          bookingData: {
            eventDetails: event,
          },
          providerInfo: {
            name: 'Event Organizer',
            type: 'event'
          }
        }),
      })

      const bookingData = await response.json()

      if (bookingData.success) {
        // Initialize Razorpay payment
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_sQhv40TIPF75eP',
          amount: bookingData.razorpayOrder.amount,
          currency: bookingData.razorpayOrder.currency,
          name: 'VenuePlus',
          description: `Event Ticket - ${event.name}`,
          image: '/logo.png',
          order_id: bookingData.razorpayOrder.id,
          handler: function (response: any) {
            // Verify payment and send confirmation email
            fetch('/api/tickets/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                booking_reference: bookingData.booking.bookingReference,
              }),
            }).then(() => {
              window.alert('Event ticket booked! Check your email for tickets with QR code.')
            })
          },
          prefill: {
            name: event.guestName || session?.user?.name || '',
            email: event.guestEmail || session?.user?.email || '',
            contact: event.guestPhone || '',
          },
          theme: {
            color: '#667eea',
          },
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
    } catch (error) {
      console.error('Error booking ticket:', error)
      window.alert('Failed to book ticket. Please try again.')
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-sm text-gray-800">{event.name}</h4>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
          {event.category}
        </span>
      </div>
      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
        <MapPin size={12} />
        <span>{event.venue}</span>
      </div>
      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-3">
        <Calendar size={12} />
        <span>{event.date} • {event.time}</span>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-lg font-bold text-purple-600">₹{event.price}</span>
          <span className="text-xs text-gray-500">/ticket</span>
        </div>
        <button
          onClick={handleBookTicket}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-1"
        >
          <Ticket size={12} />
          <span>Book Ticket</span>
        </button>
      </div>
    </div>
  )
}
