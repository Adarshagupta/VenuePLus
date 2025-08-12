import { NextRequest, NextResponse } from 'next/server'
import { geminiTravelAgent } from '@/lib/gemini-ai'

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Analyze the message to determine intent
    const intent = analyzeIntent(message.toLowerCase())
    
    let response: any
    
    switch (intent.type) {
      case 'hotel_search':
        response = await handleHotelSearch(message, intent)
        break
      case 'event_search':
        response = await handleEventSearch(message, intent)
        break
      case 'travel_planning':
        response = await handleTravelPlanning(message, intent)
        break
      case 'booking_help':
        response = await handleBookingHelp(message, intent)
        break
      default:
        response = await handleGeneralQuery(message, context)
        break
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in AI agent chat:', error)
    return NextResponse.json(
      { 
        response: 'I apologize, but I\'m experiencing some technical difficulties. Please try again in a moment.',
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

function analyzeIntent(message: string) {
  const hotelKeywords = ['hotel', 'stay', 'accommodation', 'room', 'resort', 'lodge', 'inn']
  const eventKeywords = ['event', 'ticket', 'concert', 'show', 'festival', 'tour', 'attraction', 'museum']
  const travelKeywords = ['trip', 'travel', 'itinerary', 'vacation', 'holiday', 'visit', 'tour']
  const bookingKeywords = ['book', 'reserve', 'booking', 'payment', 'pay', 'buy']

  // Extract location
  const locationMatch = message.match(/(?:in|at|near|to)\s+([a-zA-Z\s]+)/)
  const location = locationMatch ? locationMatch[1].trim() : null

  // Extract dates
  const dateKeywords = ['today', 'tomorrow', 'next week', 'this weekend', 'next month']
  const foundDate = dateKeywords.find(date => message.includes(date))

  if (hotelKeywords.some(keyword => message.includes(keyword))) {
    return {
      type: 'hotel_search',
      location,
      dateHint: foundDate,
      message
    }
  }

  if (eventKeywords.some(keyword => message.includes(keyword))) {
    return {
      type: 'event_search',
      location,
      dateHint: foundDate,
      message
    }
  }

  if (travelKeywords.some(keyword => message.includes(keyword))) {
    return {
      type: 'travel_planning',
      location,
      dateHint: foundDate,
      message
    }
  }

  if (bookingKeywords.some(keyword => message.includes(keyword))) {
    return {
      type: 'booking_help',
      location,
      message
    }
  }

  return {
    type: 'general',
    location,
    message
  }
}

async function handleHotelSearch(message: string, intent: any) {
  try {
    const prompt = `
    User is searching for hotels. Query: "${message}"
    Location: ${intent.location || 'Not specified'}
    
    Generate a helpful response about hotel options and provide sample hotel data.
    Be conversational and helpful.
    `

    const aiResult = await geminiTravelAgent.searchAndRecommend(prompt, {
      type: 'hotels',
      location: intent.location
    })

    // Generate mock hotel data
    const hotels = generateMockHotels(intent.location || 'Delhi')

    return {
      response: `Great! I found some excellent hotel options${intent.location ? ` in ${intent.location}` : ''}. Here are my top recommendations with real-time pricing:`,
      data: {
        type: 'hotels',
        hotels: hotels
      }
    }
  } catch (error) {
    console.error('Error in hotel search:', error)
    return {
      response: 'I can help you find hotels! Could you please specify your destination and preferred dates?'
    }
  }
}

async function handleEventSearch(message: string, intent: any) {
  try {
    const prompt = `
    User is searching for events/tickets. Query: "${message}"
    Location: ${intent.location || 'Not specified'}
    
    Generate a helpful response about event options and provide sample event data.
    Be conversational and helpful.
    `

    const aiResult = await geminiTravelAgent.searchAndRecommend(prompt, {
      type: 'events',
      location: intent.location
    })

    // Generate mock event data
    const events = generateMockEvents(intent.location || 'Delhi')

    return {
      response: `Fantastic! I found some exciting events${intent.location ? ` in ${intent.location}` : ''}. Here are the top events you might enjoy:`,
      data: {
        type: 'events',
        events: events
      }
    }
  } catch (error) {
    console.error('Error in event search:', error)
    return {
      response: 'I can help you find amazing events and book tickets! What type of events are you interested in and where?'
    }
  }
}

async function handleTravelPlanning(message: string, intent: any) {
  try {
    const prompt = `
    User wants travel planning help. Query: "${message}"
    Location: ${intent.location || 'Not specified'}
    
    Provide helpful travel planning advice, suggestions for itineraries, and general guidance.
    Be enthusiastic and informative.
    `

    const aiResult = await geminiTravelAgent.searchAndRecommend(prompt, {
      type: 'travel_planning',
      destination: intent.location
    })

    return {
      response: `I'd love to help you plan an amazing trip${intent.location ? ` to ${intent.location}` : ''}! 

Here are some suggestions to get started:

🗓️ **Best Time to Visit**: Consider the weather and local events
✈️ **Transportation**: I can help find flights and local transport
🏨 **Accommodation**: From budget stays to luxury resorts
🎯 **Must-See Attractions**: Hidden gems and popular spots
🍽️ **Local Cuisine**: Restaurant recommendations
💰 **Budget Planning**: Cost estimates and money-saving tips

Would you like me to create a detailed itinerary? Just let me know your travel dates, budget, and interests!`
    }
  } catch (error) {
    console.error('Error in travel planning:', error)
    return {
      response: 'I can help you plan the perfect trip! Tell me where you\'d like to go and I\'ll create a personalized itinerary for you.'
    }
  }
}

async function handleBookingHelp(message: string, intent: any) {
  return {
    response: `I can help you with secure bookings! 🔐

**What I can book for you:**
🏨 **Hotels** - Real-time availability and best prices
🎫 **Event Tickets** - Concerts, shows, attractions, tours
✈️ **Flights** - Domestic and international
🚗 **Transportation** - Cabs, buses, trains
🍽️ **Restaurant Reservations** - Top-rated dining experiences

**Payment & Security:**
💳 Secure payments through Razorpay
🛡️ 256-bit SSL encryption
📱 Instant confirmation and e-tickets
🔄 Easy cancellation and refunds

What would you like to book? Just tell me your preferences and I'll find the best options!`
  }
}

async function handleGeneralQuery(message: string, context: any) {
  try {
    const prompt = `
    You are a helpful AI travel assistant for VenuePlus. User query: "${message}"
    
    Previous context: ${JSON.stringify(context)}
    
    Provide a helpful, friendly response. If the query is about travel, hotels, events, or bookings, 
    guide them towards specific actions they can take. Be conversational and enthusiastic.
    `

    const aiResult = await geminiTravelAgent.searchAndRecommend(prompt, {
      type: 'general'
    })

    return {
      response: aiResult.response || `I'm here to help you with all your travel needs! I can assist you with:

🏨 **Hotel Bookings** - Find and book accommodations worldwide
🎫 **Event Tickets** - Concerts, sports, attractions, and tours
✈️ **Travel Planning** - Complete itineraries and recommendations
🚗 **Transportation** - Flights, trains, cabs, and more
💳 **Secure Payments** - Safe and instant bookings

What would you like to explore today?`
    }
  } catch (error) {
    console.error('Error in general query:', error)
    return {
      response: 'I\'m your AI travel assistant! I can help you find hotels, book event tickets, plan trips, and make secure payments. What would you like to do?'
    }
  }
}

function generateMockHotels(location: string) {
  const baseHotels = [
    {
      id: 'hotel_1',
      name: 'Grand Palace Hotel',
      location: `Central ${location}`,
      rating: 4.5,
      price: 3500,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    },
    {
      id: 'hotel_2',
      name: 'Business Comfort Inn',
      location: `Business District, ${location}`,
      rating: 4.2,
      price: 2800,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      amenities: ['Free WiFi', 'Gym', 'Breakfast', 'Airport Shuttle'],
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'
    },
    {
      id: 'hotel_3',
      name: 'Budget Stay Lodge',
      location: `Near Airport, ${location}`,
      rating: 3.8,
      price: 1500,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      amenities: ['Free WiFi', 'Clean Rooms', '24/7 Service'],
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'
    }
  ]

  return baseHotels
}

function generateMockEvents(location: string) {
  const baseEvents = [
    {
      id: 'event_1',
      name: 'Cultural Heritage Concert',
      venue: `${location} Cultural Center`,
      date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      time: '7:00 PM',
      price: 800,
      category: 'Music',
      description: 'Traditional music performance featuring local artists',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'
    },
    {
      id: 'event_2',
      name: 'Food Festival',
      venue: `${location} Exhibition Grounds`,
      date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      time: '11:00 AM',
      price: 500,
      category: 'Food',
      description: 'Taste the best local and international cuisines',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
    },
    {
      id: 'event_3',
      name: 'City Walking Tour',
      venue: `Historic ${location}`,
      date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      time: '9:00 AM',
      price: 300,
      category: 'Tour',
      description: 'Guided tour of historical landmarks and hidden gems',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73826'
    }
  ]

  return baseEvents
}
