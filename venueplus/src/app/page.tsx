'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User, Plane } from 'lucide-react'
import { Header } from '@/components/header'
import { TripPlanningModal } from '@/components/trip-planning-modal'
import { SearchSection } from '@/components/search-section'
import { StatsSection } from '@/components/stats-section'
import { FeatureShowcase } from '@/components/feature-showcase'
import { TestimonialSection } from '@/components/testimonial-section'

export default function HomePage() {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('destinations')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [selectedDestinationPackage, setSelectedDestinationPackage] = useState<any>(null)

  // Destination package data with detailed 7-day itineraries
  const destinationPackages = [
    {
      id: 1,
      title: "Golden Triangle Premium Tour",
      destination: "Delhi, Agra & Jaipur",
      duration: "7 Days / 6 Nights",
      price: "₹35,999",
      originalPrice: "₹45,999",
      rating: 4.8,
      reviews: 1247,
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
      description: "Experience India's most iconic destinations with our comprehensive Golden Triangle tour covering Delhi, Agra, and Jaipur with authentic cultural experiences.",
      highlights: [
        "Taj Mahal sunrise experience",
        "Red Fort and Jama Masjid guided tours",
        "Amber Fort elephant ride",
        "City Palace and Jantar Mantar exploration",
        "Fatehpur Sikri UNESCO site visit",
        "Hawa Mahal photo opportunities",
        "Traditional bazaar shopping"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Delhi - Capital Discovery",
          activities: [
            { time: "08:00 AM", activity: "Arrival at Indira Gandhi International Airport", location: "IGI Airport Terminal 3" },
            { time: "09:00 AM", activity: "Hotel check-in and welcome refreshments", location: "Heritage hotel in Delhi" },
            { time: "10:30 AM", activity: "Visit Humayun's Tomb (UNESCO World Heritage)", location: "Nizamuddin East" },
            { time: "01:00 PM", activity: "Lunch at traditional Delhi restaurant", location: "Connaught Place" },
            { time: "02:30 PM", activity: "Explore India Gate and Rajpath", location: "India Gate" },
            { time: "04:00 PM", activity: "Visit Lotus Temple for meditation", location: "Lotus Temple, Kalkaji" },
            { time: "06:00 PM", activity: "Explore Connaught Place markets", location: "Connaught Place" },
            { time: "08:00 PM", activity: "Welcome dinner with cultural program", location: "Hotel restaurant" }
          ],
          accommodation: "5-star heritage hotel in central Delhi",
          meals: "Lunch, Dinner"
        },
        {
          day: 2,
          title: "Old Delhi Heritage Walk",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at hotel", location: "Hotel" },
            { time: "09:00 AM", activity: "Red Fort guided tour (UNESCO site)", location: "Red Fort, Chandni Chowk" },
            { time: "11:00 AM", activity: "Jama Masjid visit and minaret climb", location: "Jama Masjid" },
            { time: "12:00 PM", activity: "Rickshaw ride through Chandni Chowk", location: "Chandni Chowk bazaar" },
            { time: "01:00 PM", activity: "Street food lunch tour", location: "Paranthe Wali Gali" },
            { time: "03:00 PM", activity: "Qutub Minar complex exploration", location: "Qutub Minar, Mehrauli" },
            { time: "05:00 PM", activity: "Raj Ghat (Mahatma Gandhi memorial)", location: "Raj Ghat" },
            { time: "07:00 PM", activity: "Sound and light show preparation", location: "Red Fort" },
            { time: "08:00 PM", activity: "Dinner at Karim's (historic restaurant)", location: "Jama Masjid area" }
          ],
          accommodation: "5-star heritage hotel in central Delhi",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 3,
          title: "Delhi to Agra - Mughal Heritage",
          activities: [
            { time: "07:00 AM", activity: "Early breakfast and checkout", location: "Hotel" },
            { time: "08:00 AM", activity: "Drive to Agra via Yamuna Expressway", location: "En route (3.5 hours)" },
            { time: "12:00 PM", activity: "Arrival and check-in at heritage hotel", location: "Agra hotel near Taj" },
            { time: "01:00 PM", activity: "Traditional Mughlai lunch", location: "Hotel restaurant" },
            { time: "02:30 PM", activity: "Agra Fort comprehensive tour", location: "Agra Fort (UNESCO)" },
            { time: "05:00 PM", activity: "Mehtab Bagh visit for Taj sunset view", location: "Mehtab Bagh gardens" },
            { time: "07:00 PM", activity: "Local marble handicraft workshop", location: "Traditional artisan center" },
            { time: "08:30 PM", activity: "Mughlai cuisine dinner", location: "Pinch of Spice restaurant" }
          ],
          accommodation: "Heritage hotel with Taj Mahal views",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 4,
          title: "Taj Mahal Sunrise & Journey to Jaipur",
          activities: [
            { time: "05:30 AM", activity: "Taj Mahal sunrise visit (skip-the-line)", location: "Taj Mahal main entrance" },
            { time: "08:00 AM", activity: "Breakfast at hotel after Taj visit", location: "Hotel" },
            { time: "10:00 AM", activity: "Checkout and drive towards Jaipur", location: "En route" },
            { time: "12:00 PM", activity: "Fatehpur Sikri exploration (UNESCO)", location: "Fatehpur Sikri" },
            { time: "02:00 PM", activity: "Lunch at heritage restaurant", location: "Fatehpur Sikri" },
            { time: "03:30 PM", activity: "Continue journey to Jaipur", location: "En route (4 hours)" },
            { time: "07:30 PM", activity: "Arrival and check-in at palace hotel", location: "Heritage palace hotel, Jaipur" },
            { time: "08:30 PM", activity: "Rajasthani welcome dinner with folk dance", location: "Hotel courtyard" }
          ],
          accommodation: "Heritage palace hotel in Jaipur",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 5,
          title: "Jaipur - The Pink City Exploration",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at palace hotel", location: "Hotel" },
            { time: "09:00 AM", activity: "Amber Fort with elephant/jeep ride", location: "Amber Fort" },
            { time: "12:00 PM", activity: "City Palace and museum tour", location: "City Palace complex" },
            { time: "01:30 PM", activity: "Lunch at 1135 AD restaurant", location: "Amber Fort area" },
            { time: "03:00 PM", activity: "Hawa Mahal photo stop and history", location: "Hawa Mahal" },
            { time: "04:00 PM", activity: "Jantar Mantar astronomical observatory", location: "Jantar Mantar" },
            { time: "05:30 PM", activity: "Shopping at Johari Bazaar", location: "Johari Bazaar" },
            { time: "07:00 PM", activity: "Jal Mahal sunset photography", location: "Man Sagar Lake" },
            { time: "08:00 PM", activity: "Rooftop dinner with city view", location: "Local rooftop restaurant" }
          ],
          accommodation: "Heritage palace hotel in Jaipur",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 6,
          title: "Jaipur Hills & Return to Delhi",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at hotel", location: "Hotel" },
            { time: "09:00 AM", activity: "Jaigarh Fort (cannon foundry)", location: "Jaigarh Fort" },
            { time: "11:00 AM", activity: "Nahargarh Fort with panoramic views", location: "Nahargarh Fort" },
            { time: "01:00 PM", activity: "Lunch at hilltop restaurant", location: "Nahargarh area" },
            { time: "02:30 PM", activity: "Drive back to Delhi", location: "En route (5 hours)" },
            { time: "07:30 PM", activity: "Arrival in Delhi, airport hotel check-in", location: "Airport hotel" },
            { time: "08:30 PM", activity: "Farewell dinner at hotel", location: "Hotel restaurant" }
          ],
          accommodation: "Airport hotel in Delhi",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 7,
          title: "Delhi Shopping & Departure",
          activities: [
            { time: "08:00 AM", activity: "Leisure breakfast", location: "Hotel" },
            { time: "09:30 AM", activity: "Visit Albert Hall Museum (if time permits)", location: "Ram Niwas Garden" },
            { time: "11:00 AM", activity: "Last-minute shopping at Karol Bagh", location: "Karol Bagh market" },
            { time: "12:30 PM", activity: "Lunch at Delhi Haat", location: "Delhi Haat" },
            { time: "02:00 PM", activity: "Hotel checkout and airport transfer", location: "To IGI Airport" },
            { time: "04:00 PM", activity: "Airport departure assistance", location: "IGI Airport" }
          ],
          accommodation: "Day use until departure",
          meals: "Breakfast, Lunch"
        }
      ],
      includes: ["Luxury accommodation", "All meals", "Private air-conditioned vehicle", "Professional English-speaking guide", "All monument entry fees", "Airport transfers"],
      excludes: ["International flights", "Indian visa fees", "Travel insurance", "Personal expenses", "Camera fees at monuments", "Tips for guide and driver"]
    },
    {
      id: 2,
      title: "Kerala Backwaters & Hills",
      destination: "Kochi, Munnar & Alleppey",
      duration: "7 Days / 6 Nights",
      price: "₹42,999",
      originalPrice: "₹55,999",
      rating: 4.9,
      reviews: 1856,
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
      description: "Discover God's Own Country with pristine backwaters, lush hill stations, and authentic cultural experiences in Kerala's most beautiful destinations.",
      highlights: [
        "Luxury houseboat stay in Alleppey backwaters",
        "Tea plantation tours with tasting in Munnar",
        "Spice garden visits and cooking classes",
        "Authentic Kathakali dance performance",
        "Ayurvedic spa treatments and wellness",
        "Chinese fishing nets and Fort Kochi heritage",
        "Traditional Kerala cuisine experiences"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Kochi - Colonial Heritage",
          activities: [
            { time: "08:00 AM", activity: "Arrival at Cochin International Airport", location: "Cochin International Airport" },
            { time: "09:00 AM", activity: "Hotel check-in and welcome refreshments", location: "Heritage hotel Fort Kochi" },
            { time: "10:30 AM", activity: "Fort Kochi heritage walking tour", location: "Fort Kochi" },
            { time: "12:00 PM", activity: "Chinese fishing nets demonstration", location: "Fort Kochi beach" },
            { time: "01:00 PM", activity: "Seafood lunch at local restaurant", location: "Fort Kochi" },
            { time: "02:30 PM", activity: "St. Francis Church and Vasco House", location: "Fort Kochi" },
            { time: "04:00 PM", activity: "Jewish Synagogue and Jew Town exploration", location: "Mattancherry" },
            { time: "06:00 PM", activity: "Sunset at Marine Drive", location: "Ernakulam" },
            { time: "08:00 PM", activity: "Traditional Kathakali performance", location: "Kerala Kathakali Centre" }
          ],
          accommodation: "Heritage hotel in Fort Kochi",
          meals: "Lunch, Dinner"
        },
        {
          day: 2,
          title: "Kochi to Munnar - Hill Station Journey",
          activities: [
            { time: "07:00 AM", activity: "Early breakfast at hotel", location: "Hotel" },
            { time: "08:00 AM", activity: "Drive to Munnar through scenic routes", location: "En route (4 hours)" },
            { time: "10:00 AM", activity: "Stop at Cheeyappara Waterfalls", location: "Idukki district" },
            { time: "12:00 PM", activity: "Arrival and check-in at hill resort", location: "Munnar resort" },
            { time: "01:00 PM", activity: "Traditional Kerala lunch", location: "Resort restaurant" },
            { time: "03:00 PM", activity: "Tea Museum and plantation tour", location: "Tata Tea Museum" },
            { time: "05:00 PM", activity: "Tea tasting and processing demonstration", location: "Local tea garden" },
            { time: "07:00 PM", activity: "Evening leisure with mountain views", location: "Resort" },
            { time: "08:00 PM", activity: "Dinner at resort", location: "Resort restaurant" }
          ],
          accommodation: "Hill resort with valley views",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 3,
          title: "Munnar Nature & Wildlife Exploration",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at resort", location: "Resort" },
            { time: "09:00 AM", activity: "Eravikulam National Park (Nilgiri Tahr)", location: "Eravikulam National Park" },
            { time: "11:00 AM", activity: "Mattupetty Dam and Lake", location: "Mattupetty" },
            { time: "12:00 PM", activity: "Echo Point natural phenomenon", location: "Echo Point" },
            { time: "01:00 PM", activity: "Lunch at hilltop restaurant", location: "Munnar town" },
            { time: "03:00 PM", activity: "Top Station (Indo-Tamil Nadu border)", location: "Top Station" },
            { time: "05:00 PM", activity: "Kundala Lake boating", location: "Kundala Dam" },
            { time: "07:00 PM", activity: "Spice plantation visit with guided tour", location: "Local spice garden" },
            { time: "08:30 PM", activity: "Traditional dinner at resort", location: "Resort" }
          ],
          accommodation: "Hill resort with valley views",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 4,
          title: "Munnar to Thekkady - Spice Route",
          activities: [
            { time: "07:00 AM", activity: "Breakfast and checkout", location: "Resort" },
            { time: "08:00 AM", activity: "Drive to Thekkady", location: "En route (3 hours)" },
            { time: "11:00 AM", activity: "Check-in at spice plantation resort", location: "Thekkady resort" },
            { time: "12:00 PM", activity: "Welcome drink and lunch", location: "Resort" },
            { time: "02:00 PM", activity: "Periyar Wildlife Sanctuary boat ride", location: "Periyar Lake" },
            { time: "04:00 PM", activity: "Spice plantation guided tour", location: "Resort plantation" },
            { time: "06:00 PM", activity: "Cooking demonstration with spices", location: "Resort kitchen" },
            { time: "08:00 PM", activity: "Dinner with spice-infused cuisine", location: "Resort restaurant" }
          ],
          accommodation: "Spice plantation resort",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 5,
          title: "Thekkady to Alleppey - Backwater Paradise",
          activities: [
            { time: "07:00 AM", activity: "Breakfast at resort", location: "Resort" },
            { time: "08:00 AM", activity: "Drive to Alleppey", location: "En route (4 hours)" },
            { time: "12:00 PM", activity: "Arrival and houseboat check-in", location: "Alleppey boat jetty" },
            { time: "12:30 PM", activity: "Welcome drink and Kerala lunch", location: "Houseboat" },
            { time: "02:00 PM", activity: "Backwater cruise begins on Vembanad Lake", location: "Vembanad Lake" },
            { time: "04:00 PM", activity: "Village visit and coir making demo", location: "Kumrakom village" },
            { time: "06:00 PM", activity: "Sunset photography from boat deck", location: "Backwaters" },
            { time: "08:00 PM", activity: "Fresh seafood dinner on boat", location: "Houseboat" }
          ],
          accommodation: "Luxury houseboat with AC",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 6,
          title: "Backwater Cruise & Return to Kochi",
          activities: [
            { time: "06:30 AM", activity: "Sunrise viewing from houseboat", location: "Houseboat deck" },
            { time: "08:00 AM", activity: "Breakfast on houseboat", location: "Houseboat" },
            { time: "09:00 AM", activity: "Traditional fishing with local fishermen", location: "Backwaters" },
            { time: "11:00 AM", activity: "Disembark and drive to Kochi", location: "To Kochi (1.5 hours)" },
            { time: "01:00 PM", activity: "Lunch at seaside restaurant", location: "Marine Drive" },
            { time: "03:00 PM", activity: "Mattancherry Palace (Dutch Palace)", location: "Mattancherry" },
            { time: "05:00 PM", activity: "Spice market shopping", location: "Jew Town" },
            { time: "07:00 PM", activity: "Ayurvedic spa treatment", location: "Hotel spa" },
            { time: "08:30 PM", activity: "Farewell dinner at waterfront restaurant", location: "Marine Drive" }
          ],
          accommodation: "Luxury hotel in Kochi",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 7,
          title: "Kochi Shopping & Departure",
          activities: [
            { time: "08:00 AM", activity: "Leisurely breakfast", location: "Hotel" },
            { time: "09:30 AM", activity: "Visit Hill Palace Museum", location: "Tripunithura" },
            { time: "11:30 AM", activity: "Shopping at Lulu Mall", location: "Lulu International Shopping Mall" },
            { time: "01:00 PM", activity: "Lunch at food court", location: "Lulu Mall" },
            { time: "02:30 PM", activity: "Hotel checkout and departure", location: "Hotel" },
            { time: "03:30 PM", activity: "Airport transfer", location: "To Cochin International Airport" },
            { time: "05:00 PM", activity: "Departure assistance", location: "Airport" }
          ],
          accommodation: "Day use until departure",
          meals: "Breakfast, Lunch"
        }
      ],
      includes: ["Luxury accommodation", "Premium houseboat stay", "All meals", "Private transportation", "Professional guide", "All entry fees", "Ayurvedic spa session"],
      excludes: ["International flights", "Indian visa fees", "Travel insurance", "Personal expenses", "Camera fees", "Tips for staff and guides"]
    },
    {
      id: 3,
      title: "Rajasthan Royal Heritage",
      destination: "Jaipur, Jodhpur & Udaipur",
      duration: "7 Days / 6 Nights",
      price: "₹48,999",
      originalPrice: "₹62,999",
      rating: 4.8,
      reviews: 2134,
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      description: "Experience the royal grandeur of Rajasthan with magnificent palaces, majestic forts, desert landscapes, and authentic cultural heritage across three royal cities.",
      highlights: [
        "Stay in heritage palace hotels",
        "Mehrangarh Fort and Blue City exploration",
        "Lake Pichola romantic boat rides",
        "Amber Fort with elephant/jeep experience",
        "Traditional Rajasthani folk performances",
        "Ranakpur Jain Temple architectural marvel",
        "Authentic Rajasthani cuisine experiences"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Jaipur - Pink City Welcome",
          activities: [
            { time: "08:00 AM", activity: "Arrival at Jaipur International Airport", location: "Jaipur Airport" },
            { time: "09:00 AM", activity: "Hotel check-in and welcome refreshments", location: "Heritage palace hotel" },
            { time: "10:30 AM", activity: "Amber Fort exploration with elephant ride", location: "Amber Fort complex" },
            { time: "01:00 PM", activity: "Traditional Rajasthani thali lunch", location: "1135 AD restaurant" },
            { time: "02:30 PM", activity: "City Palace and museum complex", location: "City Palace, Jaipur" },
            { time: "04:00 PM", activity: "Jantar Mantar astronomical observatory", location: "Jantar Mantar" },
            { time: "05:00 PM", activity: "Hawa Mahal photo session", location: "Hawa Mahal" },
            { time: "07:00 PM", activity: "Bazaar exploration and shopping", location: "Johari Bazaar & Bapu Bazaar" },
            { time: "08:00 PM", activity: "Royal dinner with folk dance", location: "Suvarna Mahal, Rambagh Palace" }
          ],
          accommodation: "Heritage palace hotel in Jaipur",
          meals: "Lunch, Dinner"
        },
        {
          day: 2,
          title: "Jaipur to Jodhpur - Royal Highway",
          activities: [
            { time: "07:00 AM", activity: "Breakfast at palace hotel", location: "Hotel" },
            { time: "08:00 AM", activity: "Drive to Jodhpur via royal highway", location: "En route (6 hours with stops)" },
            { time: "10:30 AM", activity: "Coffee break at Ajmer", location: "Ajmer" },
            { time: "02:00 PM", activity: "Arrival and traditional Marwari lunch", location: "Jodhpur" },
            { time: "03:30 PM", activity: "Check-in at heritage haveli", location: "Heritage hotel Jodhpur" },
            { time: "04:00 PM", activity: "Mehrangarh Fort comprehensive tour", location: "Mehrangarh Fort" },
            { time: "06:00 PM", activity: "Sunset views from fort ramparts", location: "Mehrangarh Fort" },
            { time: "07:30 PM", activity: "Blue City walking tour", location: "Old Jodhpur" },
            { time: "08:00 PM", activity: "Dinner at Indique rooftop restaurant", location: "Pal Haveli" }
          ],
          accommodation: "Heritage haveli in Blue City",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 3,
          title: "Jodhpur Desert & Culture Experience",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at haveli", location: "Hotel" },
            { time: "09:00 AM", activity: "Jaswant Thada marble memorial", location: "Jaswant Thada" },
            { time: "10:30 AM", activity: "Clock Tower and Sardar Market", location: "Ghanta Ghar area" },
            { time: "12:00 PM", activity: "Traditional Marwari cooking class", location: "Local family home" },
            { time: "01:30 PM", activity: "Homemade lunch with host family", location: "Local home" },
            { time: "03:00 PM", activity: "Mandore Gardens and cenotaphs", location: "Mandore" },
            { time: "04:30 PM", activity: "Bishnoi village safari", location: "Bishnoi village" },
            { time: "06:00 PM", activity: "Desert sunset at Osian dunes", location: "Osian" },
            { time: "08:00 PM", activity: "Desert camp dinner with folk music", location: "Desert camp" }
          ],
          accommodation: "Heritage haveli in Blue City",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 4,
          title: "Jodhpur to Udaipur via Ranakpur",
          activities: [
            { time: "07:00 AM", activity: "Early breakfast and checkout", location: "Hotel" },
            { time: "08:00 AM", activity: "Drive towards Udaipur", location: "En route (5 hours)" },
            { time: "11:00 AM", activity: "Ranakpur Jain Temple complex visit", location: "Ranakpur" },
            { time: "01:00 PM", activity: "Vegetarian lunch at temple guest house", location: "Ranakpur" },
            { time: "02:30 PM", activity: "Continue journey to Udaipur", location: "En route (2.5 hours)" },
            { time: "05:30 PM", activity: "Arrival and lake palace check-in", location: "Lake palace hotel" },
            { time: "06:30 PM", activity: "Welcome tea with lake views", location: "Hotel terrace" },
            { time: "07:30 PM", activity: "Sunset boat ride on Lake Pichola", location: "Lake Pichola" },
            { time: "08:30 PM", activity: "Romantic dinner at lakeside", location: "Ambrai Restaurant" }
          ],
          accommodation: "Lake palace hotel in Udaipur",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 5,
          title: "Udaipur - City of Lakes & Palaces",
          activities: [
            { time: "08:00 AM", activity: "Breakfast with lake panorama", location: "Hotel" },
            { time: "09:00 AM", activity: "City Palace complex and museum", location: "City Palace Udaipur" },
            { time: "11:30 AM", activity: "Crystal Gallery and vintage cars", location: "City Palace" },
            { time: "01:00 PM", activity: "Royal lunch at palace restaurant", location: "Jharoka Restaurant" },
            { time: "03:00 PM", activity: "Saheliyon Ki Bari (Garden of Maidens)", location: "Saheliyon Ki Bari" },
            { time: "04:30 PM", activity: "Jagdish Temple architecture tour", location: "Jagdish Temple" },
            { time: "06:00 PM", activity: "Traditional puppet show", location: "Bagore Ki Haveli" },
            { time: "07:30 PM", activity: "Evening at leisure or spa", location: "Hotel" },
            { time: "08:30 PM", activity: "Royal dinner at palace hotel", location: "Hotel restaurant" }
          ],
          accommodation: "Lake palace hotel in Udaipur",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 6,
          title: "Udaipur Hills & Temples",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at hotel", location: "Hotel" },
            { time: "09:00 AM", activity: "Eklingji Temple complex visit", location: "Eklingji (22 km)" },
            { time: "10:30 AM", activity: "Nagda Temple ruins exploration", location: "Nagda" },
            { time: "12:00 PM", activity: "Drive back to Udaipur", location: "Return journey" },
            { time: "01:00 PM", activity: "Lunch at heritage restaurant", location: "Upre by 1559 AD" },
            { time: "03:00 PM", activity: "Monsoon Palace (Sajjangarh)", location: "Sajjangarh Palace" },
            { time: "04:30 PM", activity: "Fateh Sagar Lake and Nehru Garden", location: "Fateh Sagar Lake" },
            { time: "06:00 PM", activity: "Sunset at Moti Magri (Pearl Hill)", location: "Moti Magri" },
            { time: "08:00 PM", activity: "Farewell dinner cruise", location: "Lake Pichola" }
          ],
          accommodation: "Lake palace hotel in Udaipur",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 7,
          title: "Udaipur Shopping & Departure",
          activities: [
            { time: "08:00 AM", activity: "Leisurely breakfast", location: "Hotel" },
            { time: "09:30 AM", activity: "Shilpgram craft village visit", location: "Shilpgram" },
            { time: "11:00 AM", activity: "Shopping at Hathi Pol Bazaar", location: "Hathi Pol market" },
            { time: "12:30 PM", activity: "Lunch at rooftop restaurant", location: "Ambrai or Jaiwana Haveli" },
            { time: "02:00 PM", activity: "Hotel checkout and final shopping", location: "Local markets" },
            { time: "03:30 PM", activity: "Transfer to Udaipur Airport", location: "To airport" },
            { time: "04:30 PM", activity: "Departure assistance", location: "Udaipur Airport" }
          ],
          accommodation: "Day use until departure",
          meals: "Breakfast, Lunch"
        }
      ],
      includes: ["Heritage palace accommodation", "All meals", "Private air-conditioned vehicle", "Professional guide", "All entry fees", "Boat rides", "Cultural performances"],
      excludes: ["International flights", "Indian visa fees", "Travel insurance", "Personal expenses", "Camera fees at monuments", "Tips for guide and driver"]
    },
    {
      id: 4,
      title: "Mumbai Metropolitan Experience",
      destination: "Mumbai & Bollywood",
      duration: "7 Days / 6 Nights",
      price: "₹38,999",
      originalPrice: "₹48,999",
      rating: 4.7,
      reviews: 1892,
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
      description: "Immerse yourself in India's financial capital with its bustling markets, Bollywood glamour, heritage architecture, and vibrant street life in this comprehensive Mumbai experience.",
      highlights: [
        "Bollywood Film City studio tour",
        "Gateway of India and Elephanta Caves UNESCO site",
        "Dharavi slum tour with local guide",
        "Crawford Market and Colaba Causeway shopping",
        "Marine Drive and Chowpatty Beach experience",
        "Heritage train ride on local Mumbai trains",
        "Street food crawl in Mohammed Ali Road"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival & South Mumbai Heritage",
          activities: [
            { time: "08:00 AM", activity: "Arrival at Chhatrapati Shivaji International Airport", location: "Mumbai Airport" },
            { time: "09:30 AM", activity: "Hotel check-in and welcome drink", location: "Heritage hotel near Gateway" },
            { time: "11:00 AM", activity: "Gateway of India monument exploration", location: "Gateway of India" },
            { time: "12:30 PM", activity: "Taj Mahal Palace Hotel heritage tour", location: "Taj Hotel" },
            { time: "01:30 PM", activity: "Lunch at Leopold Café (historic)", location: "Colaba" },
            { time: "03:00 PM", activity: "Chhatrapati Shivaji Terminus UNESCO tour", location: "CST Station" },
            { time: "05:00 PM", activity: "Crawford Market spice and textile exploration", location: "Crawford Market" },
            { time: "07:00 PM", activity: "Marine Drive sunset walk", location: "Marine Drive" },
            { time: "08:30 PM", activity: "Welcome dinner with city views", location: "Hotel restaurant" }
          ],
          accommodation: "Heritage hotel in South Mumbai",
          meals: "Lunch, Dinner"
        },
        {
          day: 2,
          title: "Bollywood & Film City Experience",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at hotel", location: "Hotel" },
            { time: "09:00 AM", activity: "Bollywood Film City comprehensive tour", location: "Goregaon Film City" },
            { time: "11:00 AM", activity: "Film set visits and celebrity studio tours", location: "Film City" },
            { time: "01:00 PM", activity: "Bollywood theme lunch", location: "Film City restaurant" },
            { time: "02:30 PM", activity: "Dance workshop with choreographer", location: "Film City" },
            { time: "04:00 PM", activity: "Juhu Beach and celebrity homes tour", location: "Juhu" },
            { time: "06:00 PM", activity: "ISKCON Temple visit", location: "Juhu" },
            { time: "07:30 PM", activity: "Bollywood movie screening", location: "Historic cinema" },
            { time: "09:30 PM", activity: "Dinner at celebrity chef restaurant", location: "Bandra" }
          ],
          accommodation: "Heritage hotel in South Mumbai",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 3,
          title: "Elephanta Caves & Art District",
          activities: [
            { time: "08:00 AM", activity: "Early breakfast", location: "Hotel" },
            { time: "09:00 AM", activity: "Ferry to Elephanta Island", location: "Gateway of India jetty" },
            { time: "10:00 AM", activity: "UNESCO Elephanta Caves exploration", location: "Elephanta Island" },
            { time: "01:00 PM", activity: "Island lunch with sea views", location: "Elephanta Island" },
            { time: "02:30 PM", activity: "Return ferry to Mumbai", location: "Back to Gateway" },
            { time: "04:00 PM", activity: "Kala Ghoda Art District tour", location: "Fort area" },
            { time: "05:30 PM", activity: "Jehangir Art Gallery visit", location: "Kala Ghoda" },
            { time: "07:00 PM", activity: "Prince of Wales Museum", location: "Fort area" },
            { time: "08:30 PM", activity: "Dinner at art café", location: "Kala Ghoda" }
          ],
          accommodation: "Heritage hotel in South Mumbai",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 4,
          title: "Dharavi & Local Life Experience",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at hotel", location: "Hotel" },
            { time: "09:30 AM", activity: "Dharavi slum tour with local guide", location: "Dharavi" },
            { time: "12:00 PM", activity: "Community lunch with families", location: "Dharavi" },
            { time: "02:00 PM", activity: "Local train journey experience", location: "Mumbai local trains" },
            { time: "03:30 PM", activity: "Dhobi Ghat laundry visit", location: "Mahalaxmi" },
            { time: "05:00 PM", activity: "Haji Ali Dargah sunset visit", location: "Haji Ali" },
            { time: "07:00 PM", activity: "Mohammed Ali Road food street tour", location: "Mohammed Ali Road" },
            { time: "08:30 PM", activity: "Street food dinner crawl", location: "Various street stalls" }
          ],
          accommodation: "Heritage hotel in South Mumbai",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 5,
          title: "Markets & Shopping Experience",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at hotel", location: "Hotel" },
            { time: "09:30 AM", activity: "Zaveri Bazaar jewelry market", location: "Fort area" },
            { time: "11:00 AM", activity: "Mangaldas Market fabric shopping", location: "Fort area" },
            { time: "01:00 PM", activity: "Lunch at traditional Parsi café", location: "Fort area" },
            { time: "02:30 PM", activity: "Linking Road Bandra shopping", location: "Bandra West" },
            { time: "04:30 PM", activity: "Bandstand and Bandra Fort", location: "Bandra" },
            { time: "06:00 PM", activity: "Worli Sea Link photography", location: "Worli" },
            { time: "07:30 PM", activity: "Chowpatty Beach chaat experience", location: "Chowpatty" },
            { time: "08:30 PM", activity: "Dinner at sea-facing restaurant", location: "Nariman Point" }
          ],
          accommodation: "Heritage hotel in South Mumbai",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 6,
          title: "Nature & Temples Day",
          activities: [
            { time: "07:00 AM", activity: "Early breakfast", location: "Hotel" },
            { time: "08:00 AM", activity: "Sanjay Gandhi National Park", location: "Borivali" },
            { time: "09:30 AM", activity: "Kanheri Caves Buddhist heritage", location: "National Park" },
            { time: "12:00 PM", activity: "Picnic lunch in nature", location: "National Park" },
            { time: "02:00 PM", activity: "Return to city", location: "Back to South Mumbai" },
            { time: "03:30 PM", activity: "Siddhivinayak Temple visit", location: "Prabhadevi" },
            { time: "05:00 PM", activity: "Mahalaxmi Temple and race course", location: "Mahalaxmi" },
            { time: "07:00 PM", activity: "Hanging Gardens sunset", location: "Malabar Hill" },
            { time: "08:30 PM", activity: "Farewell dinner with cultural show", location: "Hotel" }
          ],
          accommodation: "Heritage hotel in South Mumbai",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 7,
          title: "Last Day Shopping & Departure",
          activities: [
            { time: "08:00 AM", activity: "Leisurely breakfast", location: "Hotel" },
            { time: "09:30 AM", activity: "Palladium Mall luxury shopping", location: "Phoenix Mills" },
            { time: "11:30 AM", activity: "Antique shopping at Chor Bazaar", location: "Chor Bazaar" },
            { time: "01:00 PM", activity: "Lunch at rooftop restaurant", location: "South Mumbai" },
            { time: "02:30 PM", activity: "Hotel checkout and luggage storage", location: "Hotel" },
            { time: "03:00 PM", activity: "Last-minute souvenir shopping", location: "Colaba Causeway" },
            { time: "05:00 PM", activity: "Airport transfer", location: "To Mumbai Airport" }
          ],
          accommodation: "Day use until departure",
          meals: "Breakfast, Lunch"
        }
      ],
      includes: ["4-star heritage accommodation", "All meals", "Private AC vehicle", "Professional English guide", "All entry fees", "Ferry tickets", "Airport transfers", "Cultural shows"],
      excludes: ["International flights", "Indian visa fees", "Travel insurance", "Personal expenses", "Tips for guide and driver", "Shopping expenses"]
    },
    {
      id: 5,
      title: "Goa Beach & Heritage Paradise",
      destination: "North & South Goa",
      duration: "7 Days / 6 Nights",
      price: "₹32,999",
      originalPrice: "₹42,999",
      rating: 4.6,
      reviews: 2341,
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
      description: "Experience the perfect blend of Portuguese heritage, pristine beaches, water sports, spice plantations, and vibrant nightlife in this comprehensive Goa adventure.",
      highlights: [
        "UNESCO Basilica of Bom Jesus and Se Cathedral",
        "Private beach access at luxury resorts",
        "Spice plantation tour with traditional lunch",
        "Dudhsagar Waterfalls jeep safari",
        "Fontainhas Latin Quarter heritage walk",
        "Sunset cruise on Mandovi River",
        "Authentic Goan cuisine and feni tasting"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival & North Goa Beaches",
          activities: [
            { time: "08:00 AM", activity: "Arrival at Goa International Airport", location: "Dabolim Airport" },
            { time: "09:30 AM", activity: "Hotel check-in and welcome cocktail", location: "Beach resort Calangute" },
            { time: "11:00 AM", activity: "Calangute Beach orientation and relaxation", location: "Calangute Beach" },
            { time: "01:00 PM", activity: "Seafood lunch at beach shack", location: "Calangute Beach" },
            { time: "02:30 PM", activity: "Water sports at Baga Beach", location: "Baga Beach" },
            { time: "04:30 PM", activity: "Anjuna Beach and flea market", location: "Anjuna" },
            { time: "06:30 PM", activity: "Sunset at Vagator Beach", location: "Vagator Beach" },
            { time: "08:00 PM", activity: "Welcome dinner with live music", location: "Beach resort" }
          ],
          accommodation: "Beach resort in North Goa",
          meals: "Lunch, Dinner"
        },
        {
          day: 2,
          title: "Old Goa UNESCO Heritage",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at resort", location: "Resort" },
            { time: "09:30 AM", activity: "Basilica of Bom Jesus UNESCO site", location: "Old Goa" },
            { time: "11:00 AM", activity: "Se Cathedral and archaeological museum", location: "Old Goa" },
            { time: "12:30 PM", activity: "Church of St. Francis of Assisi", location: "Old Goa" },
            { time: "01:30 PM", activity: "Traditional Goan lunch", location: "Old Goa restaurant" },
            { time: "03:00 PM", activity: "Fontainhas Latin Quarter walking tour", location: "Panaji" },
            { time: "05:00 PM", activity: "Panaji city and Mandovi riverfront", location: "Panaji" },
            { time: "07:00 PM", activity: "Sunset river cruise with dinner", location: "Mandovi River" },
            { time: "09:00 PM", activity: "Return to resort", location: "Resort" }
          ],
          accommodation: "Beach resort in North Goa",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 3,
          title: "Adventure & Spice Plantation",
          activities: [
            { time: "07:00 AM", activity: "Early breakfast", location: "Resort" },
            { time: "08:00 AM", activity: "Dudhsagar Waterfalls jeep safari", location: "Mollem National Park" },
            { time: "10:00 AM", activity: "Dudhsagar Falls trekking and swimming", location: "Dudhsagar" },
            { time: "01:00 PM", activity: "Spice plantation tour and lunch", location: "Ponda spice plantation" },
            { time: "03:00 PM", activity: "Traditional Goan cooking demonstration", location: "Plantation" },
            { time: "04:30 PM", activity: "Elephant interaction (ethical)", location: "Plantation" },
            { time: "06:00 PM", activity: "Return to resort", location: "Resort" },
            { time: "07:30 PM", activity: "Free evening and beach relaxation", location: "Resort beach" },
            { time: "08:30 PM", activity: "Dinner at resort", location: "Resort restaurant" }
          ],
          accommodation: "Beach resort in North Goa",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 4,
          title: "South Goa Serenity",
          activities: [
            { time: "08:00 AM", activity: "Breakfast and checkout", location: "Resort" },
            { time: "10:00 AM", activity: "Drive to South Goa with stops", location: "En route to South Goa" },
            { time: "11:30 AM", activity: "Margao market and church visit", location: "Margao" },
            { time: "01:00 PM", activity: "Check-in and lunch", location: "South Goa beach resort" },
            { time: "03:00 PM", activity: "Colva Beach relaxation", location: "Colva Beach" },
            { time: "05:00 PM", activity: "Benaulim Beach and fishing village", location: "Benaulim" },
            { time: "07:00 PM", activity: "Sunset at Cabo de Rama Fort", location: "Cabo de Rama" },
            { time: "08:30 PM", activity: "Seafood dinner at beach restaurant", location: "Colva Beach" }
          ],
          accommodation: "Beach resort in South Goa",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 5,
          title: "Palolem & Backwaters",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at resort", location: "Resort" },
            { time: "09:30 AM", activity: "Palolem Beach paradise experience", location: "Palolem Beach" },
            { time: "11:00 AM", activity: "Kayaking in Palolem bay", location: "Palolem" },
            { time: "01:00 PM", activity: "Beach lunch at Palolem", location: "Palolem beach shack" },
            { time: "02:30 PM", activity: "Agonda Beach turtle nesting site", location: "Agonda Beach" },
            { time: "04:00 PM", activity: "Cotigao Wildlife Sanctuary", location: "Cotigao" },
            { time: "06:00 PM", activity: "Chaudi market local experience", location: "Chaudi" },
            { time: "07:30 PM", activity: "Return to resort", location: "Resort" },
            { time: "08:30 PM", activity: "Goan cultural night with live band", location: "Resort" }
          ],
          accommodation: "Beach resort in South Goa",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 6,
          title: "Water Sports & Island Hopping",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at resort", location: "Resort" },
            { time: "09:00 AM", activity: "Grand Island boat trip", location: "Coco Beach jetty" },
            { time: "10:00 AM", activity: "Snorkeling and dolphin watching", location: "Grand Island" },
            { time: "12:00 PM", activity: "BBQ lunch on island", location: "Grand Island" },
            { time: "02:00 PM", activity: "Jet skiing and parasailing", location: "Grand Island waters" },
            { time: "04:00 PM", activity: "Return boat journey", location: "Back to mainland" },
            { time: "06:00 PM", activity: "Miramar Beach and city tour", location: "Panaji" },
            { time: "07:30 PM", activity: "Shopping at 18th June Road", location: "Panaji" },
            { time: "08:30 PM", activity: "Farewell dinner with feni tasting", location: "Heritage restaurant" }
          ],
          accommodation: "Beach resort in South Goa",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 7,
          title: "Departure Day",
          activities: [
            { time: "08:00 AM", activity: "Leisurely breakfast", location: "Resort" },
            { time: "09:30 AM", activity: "Beach relaxation and final swim", location: "Resort beach" },
            { time: "11:00 AM", activity: "Checkout and souvenir shopping", location: "Resort and local shops" },
            { time: "01:00 PM", activity: "Lunch at coastal restaurant", location: "Near airport" },
            { time: "02:30 PM", activity: "Airport transfer", location: "To Dabolim Airport" },
            { time: "04:00 PM", activity: "Departure assistance", location: "Goa Airport" }
          ],
          accommodation: "Day use until departure",
          meals: "Breakfast, Lunch"
        }
      ],
      includes: ["Beach resort accommodation", "All meals", "Private AC vehicle", "Professional guide", "All entry fees", "Boat trips", "Water sports", "Airport transfers"],
      excludes: ["International flights", "Indian visa fees", "Travel insurance", "Personal expenses", "Alcoholic beverages", "Tips for guide and driver"]
    },
    {
      id: 6,
      title: "Udaipur Royal Lakes Experience",
      destination: "Udaipur - City of Lakes",
      duration: "5 Days / 4 Nights",
      price: "₹28,999",
      originalPrice: "₹36,999",
      rating: 4.8,
      reviews: 1654,
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
      description: "Experience the romance and grandeur of Udaipur with its pristine lakes, magnificent palaces, and rich cultural heritage in the Venice of the East.",
      highlights: [
        "Lake Palace boat ride on Lake Pichola",
        "City Palace museum complex exploration",
        "Jag Mandir island palace visit",
        "Saheliyon Ki Bari royal gardens",
        "Monsoon Palace sunset views",
        "Traditional puppet show at Bagore Ki Haveli",
        "Heritage walk through old city"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival & Lake Pichola Discovery",
          activities: [
            { time: "10:00 AM", activity: "Arrival at Udaipur Airport/Railway Station", location: "Maharana Pratap Airport" },
            { time: "11:00 AM", activity: "Hotel check-in and welcome refreshments", location: "Heritage hotel with lake view" },
            { time: "12:30 PM", activity: "Traditional Rajasthani lunch", location: "Hotel restaurant" },
            { time: "02:00 PM", activity: "Rest and relaxation", location: "Hotel" },
            { time: "04:00 PM", activity: "Lake Pichola boat ride", location: "City Palace jetty" },
            { time: "05:30 PM", activity: "Jag Mandir island palace visit", location: "Jag Mandir Island" },
            { time: "07:00 PM", activity: "Sunset photography at Lake Palace view", location: "Lake Pichola" },
            { time: "08:30 PM", activity: "Welcome dinner at lakeside restaurant", location: "Ambrai Restaurant" }
          ],
          accommodation: "Heritage hotel with lake views",
          meals: "Lunch, Dinner"
        },
        {
          day: 2,
          title: "City Palace & Royal Heritage",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at hotel", location: "Hotel" },
            { time: "09:30 AM", activity: "City Palace complex guided tour", location: "City Palace Museum" },
            { time: "11:30 AM", activity: "Crystal Gallery and vintage car collection", location: "City Palace" },
            { time: "01:00 PM", activity: "Lunch at palace restaurant", location: "Jharoka Restaurant" },
            { time: "02:30 PM", activity: "Jagdish Temple visit", location: "Jagdish Temple" },
            { time: "04:00 PM", activity: "Saheliyon Ki Bari (Garden of Maidens)", location: "Saheliyon Ki Bari" },
            { time: "05:30 PM", activity: "Local handicraft shopping", location: "Hathi Pol Bazaar" },
            { time: "07:30 PM", activity: "Traditional puppet show", location: "Bagore Ki Haveli" },
            { time: "08:30 PM", activity: "Dinner at heritage restaurant", location: "Upre by 1559 AD" }
          ],
          accommodation: "Heritage hotel with lake views",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 3,
          title: "Fateh Sagar & Monsoon Palace",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at hotel", location: "Hotel" },
            { time: "09:30 AM", activity: "Fateh Sagar Lake boat ride", location: "Fateh Sagar Lake" },
            { time: "11:00 AM", activity: "Nehru Garden island visit", location: "Nehru Garden" },
            { time: "12:30 PM", activity: "Vintage car museum visit", location: "Garden Hotel" },
            { time: "01:30 PM", activity: "Lunch at lakeside café", location: "Fateh Sagar area" },
            { time: "03:00 PM", activity: "Shilpgram craft village tour", location: "Shilpgram" },
            { time: "05:00 PM", activity: "Monsoon Palace (Sajjangarh)", location: "Sajjangarh Palace" },
            { time: "06:30 PM", activity: "Sunset views over Udaipur", location: "Monsoon Palace" },
            { time: "08:00 PM", activity: "Royal dinner at palace hotel", location: "Hotel restaurant" }
          ],
          accommodation: "Heritage hotel with lake views",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 4,
          title: "Cultural Immersion & Local Life",
          activities: [
            { time: "08:00 AM", activity: "Breakfast at hotel", location: "Hotel" },
            { time: "09:30 AM", activity: "Cooking class - Rajasthani cuisine", location: "Local family home" },
            { time: "12:00 PM", activity: "Lunch with host family", location: "Local home" },
            { time: "02:00 PM", activity: "Old city heritage walk", location: "Old Udaipur streets" },
            { time: "03:30 PM", activity: "Local artisan workshops visit", location: "Miniature painting studios" },
            { time: "05:00 PM", activity: "Eklingji and Nagda temples", location: "Eklingji (22 km from city)" },
            { time: "07:00 PM", activity: "Return to city", location: "Back to Udaipur" },
            { time: "08:00 PM", activity: "Cultural evening with folk dance", location: "Hotel courtyard" },
            { time: "09:00 PM", activity: "Farewell dinner", location: "Rooftop restaurant" }
          ],
          accommodation: "Heritage hotel with lake views",
          meals: "Breakfast, Lunch, Dinner"
        },
        {
          day: 5,
          title: "Departure Day",
          activities: [
            { time: "08:00 AM", activity: "Leisurely breakfast", location: "Hotel" },
            { time: "09:30 AM", activity: "Last-minute shopping", location: "Bada Bazaar" },
            { time: "11:00 AM", activity: "Hotel checkout", location: "Hotel" },
            { time: "12:00 PM", activity: "Lunch at city restaurant", location: "Tribute Restaurant" },
            { time: "01:30 PM", activity: "Transfer to airport/railway station", location: "To departure point" },
            { time: "03:00 PM", activity: "Departure assistance", location: "Airport/Station" }
          ],
          accommodation: "Day use until departure",
          meals: "Breakfast, Lunch"
        }
      ],
      includes: ["Heritage hotel accommodation", "All meals", "Private AC vehicle", "Professional guide", "All entry fees", "Boat rides", "Cultural shows", "Airport/station transfers"],
      excludes: ["Domestic flights/trains to Udaipur", "Travel insurance", "Personal expenses", "Camera fees at monuments", "Tips for guide and driver", "Shopping expenses"]
    }
  ]

  // Activity data with detailed information
  const activities = [
    {
      id: 1,
      title: "Mumbai Heritage & Bollywood Full Day Tour",
      location: "Mumbai",
      price: "₹2,200",
      rating: 4.6,
      reviews: 2847,
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      description: "Comprehensive Mumbai city tour covering UNESCO heritage sites, colonial architecture, bustling markets, iconic landmarks, and Bollywood studio experience with local insights.",
      highlights: [
        "Gateway of India & Taj Mahal Palace heritage walk",
        "Chhatrapati Shivaji Terminus (UNESCO World Heritage)",
        "Crawford Market & Colaba Causeway shopping",
        "Marine Drive 'Queen's Necklace' promenade",
        "Dharavi slum community tour (optional)",
        "Bollywood Film City studio visit",
        "Local street food tasting at Mohammed Ali Road"
      ],
      duration: "8 hours",
      groupSize: "Up to 15 people",
      includes: ["Professional English guide", "Air-conditioned transport", "Entry fees to monuments", "Bollywood studio tour", "Street food tasting", "Bottled water", "Hotel pickup/drop"]
    },
    {
      id: 2,
      title: "Goa Beach Paradise & Portuguese Heritage Tour",
      location: "Goa",
      price: "₹2,800",
      rating: 4.8,
      reviews: 1923,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      description: "Experience the best of Goa with pristine beaches, water sports, UNESCO World Heritage churches, spice plantation tour, and authentic Goan cuisine tasting.",
      highlights: [
        "Calangute & Baga Beach water sports experience",
        "Basilica of Bom Jesus (UNESCO World Heritage)",
        "Se Cathedral & Old Goa Portuguese architecture",
        "Spice plantation tour with traditional lunch",
        "Fontainhas Latin Quarter heritage walk",
        "Mandovi River sunset cruise",
        "Authentic Goan fish curry & feni tasting"
      ],
      duration: "10 hours",
      groupSize: "Up to 12 people", 
      includes: ["Air-conditioned transport", "Professional guide", "Church entry fees", "Spice plantation tour", "Traditional Goan lunch", "River cruise", "Water sports equipment", "Hotel pickup/drop"]
    },
    {
      id: 3,
      title: "Manali Adventure & Solang Valley Expedition",
      location: "Manali",
      price: "₹3,200",
      rating: 4.7,
      reviews: 1456,
      image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      description: "Adventure-packed full day exploring Manali's natural beauty with paragliding in Solang Valley, cable car rides, and visits to ancient temples amidst stunning Himalayan landscapes.",
      highlights: [
        "Paragliding in Solang Valley (20 minutes)",
        "Ropeway cable car to snow point",
        "Snow activities (skiing/snowboarding in season)",
        "Hadimba Devi Temple ancient architecture",
        "Manu Temple visit",
        "Old Manali exploration",
        "Apple orchard visits (seasonal)"
      ],
      duration: "8 hours",
      groupSize: "Up to 8 people",
      includes: ["Paragliding with certified pilot", "Cable car tickets", "Adventure equipment", "Temple entry fees", "Local transport", "Mountain lunch", "Professional guide", "Safety equipment"]
    },
    {
      id: 4,
      title: "Rishikesh White Water Rafting & Yoga Experience",
      location: "Rishikesh",
      price: "₹1,800",
      rating: 4.9,
      reviews: 3241,
      image: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      description: "Experience the ultimate spiritual and adventure combination with thrilling white water rafting on the holy Ganges River followed by a sunset yoga session and evening Ganga Aarti ceremony.",
      highlights: [
        "Grade II-III white water rapids (16 km stretch)",
        "Professional safety briefing and equipment",
        "Cliff jumping opportunities (optional)",
        "Riverside traditional lunch",
        "Evening yoga session by Ganges",
        "Ganga Aarti ceremony viewing",
        "Beatles Ashram exploration"
      ],
      duration: "5 hours",
      groupSize: "Up to 6 people per raft",
      includes: ["Certified rafting guide", "Complete safety equipment", "Life jackets and helmets", "Riverside lunch", "Yoga session", "Transport", "First aid support", "Waterproof bags"]
    }
  ]

  const [selectedDestination, setSelectedDestination] = useState({
    name: 'Santorini, Greece',
    description: 'Mediterranean Paradise',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80',
    rating: '4.9',
    reviews: '3.2k'
  })

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Destinations data
  const destinations = [
    {
      name: 'Santorini, Greece',
      description: 'Mediterranean Paradise',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80',
      rating: '4.9',
      reviews: '3.2k',
      query: 'Santorini, Greece'
    },
    {
      name: 'Tokyo, Japan',
      description: 'Modern Metropolis',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1194&q=80',
      rating: '4.8',
      reviews: '5.1k',
      query: 'Tokyo, Japan'
    },
    {
      name: 'Paris, France',
      description: 'City of Lights',
      image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      rating: '4.7',
      reviews: '4.8k',
      query: 'Paris, France'
    },
    {
      name: 'Bali, Indonesia',
      description: 'Tropical Paradise',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: '4.6',
      reviews: '2.9k',
      query: 'Bali, Indonesia'
    },
    {
      name: 'Rome, Italy',
      description: 'Eternal City',
      image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: '4.5',
      reviews: '3.7k',
      query: 'Rome, Italy'
    }
  ]

  const handleDestinationSelect = (destination: typeof destinations[0]) => {
    setSelectedDestination(destination)
    setSearchQuery(destination.query)
  }

  const scrollLeft = () => {
    const container = document.getElementById('destinations-scroll')
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    const container = document.getElementById('destinations-scroll')
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white relative">
             {/* Sky Blue Gradient Background - Starting from Top of Header */}
       <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-sky-300/60 via-sky-200/35 to-transparent w-full pointer-events-none z-10" 
            style={{ height: '50vh' }}>
       </div>
      
      <Header />
      
      {/* Main Content */}
      <main className="pt-4 relative overflow-hidden z-10">
        {/* Interactive Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Airplane Elements - Travel Theme */}
          <div className="absolute top-32 right-32 transform rotate-12">
            <div className="relative">
              <Plane className="w-16 h-16 text-sky-400/60" strokeWidth={2} />
              {/* Vapor trail */}
              <div className="absolute top-1/2 left-0 w-20 h-1 bg-gradient-to-r from-sky-300/40 to-transparent transform -translate-y-1/2 -translate-x-full"></div>
            </div>
          </div>
          
          <div className="absolute top-64 left-20 transform -rotate-6">
            <div className="relative">
              <Plane className="w-12 h-12 text-cyan-400/50" strokeWidth={2} />
              {/* Vapor trail */}
              <div className="absolute top-1/2 left-0 w-16 h-0.5 bg-gradient-to-r from-cyan-300/30 to-transparent transform -translate-y-1/2 -translate-x-full"></div>
            </div>
          </div>
          
          <div className="absolute bottom-48 right-20 transform rotate-45">
            <div className="relative">
              <Plane className="w-10 h-10 text-blue-400/40" strokeWidth={2} />
              {/* Vapor trail */}
              <div className="absolute top-1/2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-300/25 to-transparent transform -translate-y-1/2 -translate-x-full"></div>
            </div>
          </div>
          
          {/* Parallax Particles */}
          <div 
            className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl animate-pulse transform transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) translateY(${scrollY * 0.1}px)`
            }}
          ></div>
          <div 
            className="absolute top-40 right-20 w-20 h-20 bg-violet-300/30 rounded-full blur-2xl animate-bounce transform transition-transform duration-700 ease-out" 
            style={{
              animationDuration: '3s',
              transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px) translateY(${scrollY * 0.05}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-40 left-1/4 w-24 h-24 bg-indigo-200/25 rounded-full blur-2xl animate-pulse transform transition-transform duration-800 ease-out" 
            style={{
              animationDelay: '1s',
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px) translateY(${scrollY * 0.08}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-20 right-1/3 w-16 h-16 bg-pink-200/30 rounded-full blur-xl animate-bounce transform transition-transform duration-900 ease-out" 
            style={{
              animationDuration: '4s', 
              animationDelay: '2s',
              transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * 0.01}px) translateY(${scrollY * 0.06}px)`
            }}
          ></div>
          
          {/* Additional Interactive Particles */}
          <div 
            className="absolute top-1/3 right-1/4 w-6 h-6 bg-gradient-to-r from-yellow-400/40 to-orange-400/40 rounded-full blur-sm animate-pulse transform transition-all duration-500"
            style={{
              transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * -0.02}px) rotate(${scrollY * 0.1}deg)`
            }}
          ></div>
          <div 
            className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-sm animate-bounce transform transition-all duration-600"
            style={{
              animationDuration: '2.5s',
              transform: `translate(${mousePosition.x * -0.025}px, ${mousePosition.y * 0.025}px) scale(${1 + scrollY * 0.0001})`
            }}
          ></div>
        </div>
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 xl:px-16 relative z-10">
      {/* Hero Section */}
          <div className="flex items-start justify-between min-h-[600px] py-8">
            {/* Left Content */}
            <div className="flex-1 max-w-[600px] pr-20 pt-8">
              {/* Main Heading with Gradient and Airplane */}
              <div className="relative">
                {/* Decorative Airplane */}
                <div className="absolute -top-8 -right-16 transform rotate-12">
                  <div className="relative">
                    <Plane className="w-20 h-20 text-sky-500/40" strokeWidth={2} />
                    {/* Vapor trail */}
                    <div className="absolute top-1/2 left-0 w-24 h-1 bg-gradient-to-r from-sky-400/30 to-transparent transform -translate-y-1/2 -translate-x-full"></div>
                  </div>
                </div>
                
                <h1 className="text-[4.5rem] leading-[1.1] font-bold mb-6 tracking-tight bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in">
                  Discover Your<br />
                  <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    Perfect Travel Experience
                  </span>
                </h1>
              </div>
          
              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-[420px] font-normal">
                Explore curated destinations, authentic experiences, and hidden gems. Plan your perfect trip with AI-powered recommendations.
              </p>
              

              
              {/* Interactive Search Bar with Autocomplete */}
              <div className="relative mb-8 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSearchSuggestions(e.target.value.length > 0)
                    }}
                    onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                    placeholder="Where would you like to go? (e.g., Paris, Tokyo, Bali)"
                    className="w-full px-5 py-4 pr-14 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 text-base bg-white/95 backdrop-blur-sm shadow-sky-lg hover:shadow-sky-xl transition-all duration-300"
                  />
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white p-2.5 rounded-xl transition-all duration-300 shadow-sky-lg hover:shadow-sky-xl hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </button>
                  
                  {/* Search Suggestions Dropdown */}
                  {showSearchSuggestions && (
                    <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-sky-2xl border border-gray-100 z-50 overflow-hidden animate-slide-down">
                      <div className="p-4">
                        <div className="text-sm font-medium text-gray-500 mb-3">Popular Destinations</div>
                        <div className="space-y-2">
                          {['Paris, France', 'Tokyo, Japan', 'Bali, Indonesia', 'Rome, Italy', 'Santorini, Greece'].filter(dest => 
                            dest.toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((destination, index) => (
                            <button
                              key={destination}
                              onClick={() => {
                                setSearchQuery(destination)
                                setShowSearchSuggestions(false)
                                setIsModalOpen(true)
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-3 group"
                            >
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                              </div>
                              <span className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">{destination}</span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <button 
                            onClick={() => {
                              setIsModalOpen(true)
                              setShowSearchSuggestions(false)
                            }}
                            className="w-full text-center py-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                          >
                            Start Planning Your Trip →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Interactive Popular Tags */}
              <div className="mb-8">
                <span className="text-sm text-gray-500 font-medium mr-4">Popular:</span>
                <div className="inline-flex flex-wrap gap-2">
                  {['Paris', 'Tokyo', 'Bali', 'Rome', 'Santorini', 'Iceland'].map((tag, index) => (
                    <button 
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag)
                        setIsModalOpen(true)
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-sm border border-transparent hover:border-gray-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {tag.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Content - Enhanced Visual Gallery */}
            <div className="flex-1 relative max-w-[900px] pl-8">
              {/* Main Hero Image */}
              <div className="relative rounded-[2rem] h-[480px] overflow-hidden border border-gray-100 shadow-sky-2xl group">
                <img 
                  src={selectedDestination.image}
                  alt={`Beautiful ${selectedDestination.name} landscape`}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                  style={{
                    filter: 'brightness(1.05) contrast(1.02)',
                  }}
                />
                
                {/* Overlay with location info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                
                {/* Location badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-sky-lg transform transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{selectedDestination.name}</div>
                      <div className="text-sm text-gray-600">{selectedDestination.description}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{selectedDestination.rating}</span>
                      <span className="text-xs text-gray-500">({selectedDestination.reviews} reviews)</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSearchQuery(selectedDestination.name)
                        setIsModalOpen(true)
                      }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Explore
                    </button>
                  </div>
                </div>
                
                {/* Top right badge */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm animate-bounce-in">
                  <div className="text-xs text-blue-600 font-medium">🏆 Most Popular</div>
                </div>
              </div>
              
              {/* Mini Gallery Below Main Image */}
              <div className="mt-6 flex justify-center space-x-4">
                {/* Santorini thumbnail */}
                <div 
                  className={`w-24 h-24 rounded-2xl overflow-hidden shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-slide-in-right relative ${
                    selectedDestination.name === destinations[0].name ? 'ring-4 ring-blue-500 ring-opacity-60' : ''
                  }`}
                  style={{ animationDelay: '0.1s' }}
                  onMouseEnter={() => handleDestinationSelect(destinations[0])}
                  onClick={() => {
                    handleDestinationSelect(destinations[0])
                    setIsModalOpen(true)
                  }}
                >
                  <img 
                    src={destinations[0].image}
                    alt={`${destinations[0].name} landscape`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-1 left-2 text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity duration-300">
                    {destinations[0].name.split(',')[0]}
                  </div>
                  
                  {/* Active indicator */}
                  {selectedDestination.name === destinations[0].name && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                {destinations.slice(1).map((destination, index) => (
                  <div 
                    key={destination.name}
                    className={`w-24 h-24 rounded-2xl overflow-hidden shadow-sky-xl cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-sky-2xl animate-slide-in-right relative ${
                      selectedDestination.name === destination.name ? 'ring-4 ring-blue-500 ring-opacity-60' : ''
                    }`}
                    style={{ animationDelay: `${(index + 1) * 0.2}s` }}
                    onMouseEnter={() => handleDestinationSelect(destination)}
                    onClick={() => {
                      handleDestinationSelect(destination)
                      setIsModalOpen(true)
                    }}
                  >
                    <img 
                      src={destination.image}
                      alt={`${destination.name} landscape`}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-1 left-2 text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity duration-300">
                      {destination.name.split(',')[0]}
                    </div>
                    
                    {/* Active indicator */}
                    {selectedDestination.name === destination.name && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-1/3 -left-6 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 -right-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          
          {/* Content Grid Section */}
          <div className="py-8 border-t border-gray-100">
                        {/* Category Navigation */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-8 overflow-x-auto">
                <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-3 whitespace-nowrap">Popular</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Europe</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Asia</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Adventure</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Beach</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Culture</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Food & Wine</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Luxury</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Budget</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Solo Travel</button>
              </div>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
                <span>Filters</span>
              </button>
            </div>
        
                        {/* Interactive Destination Horizontal Scroll */}
            <div className="relative mb-12">
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl border border-gray-200 rounded-full p-3 transition-all duration-300 group"
                style={{ marginLeft: '-20px' }}
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl border border-gray-200 rounded-full p-3 transition-all duration-300 group"
                style={{ marginRight: '-20px' }}
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>

              <div 
                id="destinations-scroll"
                className="overflow-x-auto scrollbar-hide" 
                style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  scrollBehavior: 'smooth'
                }}
              >
                <div className="flex space-x-6 pb-4 px-4" style={{ width: 'fit-content', minWidth: '100%' }}>
              {/* Enhanced Travel destination cards with real images - Now Clickable for 7-Day Packages */}
              {[
                { 
                  name: 'Delhi', 
                  country: 'Golden Triangle', 
                  rating: '4.8', 
                  image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-blue-50/50 to-purple-50/50',
                  packageId: 1
                },
                { 
                  name: 'Kochi', 
                  country: 'Kerala Backwaters', 
                  rating: '4.9', 
                  image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-green-50/50 to-teal-50/50',
                  packageId: 2
                },
                { 
                  name: 'Jaipur', 
                  country: 'Rajasthan Royal', 
                  rating: '4.8', 
                  image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-orange-50/50 to-red-50/50',
                  packageId: 3
                },
                { 
                  name: 'Goa', 
                  country: 'Beach Paradise', 
                  rating: '4.6', 
                  image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-yellow-50/50 to-orange-50/50',
                  packageId: 4
                },
                { 
                  name: 'Leh', 
                  country: 'Ladakh Adventure', 
                  rating: '4.9', 
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-blue-50/50 to-cyan-50/50',
                  packageId: 5
                },
                { 
                  name: 'Shimla', 
                  country: 'Himachal Hills', 
                  rating: '4.5', 
                  image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-green-50/50 to-teal-50/50',
                  packageId: 6
                }
              ].map((destination, index) => (
                <div 
                  key={destination.name}
                  onMouseEnter={() => setHoveredCard(destination.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => {
                    const selectedPackage = destinationPackages.find(pkg => pkg.id === destination.packageId)
                    if (selectedPackage) {
                      setSelectedDestinationPackage(selectedPackage)
                    }
                  }}
                  className={`w-72 h-96 bg-white rounded-2xl shadow-sky-lg border border-gray-100 overflow-hidden cursor-pointer transform transition-all duration-500 group perspective-1000 flex-shrink-0 ${
                    hoveredCard === destination.name 
                      ? 'shadow-sky-2xl -translate-y-3 scale-105 rotate-x-2 rotate-y-2' 
                      : 'hover:shadow-sky-xl hover:-translate-y-2 hover:scale-102'
                  }`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="h-4/5 relative overflow-hidden">
                    <img 
                      src={destination.image}
                      alt={`${destination.name}, ${destination.country}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Location overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 mx-auto mb-1 opacity-90 drop-shadow-lg text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <div className="text-xs font-semibold tracking-wide text-white drop-shadow-lg">{destination.name.toUpperCase()}</div>
                      </div>
                    </div>
                    
                    {/* Interactive shine effect */}
                    {hoveredCard === destination.name && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 -translate-x-full animate-shine"></div>
                    )}
                  </div>
                  <div className={`h-1/5 p-4 flex items-center justify-between bg-gradient-to-r from-white ${destination.hoverGradient} transition-all duration-500`}>
                    <div className="text-lg font-medium text-gray-900 group-hover:text-purple-700 transition-colors">{destination.name}, {destination.country}</div>
                    <div className="text-xs text-yellow-500 font-medium">⭐ {destination.rating}</div>
                  </div>
                </div>
              ))}
                </div>
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="flex justify-center items-center space-x-2 mb-8">
              <span className="text-sm text-gray-500">Scroll horizontally to explore more destinations</span>
              <svg className="w-4 h-4 text-gray-400 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
              </svg>
            </div>

            {/* Rating and Travelers */}
            <div className="flex items-center justify-center space-x-12 pt-8">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-gray-900 font-semibold text-lg">4.8/5</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4C18.2 4 20 5.8 20 8C20 10.2 18.2 12 16 12C13.8 12 12 10.2 12 8C12 5.8 13.8 4 16 4ZM16 14C18.7 14 22 15.3 22 16V18H10V16C10 15.3 13.3 14 16 14ZM8 4C10.2 4 12 5.8 12 8C12 10.2 10.2 12 8 12C5.8 12 4 10.2 4 8C4 5.8 5.8 4 8 4ZM8 14C10.7 14 14 15.3 14 16V18H2V16C2 15.3 5.3 14 8 14Z"/>
                </svg>
                <span className="text-gray-900 font-semibold text-lg">50k+ Travelers</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Horizontal Scrollable Banners Section */}
      <div className="relative mb-16 mx-6 lg:mx-8 xl:mx-16">
        {/* Navigation Arrows */}
        <button
          onClick={() => {
            const container = document.getElementById('banners-scroll')
            if (container) container.scrollBy({ left: -400, behavior: 'smooth' })
          }}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sky-xl hover:shadow-sky-2xl border border-gray-200 rounded-full p-4 transition-all duration-300 group"
          style={{ marginLeft: '-20px' }}
        >
          <svg className="w-6 h-6 text-gray-600 group-hover:text-sky-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        <button
          onClick={() => {
            const container = document.getElementById('banners-scroll')
            if (container) container.scrollBy({ left: 400, behavior: 'smooth' })
          }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sky-xl hover:shadow-sky-2xl border border-gray-200 rounded-full p-4 transition-all duration-300 group"
          style={{ marginRight: '-20px' }}
        >
          <svg className="w-6 h-6 text-gray-600 group-hover:text-sky-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>

        {/* Horizontal Scroll Container */}
        <div 
          id="banners-scroll"
          className="overflow-x-auto scrollbar-hide pb-4" 
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth'
          }}
        >
          <div className="flex space-x-6" style={{ width: 'fit-content', minWidth: '100%' }}>
            
            {/* Banner 1 - VenuePlus Travel */}
            <div className="relative bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100 rounded-3xl overflow-hidden border border-white/20 backdrop-blur-sm flex-shrink-0" style={{ width: '800px', height: '400px' }}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-200/20 to-transparent animate-pulse"></div>
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-300/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }}></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative flex items-center justify-between px-6 py-8 h-full">
          
          {/* Left Content - Enhanced */}
          <div className="flex-1 max-w-xs relative z-10">
            <div className="mb-3">
              <div className="inline-flex items-center bg-gradient-to-r from-sky-500/10 to-cyan-500/10 backdrop-blur-sm border border-sky-200/50 rounded-full px-3 py-1.5">
                <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">✈️ Travel Agency</span>
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-sky-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent mb-3 leading-tight">
              VenuePlus
            </h1>
            
            <p className="text-sky-600/80 text-base mb-6 font-medium">
              www.venueplus.travel
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sky-xl transform transition-all duration-300 hover:scale-105 hover:shadow-sky-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <span>Book Your Adventure</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7l5 5-5 5M6 12h12"/>
                </svg>
              </span>
            </button>
          </div>
          
          {/* Right Illustration - Enhanced with Animations */}
          <div className="flex-1 relative max-w-lg">
            {/* Enhanced Background decorative elements */}
            <div className="absolute inset-0">
              {/* Animated Clouds */}
              <div className="absolute top-8 left-12 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}>
                <div className="w-20 h-10 bg-white/90 rounded-full shadow-lg backdrop-blur-sm"></div>
                <div className="w-14 h-7 bg-white/70 rounded-full -mt-4 ml-3 shadow-md"></div>
              </div>
              <div className="absolute top-16 right-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <div className="w-16 h-8 bg-white/80 rounded-full shadow-lg"></div>
                <div className="w-10 h-5 bg-white/60 rounded-full -mt-3 ml-2 shadow-md"></div>
              </div>
              
              {/* Animated dotted travel path */}
              <div className="absolute top-1/2 left-8 right-8">
                <div className="border-t-3 border-dashed border-sky-400/60 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-3 h-3 bg-sky-400 rounded-full animate-ping"></div>
                <div className="absolute top-0 right-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
              
              {/* Animated plus signs */}
              <div className="absolute top-20 left-20 text-sky-400 text-2xl font-bold animate-spin" style={{ animationDuration: '8s' }}>+</div>
              <div className="absolute bottom-24 right-16 text-cyan-400 text-2xl font-bold animate-spin" style={{ animationDuration: '6s', animationDelay: '2s' }}>+</div>
              <div className="absolute top-32 right-8 text-blue-400 text-xl font-bold animate-bounce">+</div>
              
              {/* Animated circles */}
              <div className="absolute top-12 right-12 w-4 h-4 border-3 border-sky-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-20 left-8 w-5 h-5 border-3 border-cyan-400 rounded-full animate-bounce"></div>
              <div className="absolute top-28 left-4 w-3 h-3 border-2 border-blue-400 rounded-full animate-ping"></div>
            </div>
            
            {/* Enhanced Main illustration elements */}
            <div className="relative z-10 flex items-center justify-center h-full">
              
              {/* Enhanced Compass with animation */}
              <div className="absolute top-16 left-16 transform hover:scale-110 transition-transform duration-300 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-red-500 relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-red-600 rounded-t-full"></div>
                </div>
              </div>
              
              {/* Enhanced Globe/Earth with rotation */}
              <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 via-blue-500 to-cyan-500 rounded-full shadow-2xl relative transform hover:scale-110 transition-transform duration-300 animate-pulse">
                <div className="absolute inset-3 bg-gradient-to-br from-emerald-300 to-emerald-600 rounded-full shadow-inner">
                  <div className="absolute top-3 left-3 w-5 h-7 bg-emerald-700 rounded-full shadow-sm"></div>
                  <div className="absolute bottom-3 right-3 w-7 h-5 bg-emerald-700 rounded-full shadow-sm"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-800 rounded-full"></div>
                </div>
              </div>
              
              {/* Enhanced Luggage stack with hover effects */}
              <div className="absolute bottom-8 right-8 transform hover:scale-105 transition-transform duration-300">
                {/* Brown suitcase */}
                <div className="w-18 h-14 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl shadow-2xl relative mb-3 hover:shadow-3xl transition-shadow duration-300">
                  <div className="absolute top-2 left-2 right-2 h-3 bg-amber-900 rounded shadow-inner"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-2 bg-yellow-500 rounded shadow-sm"></div>
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-amber-900 rounded-r-lg"></div>
                </div>
                
                {/* Navy blue bag */}
                <div className="w-16 h-18 bg-gradient-to-br from-blue-800 to-blue-950 rounded-xl shadow-2xl relative hover:shadow-3xl transition-shadow duration-300">
                  <div className="absolute top-3 left-3 right-3 h-10 bg-blue-950 rounded shadow-inner"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-black rounded-t-xl shadow-lg"></div>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gray-600 rounded"></div>
                </div>
              </div>
              
              {/* Enhanced Beach umbrella with animation */}
              <div className="absolute top-8 right-4 transform hover:scale-110 transition-transform duration-300 animate-sway">
                <div className="w-10 h-20 relative">
                  {/* Umbrella top */}
                  <div className="w-20 h-10 bg-gradient-to-r from-red-500 via-orange-400 to-red-500 rounded-full shadow-2xl transform -rotate-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-white/40 to-red-400 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent rounded-full"></div>
                  </div>
                  {/* Umbrella pole */}
                  <div className="w-2 h-14 bg-gradient-to-b from-gray-500 to-gray-700 absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded shadow-lg"></div>
                </div>
              </div>
              
              {/* Enhanced Airplane with flight animation */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 hover:scale-110 transition-transform duration-300 animate-fly">
                <div className="w-14 h-10 bg-gradient-to-br from-red-500 to-red-600 transform rotate-45 relative rounded shadow-2xl">
                  <div className="absolute inset-2 bg-red-400 rounded shadow-inner"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-3 bg-red-700 transform -rotate-45 rounded shadow-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-3 bg-red-700 transform -rotate-45 rounded shadow-lg"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
            </div>

            {/* Banner 2 - Adventure Tours */}
            <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-3xl overflow-hidden border border-white/20 backdrop-blur-sm flex-shrink-0 group hover:scale-[1.02] transition-all duration-500" style={{ width: '800px', height: '400px' }}>
              {/* Enhanced Animated background pattern */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-200/30 to-transparent animate-pulse"></div>
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s' }}></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-300/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-green-200/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
                {/* Floating particles */}
                <div className="absolute top-8 left-8 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-16 right-12 w-3 h-3 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
                <div className="absolute bottom-12 left-16 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '5s' }}></div>
              </div>
              
              {/* Mesh gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-teal-400/10 opacity-60"></div>
              
              <div className="relative flex items-center justify-between px-6 py-8 h-full">
                
                {/* Left Content */}
                <div className="flex-1 max-w-xs relative z-10">
                  <div className="mb-3 transform group-hover:scale-105 transition-all duration-500">
                    <div className="inline-flex items-center bg-gradient-to-r from-emerald-500/15 to-teal-500/15 backdrop-blur-md border border-emerald-200/60 rounded-full px-3 py-1.5 shadow-lg">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">🏔️ Adventure Tours</span>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 bg-clip-text text-transparent mb-3 leading-tight transform group-hover:scale-102 transition-all duration-500">
                    Mountain<br/>Explorer
                  </h1>
                  
                  <p className="text-emerald-700/90 text-base mb-4 font-semibold tracking-wide transform group-hover:translate-x-1 transition-all duration-500">
                    www.mountainexplorer.com
                  </p>
                  
                  <div className="mb-4 text-emerald-600/80 text-xs space-y-1 transform group-hover:translate-x-1 transition-all duration-700">
                    <p className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      <span>Premium Mountain Adventures</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                      <span>Expert Guided Expeditions</span>
                    </p>
                  </div>

                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="group/btn relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-emerald-500/25 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-xl blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative flex items-center justify-center space-x-2">
                      <span>Explore Mountains</span>
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 7l5 5-5 5M6 12h12"/>
                      </svg>
                    </span>
                  </button>
                </div>
                
                {/* Right Illustration - Enhanced Mountain Theme */}
                <div className="flex-1 relative max-w-sm transform group-hover:scale-102 transition-all duration-700">
                  <div className="relative z-10 flex items-center justify-center h-full">
                    
                    {/* Enhanced Mountain peaks with depth */}
                    <div className="absolute top-8 left-8 transform group-hover:scale-105 transition-all duration-700">
                      <div className="w-12 h-16 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 transform rotate-45 rounded-lg shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-white/40 rounded-full blur-sm"></div>
                      </div>
                      <div className="absolute top-1 left-3 w-10 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 transform rotate-45 rounded-lg shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-lg"></div>
                        <div className="absolute top-1 left-1 w-1 h-1 bg-white/50 rounded-full blur-sm"></div>
                      </div>
                      <div className="absolute top-2 left-6 w-8 h-10 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-800 transform rotate-45 rounded-lg shadow-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent rounded-lg"></div>
                      </div>
                    </div>
                    
                    {/* Enhanced Backpack with realistic details */}
                    <div className="w-16 h-20 bg-gradient-to-br from-orange-400 via-orange-600 to-orange-800 rounded-xl shadow-xl relative transform group-hover:rotate-2 transition-all duration-700 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
                      <div className="absolute top-2 left-2 right-2 h-3 bg-gradient-to-r from-orange-800 to-orange-900 rounded shadow-inner"></div>
                      <div className="absolute top-6 left-2 right-2 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded shadow-inner"></div>
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-5 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-lg shadow-lg"></div>
                      <div className="absolute top-4 left-3 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-sm"></div>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1.5 bg-gray-700 rounded"></div>
                    </div>
                    
                    {/* Enhanced Hiking boots with laces */}
                    <div className="absolute bottom-6 right-6 transform group-hover:scale-110 transition-all duration-700">
                      <div className="w-14 h-10 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-lg shadow-xl mb-1 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent rounded-lg"></div>
                        <div className="absolute top-1 left-1 right-1 h-2 bg-amber-800 rounded"></div>
                        <div className="absolute bottom-1 left-0 right-0 h-2 bg-amber-900 rounded-b-lg"></div>
                      </div>
                      <div className="w-14 h-10 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-lg shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent rounded-lg"></div>
                        <div className="absolute top-1 left-1 right-1 h-2 bg-amber-800 rounded"></div>
                        <div className="absolute bottom-1 left-0 right-0 h-2 bg-amber-900 rounded-b-lg"></div>
                      </div>
                    </div>
                    
                    {/* Enhanced Pine Trees with depth */}
                    <div className="absolute top-8 right-12 transform group-hover:sway transition-all duration-1000">
                      <div className="w-3 h-20 bg-gradient-to-b from-amber-700 to-amber-900 rounded shadow-lg"></div>
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="w-10 h-14 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full transform -rotate-12 shadow-lg"></div>
                        <div className="w-8 h-10 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full transform rotate-12 -mt-3 shadow-md"></div>
                        <div className="w-6 h-8 bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-full transform -rotate-45 -mt-2 shadow-md"></div>
                      </div>
                    </div>
                    
                    {/* Compass */}
                    <div className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg transform group-hover:rotate-180 transition-all duration-1000 border-2 border-yellow-200">
                      <div className="absolute inset-1 bg-white rounded-full shadow-inner"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
                    </div>
                    
                    {/* Rope coil */}
                    <div className="absolute bottom-12 left-8 w-6 h-6 border-4 border-amber-600 rounded-full shadow-md transform group-hover:rotate-12 transition-all duration-500">
                      <div className="absolute inset-1 border-2 border-amber-700 rounded-full"></div>
                    </div>
                    
                  </div>
                </div>
                
              </div>
            </div>

            {/* Banner 3 - Beach Resort */}
            <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 rounded-3xl overflow-hidden border border-white/20 backdrop-blur-sm flex-shrink-0 group hover:scale-[1.02] transition-all duration-500" style={{ width: '800px', height: '400px' }}>
              {/* Enhanced Animated background pattern */}
              <div className="absolute inset-0 opacity-50">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-200/30 to-transparent animate-pulse"></div>
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-300/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }}></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
                <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-amber-200/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }}></div>
                {/* Floating particles */}
                <div className="absolute top-12 left-12 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-20 right-16 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '4s' }}></div>
                <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '6s' }}></div>
              </div>
              
              {/* Mesh gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-yellow-400/10 opacity-60"></div>
              
              <div className="relative flex items-center justify-between px-6 py-8 h-full">
                
                {/* Left Content */}
                <div className="flex-1 max-w-xs relative z-10">
                  <div className="mb-3 transform group-hover:scale-105 transition-all duration-500">
                    <div className="inline-flex items-center bg-gradient-to-r from-orange-500/15 to-yellow-500/15 backdrop-blur-md border border-orange-200/60 rounded-full px-3 py-1.5 shadow-lg">
                      <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">🏖️ Beach Resort</span>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-orange-800 via-amber-700 to-yellow-800 bg-clip-text text-transparent mb-3 leading-tight transform group-hover:scale-102 transition-all duration-500">
                    Sunset<br/>Paradise
                  </h1>
                  
                  <p className="text-orange-700/90 text-base mb-4 font-semibold tracking-wide transform group-hover:translate-x-1 transition-all duration-500">
                    www.sunsetparadise.com
                  </p>
                  
                  <div className="mb-4 text-orange-600/80 text-xs space-y-1 transform group-hover:translate-x-1 transition-all duration-700">
                    <p className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                      <span>Luxury Beach Resorts</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                      <span>Tropical Paradise Getaways</span>
                    </p>
                  </div>

                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="group/btn relative bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-orange-500/25 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    <div className="absolute inset-0 bg-orange-400/20 rounded-xl blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative flex items-center justify-center space-x-2">
                      <span>Book Beach Stay</span>
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 7l5 5-5 5M6 12h12"/>
                      </svg>
                    </span>
                  </button>
                </div>
                
                {/* Right Illustration - Enhanced Beach Theme */}
                <div className="flex-1 relative max-w-sm transform group-hover:scale-102 transition-all duration-700">
                  <div className="relative z-10 flex items-center justify-center h-full">
                    
                    {/* Enhanced Sun with rays */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 rounded-full shadow-xl animate-pulse relative transform group-hover:rotate-12 transition-all duration-1000">
                      <div className="absolute inset-2 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full shadow-inner"></div>
                      <div className="absolute inset-3 bg-yellow-100 rounded-full opacity-80"></div>
                      {/* Sun rays */}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-400 rounded-full opacity-70"></div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-400 rounded-full opacity-70"></div>
                      <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-0.5 bg-yellow-400 rounded-full opacity-70"></div>
                      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-0.5 bg-yellow-400 rounded-full opacity-70"></div>
                    </div>
                    
                    {/* Enhanced Palm tree with coconuts */}
                    <div className="absolute top-6 left-8 transform group-hover:sway transition-all duration-1000">
                      <div className="w-2.5 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded shadow-lg relative">
                        <div className="absolute top-1 left-0 w-0.5 h-2 bg-amber-600 rounded"></div>
                        <div className="absolute top-4 right-0 w-0.5 h-2 bg-amber-600 rounded"></div>
                      </div>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full transform -rotate-12 shadow-lg"></div>
                        <div className="w-6 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full transform rotate-12 -mt-2 shadow-md"></div>
                        <div className="w-5 h-3 bg-gradient-to-b from-green-500 to-green-700 rounded-full transform -rotate-45 -mt-1 shadow-md"></div>
                        <div className="w-4 h-2 bg-gradient-to-b from-green-500 to-green-700 rounded-full transform rotate-30 -mt-1 shadow-sm"></div>
                        {/* Coconuts */}
                        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-md"></div>
                        <div className="absolute top-2 right-1 w-1 h-1 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-md"></div>
                      </div>
                    </div>
                    
                    {/* Enhanced Beach ball with more detail */}
                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 via-white to-blue-400 rounded-full shadow-xl relative transform group-hover:rotate-45 transition-all duration-700 overflow-hidden">
                      <div className="absolute inset-0 rounded-full border-2 border-white shadow-inner"></div>
                      <div className="absolute top-0 left-0 w-full h-1/3 bg-red-500 rounded-t-full opacity-80"></div>
                      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-blue-500 rounded-b-full opacity-80"></div>
                      <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
                      <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full blur-sm"></div>
                    </div>
                    
                    {/* Enhanced Surfboard with design */}
                    <div className="absolute bottom-6 right-8 w-8 h-24 bg-gradient-to-b from-cyan-300 via-cyan-400 to-blue-600 rounded-full shadow-xl transform rotate-12 group-hover:rotate-6 transition-all duration-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full"></div>
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-blue-800 rounded-full opacity-60"></div>
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-white rounded-full opacity-80"></div>
                    </div>
                    
                    {/* Enhanced Flip flops with straps */}
                    <div className="absolute bottom-8 left-8 transform group-hover:scale-110 transition-all duration-700">
                      <div className="w-10 h-5 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full mb-1 shadow-lg relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-3 bg-pink-600 rounded"></div>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-pink-600 rounded-b-full"></div>
                      </div>
                      <div className="w-10 h-5 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full shadow-lg relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-3 bg-pink-600 rounded"></div>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-pink-600 rounded-b-full"></div>
                      </div>
                    </div>
                    
                    {/* Seashell */}
                    <div className="absolute bottom-16 right-16 w-6 h-6 bg-gradient-to-br from-pink-200 to-pink-400 rounded-full shadow-lg transform group-hover:rotate-12 transition-all duration-500 relative">
                      <div className="absolute inset-1 bg-white rounded-full opacity-80"></div>
                      <div className="absolute top-1 left-1 w-1 h-1 bg-pink-300 rounded-full"></div>
                    </div>
                    
                    {/* Starfish */}
                    <div className="absolute top-16 left-20 transform group-hover:rotate-45 transition-all duration-1000">
                      <div className="w-8 h-8 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-orange-400 rounded-full shadow-md"></div>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-orange-400 rounded-t-full shadow-sm"></div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-orange-400 rounded-b-full shadow-sm"></div>
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-2 bg-orange-400 rounded-l-full shadow-sm"></div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-2 bg-orange-400 rounded-r-full shadow-sm"></div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes fly {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
        .animate-fly {
          animation: fly 4s ease-in-out infinite;
        }
      `}</style>

      {/* Enhanced Section Components */}
      <SearchSection onOpenModal={() => setIsModalOpen(true)} />

            {/* Things to do - Seasonal Experiences Section */}
      <section className="py-20 px-6 lg:px-8 xl:px-16 bg-gradient-to-b from-white to-sky-50/30">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Things to do—right now
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Seasonal faves you don't want to miss
            </p>
          </div>

          {/* Experience Cards Grid - Bigger Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            
            {activities.map((activity) => (
              <div 
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className="group bg-white rounded-3xl overflow-hidden border border-sky-100 hover:border-sky-300 transition-all duration-300 hover:shadow-2xl cursor-pointer transform hover:scale-105"
              >
                <div className="relative">
                  {/* Real Images */}
                  <div className="h-80 relative overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Heart Icon */}
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors group z-10 backdrop-blur-sm"
                    >
                      <svg className="w-6 h-6 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 000-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                    </button>
                    
                    {/* Premium Badge for certain activities */}
                    {(activity.id === 2 || activity.id === 3) && (
                      <div className="absolute bottom-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        2025
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8">
                    <div className="text-sm text-sky-600 font-semibold mb-3 uppercase tracking-wider">{activity.location}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-sky-700 transition-colors leading-tight">
                      {activity.title}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <span className="text-xl font-bold text-gray-900 mr-2">{activity.rating}</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-4 h-4 rounded-full ${i < Math.floor(activity.rating) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        ))}
                      </div>
                      <span className="text-gray-500 ml-2">({activity.reviews.toLocaleString()})</span>
                    </div>
                    
                    <div className="text-gray-600 text-lg">
                      from <span className="text-xl font-bold text-gray-900">{activity.price}</span> per adult
                    </div>
                    
                    {/* Duration */}
                    <div className="mt-3 text-sm text-gray-500">
                      Duration: {activity.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
          
          {/* View More Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <span>Explore More Experiences</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7l5 5-5 5M6 12h12"/>
                </svg>
              </span>
            </button>
          </div>
          
        </div>
      </section>

      {/* Destination Package Details Modal */}
      {selectedDestinationPackage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Header Image */}
              <div className="h-80 relative overflow-hidden rounded-t-3xl">
                <img 
                  src={selectedDestinationPackage.image} 
                  alt={selectedDestinationPackage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedDestinationPackage(null)}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors backdrop-blur-sm"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                
                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-sm font-semibold mb-2 uppercase tracking-wider opacity-90">{selectedDestinationPackage.destination}</div>
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-2">{selectedDestinationPackage.title}</h2>
                  <div className="flex items-center space-x-4 text-lg">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{selectedDestinationPackage.duration}</span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">⭐ {selectedDestinationPackage.rating}</span>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                {/* Price and Rating Row */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 bg-sky-50 rounded-2xl p-6">
                  <div className="mb-4 lg:mb-0">
                    <div className="flex items-center mb-2">
                      <span className="text-3xl font-bold text-sky-600 mr-3">{selectedDestinationPackage.price}</span>
                      <span className="text-xl text-gray-500 line-through mr-3">{selectedDestinationPackage.originalPrice}</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                        Save {Math.round((1 - parseInt(selectedDestinationPackage.price.replace(/[₹,]/g, '')) / parseInt(selectedDestinationPackage.originalPrice.replace(/[₹,]/g, ''))) * 100)}%
                      </span>
                    </div>
                    <div className="text-gray-600">per person (all inclusive)</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-2">
                      <span className="text-2xl font-bold text-gray-900 mr-2">{selectedDestinationPackage.rating}</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < Math.floor(selectedDestinationPackage.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="text-gray-500">({selectedDestinationPackage.reviews.toLocaleString()} reviews)</div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Package</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{selectedDestinationPackage.description}</p>
                </div>
                
                {/* Highlights */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Package Highlights</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                                              {selectedDestinationPackage.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Detailed Hour-by-Hour Itinerary */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Day-by-Day Itinerary</h3>
                  <div className="space-y-6">
                                              {selectedDestinationPackage.itinerary.map((day: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-4">
                          <div className="flex items-center text-white">
                            <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                              {day.day}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold">{day.title}</h4>
                              <div className="flex items-center space-x-4 text-sm opacity-90">
                                <span>📍 {day.accommodation}</span>
                                <span>🍽️ {day.meals}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h5 className="text-lg font-bold text-gray-900 mb-4">Hour-by-Hour Schedule</h5>
                          <div className="space-y-4">
                                                              {day.activities.map((activity: any, actIdx: number) => (
                              <div key={actIdx} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="bg-sky-500 text-white px-3 py-1 rounded-lg text-sm font-bold flex-shrink-0">
                                  {activity.time}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 mb-1">{activity.activity}</div>
                                  <div className="text-sm text-gray-600 flex items-center">
                                    <svg className="w-4 h-4 text-sky-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    {activity.location}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Inclusions and Exclusions */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-green-700">✓ What's Included</h3>
                    <ul className="space-y-2">
                                                  {selectedDestinationPackage.includes.map((item: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-red-700">✗ What's Not Included</h3>
                    <ul className="space-y-2">
                                                  {selectedDestinationPackage.excludes.map((item: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => {
                      // Use the mapping from the dedicated file
                      const { getDatabasePackageId } = require('@/lib/package-mapping')
                      const realPackageId = getDatabasePackageId(selectedDestinationPackage.id)
                      
                      const params = new URLSearchParams({
                        packageId: realPackageId,
                        destination: selectedDestinationPackage.destination || '',
                        price: selectedDestinationPackage.price?.toString().replace(/[₹,]/g, '') || '15000',
                        duration: selectedDestinationPackage.duration || '5 Days 4 Nights',
                      })
                      window.location.href = `/book-package?${params.toString()}`
                    }}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    BOOK PACKAGE - {selectedDestinationPackage.price}
                  </button>
                  <button 
                    onClick={() => setSelectedDestinationPackage(null)}
                    className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Header Image */}
              <div className="h-64 md:h-80 relative overflow-hidden rounded-t-3xl">
                <img 
                  src={selectedActivity.image} 
                  alt={selectedActivity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedActivity(null)}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors backdrop-blur-sm"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                
                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-sm font-semibold mb-2 uppercase tracking-wider opacity-90">{selectedActivity.location}</div>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight">{selectedActivity.title}</h2>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Rating and Price Row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <span className="text-2xl font-bold text-gray-900 mr-3">{selectedActivity.rating}</span>
                    <div className="flex space-x-1 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-5 h-5 rounded-full ${i < Math.floor(selectedActivity.rating) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      ))}
                    </div>
                    <span className="text-gray-500">({selectedActivity.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">from</div>
                    <div className="text-3xl font-bold text-sky-600">{selectedActivity.price}</div>
                    <div className="text-gray-500">per adult</div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About This Experience</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{selectedActivity.description}</p>
                </div>
                
                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Highlights */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Experience Highlights</h3>
                    <ul className="space-y-3">
                                              {selectedActivity.highlights.map((highlight: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Trip Details */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-sky-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <div>
                          <div className="font-semibold text-gray-900">Duration</div>
                          <div className="text-gray-600">{selectedActivity.duration}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-sky-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <div>
                          <div className="font-semibold text-gray-900">Group Size</div>
                          <div className="text-gray-600">{selectedActivity.groupSize}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* What's Included */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                                            {selectedActivity.includes.map((item: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => {
                      setSelectedActivity(null)
                      setIsModalOpen(true)
                    }}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Book This Experience
                  </button>
                  <button 
                    onClick={() => setSelectedActivity(null)}
                    className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trip Planning Modal */}
      {isModalOpen && (
        <TripPlanningModal 
          onClose={() => setIsModalOpen(false)}
          isAuthenticated={!!session}
        />
      )}
      
      {/* Custom Cursor Trail Effect */}
      <div 
        className="fixed pointer-events-none z-50 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 mix-blend-multiply transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'scale(0.8)',
        }}
      ></div>
    </div>
  )
}