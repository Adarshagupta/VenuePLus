import { 
  ScrapedPackage, 
  AIGeneratedPackage, 
  BasePackage,
  PackageFilter,
  PackageComparison,
  PackageBookingRequest,
  PackageBookingResponse,
  AIPackageAnalysis,
  PackageSource,
  PackageType,
  PackageCategory
} from './package-types'
import { webScraper, RealTimeDataAggregator } from './web-scraper'
import { geminiTravelAgent } from './gemini-ai'
import { 
  getDestinationInfo, 
  getAirportInfo, 
  getRealHotels, 
  getRealActivities, 
  getRealRestaurants,
  getTransportationInfo,
  getWeatherInfo 
} from './destination-data'

export class UnifiedPackageService {
  private scrapedPackages: ScrapedPackage[] = []
  private aiGeneratedPackages: AIGeneratedPackage[] = []
  private dataAggregator = new RealTimeDataAggregator()

  /**
   * Get all packages (scraped + AI generated) with optional filtering
   */
  async getAllPackages(filter?: PackageFilter): Promise<(ScrapedPackage | AIGeneratedPackage)[]> {
    try {
      // Get both types of packages
      const [scraped, aiGenerated] = await Promise.all([
        this.getScrapedPackages(filter),
        this.getAIGeneratedPackages(filter)
      ])

      // Combine and sort
      const allPackages = [...scraped, ...aiGenerated]
      return this.sortPackages(allPackages, filter?.sortBy, filter?.sortOrder)
    } catch (error) {
      console.error('Error getting all packages:', error)
      return []
    }
  }

  /**
   * Get packages scraped from internet sources
   */
  async getScrapedPackages(filter?: PackageFilter): Promise<ScrapedPackage[]> {
    try {
      console.log('🔍 Fetching scraped packages from travel websites...')
      
      // Use existing web scraper to get packages
      const destination = filter?.destination || 'India'
      const duration = filter?.duration?.[0] || '5-7 days'
      const travelers = 2

      const rawScrapedData = await this.dataAggregator.getComprehensivePackages(
        destination, 
        duration, 
        travelers
      )

      // Convert scraped data to our package format and enhance with AI
      const scrapedPackages = await Promise.all(
        rawScrapedData.map(async (raw) => await this.convertAndEnhanceScrapedPackage(raw))
      )

      // Apply filters
      return this.applyFilters(scrapedPackages, filter)
    } catch (error) {
      console.error('Error getting scraped packages:', error)
      return []
    }
  }

  /**
   * Get AI-generated packages based on user preferences
   */
  async getAIGeneratedPackages(filter?: PackageFilter): Promise<AIGeneratedPackage[]> {
    try {
      console.log('🤖 Generating AI-powered travel packages...')
      
      const destination = filter?.destination || 'India'
      const budget = filter?.priceRange?.max || 50000
      const category = filter?.category?.[0] || 'balanced'

      // Generate multiple package options using AI
      const aiPackages = await this.generateAIPackages({
        destination,
        budget,
        category,
        count: 5
      })

      // Apply filters
      return this.applyFilters(aiPackages, filter)
    } catch (error) {
      console.error('Error generating AI packages:', error)
      return []
    }
  }

  /**
   * Convert scraped data to our package format and enhance with AI analysis
   */
  private async convertAndEnhanceScrapedPackage(rawData: any): Promise<ScrapedPackage> {
    const durationDays = this.extractDaysFromDuration(rawData.duration || '5 days 4 nights')
    
    const basePackage: ScrapedPackage = {
      id: `scraped_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: rawData.title || 'Travel Package',
      description: rawData.description || 'Comprehensive travel package',
      destination: rawData.destination || 'India',
      duration: rawData.duration || '5 days 4 nights',
      price: this.parsePrice(rawData.price),
      currency: 'INR',
      source: 'scraped',
      type: this.inferPackageType(rawData),
      category: this.inferPackageCategory(rawData),
      rating: parseFloat(rawData.rating) || 4.0,
      reviewCount: parseInt(rawData.reviews) || 100,
      imageUrl: rawData.imageUrl || this.getDefaultImage(rawData.destination),
      provider: rawData.provider || 'Travel Partner',
      createdAt: new Date(),
      updatedAt: new Date(),
      originalUrl: rawData.url || '',
      scrapedAt: new Date(),
      availability: 'available',
      bookingUrl: rawData.url || '',
      terms: rawData.includes || [],
      summary: {
        totalDays: durationDays,
        cities: [rawData.destination || 'India'],
        totalActivities: durationDays * 2,
        totalMeals: durationDays * 3,
        accommodationType: this.inferAccommodationType(rawData),
        transportModes: ['Flight', 'Car']
      },
      itinerary: this.generateSampleItinerary(rawData.destination || 'India', durationDays, this.parsePrice(rawData.price))
    }

    // Enhance with AI analysis
    try {
      basePackage.aiAnalysis = await this.generateAIAnalysis(basePackage)
    } catch (error) {
      console.warn('Failed to generate AI analysis for scraped package:', error)
    }

    return basePackage
  }

  /**
   * Generate AI analysis for scraped packages
   */
  private async generateAIAnalysis(packageData: BasePackage): Promise<AIPackageAnalysis> {
    try {
      const prompt = `
        Analyze this travel package and provide insights:
        
        Package: ${packageData.name}
        Destination: ${packageData.destination}
        Price: ₹${packageData.price}
        Duration: ${packageData.duration}
        Provider: ${packageData.provider}
        Rating: ${packageData.rating}/5
        
        Provide analysis in JSON format:
        {
          "qualityScore": number (1-10),
          "priceValue": "excellent|good|fair|poor",
          "highlights": ["highlight1", "highlight2"],
          "potentialIssues": ["issue1", "issue2"],
          "recommendations": ["rec1", "rec2"],
          "trustScore": number (1-10)
        }
      `

      // This would use actual AI service in production
      // For now, providing smart defaults based on data
      return {
        qualityScore: Math.min(10, Math.max(1, packageData.rating * 2)),
        priceValue: this.assessPriceValue(packageData.price, packageData.destination),
        highlights: this.generateHighlights(packageData),
        potentialIssues: this.identifyPotentialIssues(packageData),
        recommendations: this.generateRecommendations(packageData),
        competitorComparison: [],
        trustScore: Math.min(10, Math.max(1, packageData.rating * 1.8))
      }
    } catch (error) {
      console.error('Error generating AI analysis:', error)
      return {
        qualityScore: 6,
        priceValue: 'fair',
        highlights: ['Verified package', 'Good rating'],
        potentialIssues: ['Limited information available'],
        recommendations: ['Check terms and conditions', 'Verify availability'],
        competitorComparison: [],
        trustScore: 6
      }
    }
  }

  /**
   * Generate AI-powered travel packages
   */
  private async generateAIPackages(params: {
    destination: string
    budget: number
    category: string
    count: number
  }): Promise<AIGeneratedPackage[]> {
    const packages: AIGeneratedPackage[] = []

    try {
      for (let i = 0; i < params.count; i++) {
        const packageType = this.selectPackageVariation(i, params.category)
        const aiPackage = await this.generateSingleAIPackage({
          ...params,
          variation: packageType,
          index: i
        })
        packages.push(aiPackage)
      }
    } catch (error) {
      console.error('Error generating AI packages:', error)
    }

    return packages
  }

  /**
   * Generate a single AI package
   */
  private async generateSingleAIPackage(params: {
    destination: string
    budget: number
    category: string
    variation: string
    index: number
  }): Promise<AIGeneratedPackage> {
    const variations = [
      { name: 'Cultural Explorer', focus: 'heritage and culture' },
      { name: 'Adventure Seeker', focus: 'outdoor activities and adventure' },
      { name: 'Luxury Retreat', focus: 'premium comfort and exclusive experiences' },
      { name: 'Budget Traveler', focus: 'cost-effective authentic experiences' },
      { name: 'Family Fun', focus: 'family-friendly activities and accommodation' }
    ]

    const variation = variations[params.index % variations.length]
    const adjustedBudget = this.adjustBudgetForVariation(params.budget, variation.name)

    const duration = this.selectDurationForBudget(adjustedBudget)
    const durationDays = this.extractDaysFromDuration(duration)
    
    return {
      id: `ai_${Date.now()}_${params.index}`,
      name: `${params.destination} ${variation.name}`,
      description: `AI-curated ${variation.focus} package for ${params.destination}`,
      destination: params.destination,
      duration,
      price: adjustedBudget,
      currency: 'INR',
      source: 'ai_generated',
      type: 'complete_package',
      category: this.mapCategoryFromVariation(variation.name),
      rating: 4.2 + (Math.random() * 0.6), // 4.2-4.8 range
      reviewCount: 50 + Math.floor(Math.random() * 200),
      imageUrl: this.getDefaultImage(params.destination),
      provider: 'VenuePlus AI',
      createdAt: new Date(),
      updatedAt: new Date(),
      prompt: `Generate ${variation.focus} package for ${params.destination}`,
      generationModel: 'gemini-1.5-pro',
      confidence: 0.85 + (Math.random() * 0.1),
      aiFeatures: this.generateAIFeatures(variation.name),
      customizations: this.generateCustomizations(params.category),
      realTimeData: await this.fetchRealTimeData(params.destination),
      summary: {
        totalDays: durationDays,
        cities: this.getCitiesForDestination(params.destination),
        totalActivities: durationDays * 2,
        totalMeals: durationDays * 3,
        accommodationType: 'AI-Selected Hotel',
        transportModes: ['AI-Optimized Transport']
      },
      itinerary: this.generateSampleItinerary(params.destination, durationDays, adjustedBudget)
    }
  }

  /**
   * Compare packages and provide recommendations
   */
  async comparePackages(packageIds: string[]): Promise<PackageComparison> {
    const allPackages = await this.getAllPackages()
    const selectedPackages = allPackages.filter(pkg => packageIds.includes(pkg.id))

    const criteria = [
      { name: 'Value for Money', weight: 0.3, description: 'Price vs included benefits' },
      { name: 'Quality Rating', weight: 0.25, description: 'Overall package rating' },
      { name: 'Inclusions', weight: 0.2, description: 'What\'s included in the package' },
      { name: 'Flexibility', weight: 0.15, description: 'Customization and cancellation options' },
      { name: 'Provider Trust', weight: 0.1, description: 'Provider reliability and reputation' }
    ]

    const recommendation = this.generateRecommendation(selectedPackages, criteria)

    return {
      packages: selectedPackages,
      criteria,
      recommendation
    }
  }

  /**
   * Book a package
   */
  async bookPackage(request: PackageBookingRequest): Promise<PackageBookingResponse> {
    try {
      // In production, this would integrate with actual booking systems
      const allPackages = await this.getAllPackages()
      const selectedPackage = allPackages.find(pkg => pkg.id === request.packageId)

      if (!selectedPackage) {
        return {
          success: false,
          totalCost: 0,
          paymentOptions: [],
          cancellationPolicy: '',
          nextSteps: [],
          error: 'Package not found'
        }
      }

      const totalCost = selectedPackage.price * request.travelers
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        success: true,
        bookingId,
        confirmation: `CONF${Date.now()}`,
        totalCost,
        paymentOptions: [
          {
            method: 'card',
            provider: 'Razorpay',
            processingFee: totalCost * 0.02,
            description: 'Credit/Debit Card',
            available: true
          },
          {
            method: 'upi',
            provider: 'UPI',
            processingFee: 0,
            description: 'UPI Payment',
            available: true
          },
          {
            method: 'installments',
            provider: 'EMI',
            processingFee: totalCost * 0.03,
            description: '3-6 month installments',
            available: totalCost > 20000
          }
        ],
        cancellationPolicy: '24-48 hours free cancellation',
        nextSteps: [
          'Complete payment',
          'Receive confirmation email',
          'Download travel documents',
          'Check travel requirements'
        ]
      }
    } catch (error) {
      console.error('Error booking package:', error)
      return {
        success: false,
        totalCost: 0,
        paymentOptions: [],
        cancellationPolicy: '',
        nextSteps: [],
        error: 'Booking failed. Please try again.'
      }
    }
  }

  // Helper methods
  private parsePrice(priceString: string): number {
    if (typeof priceString === 'number') return priceString
    const cleanPrice = priceString?.replace(/[^\d]/g, '') || '25000'
    return parseInt(cleanPrice) || 25000
  }

  private inferPackageType(rawData: any): PackageType {
    const title = rawData.title?.toLowerCase() || ''
    if (title.includes('flight')) return 'flight'
    if (title.includes('hotel') || title.includes('accommodation')) return 'accommodation'
    if (title.includes('activity') || title.includes('tour')) return 'activity'
    return 'complete_package'
  }

  private inferPackageCategory(rawData: any): PackageCategory {
    const title = rawData.title?.toLowerCase() || ''
    const price = this.parsePrice(rawData.price)
    
    if (title.includes('luxury') || title.includes('premium') || price > 75000) return 'luxury'
    if (title.includes('budget') || title.includes('economy') || price < 30000) return 'budget'
    if (title.includes('adventure') || title.includes('trekking')) return 'adventure'
    if (title.includes('cultural') || title.includes('heritage')) return 'cultural'
    if (title.includes('family') || title.includes('kids')) return 'family'
    if (title.includes('romantic') || title.includes('honeymoon')) return 'romantic'
    return 'mid_range'
  }

  private getDefaultImage(destination: string): string {
    // Return appropriate stock images based on destination
    const images = {
      'India': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Rajasthan': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
    return images[destination as keyof typeof images] || images['India']
  }

  private assessPriceValue(price: number, destination: string): 'excellent' | 'good' | 'fair' | 'poor' {
    // Simple price assessment logic
    if (price < 25000) return 'excellent'
    if (price < 50000) return 'good'
    if (price < 75000) return 'fair'
    return 'poor'
  }

  private generateHighlights(packageData: BasePackage): string[] {
    const highlights = []
    if (packageData.rating >= 4.5) highlights.push('Highly rated package')
    if (packageData.price < 35000) highlights.push('Great value for money')
    if (packageData.reviewCount > 100) highlights.push('Popular choice')
    if (packageData.source === 'ai_generated') highlights.push('AI-optimized itinerary')
    return highlights.length > 0 ? highlights : ['Verified travel package']
  }

  private identifyPotentialIssues(packageData: BasePackage): string[] {
    const issues = []
    if (packageData.rating < 3.5) issues.push('Below average rating')
    if (packageData.reviewCount < 10) issues.push('Limited reviews available')
    if (packageData.source === 'scraped') issues.push('Verify current availability')
    return issues
  }

  private generateRecommendations(packageData: BasePackage): string[] {
    const recommendations = []
    recommendations.push('Book early for better rates')
    if (packageData.category === 'budget') recommendations.push('Consider upgrading accommodation for comfort')
    if (packageData.category === 'luxury') recommendations.push('Perfect for special occasions')
    recommendations.push('Check travel insurance options')
    return recommendations
  }

  private selectPackageVariation(index: number, category: string): string {
    const variations = ['Cultural Explorer', 'Adventure Seeker', 'Luxury Retreat', 'Budget Traveler', 'Family Fun']
    return variations[index % variations.length]
  }

  private adjustBudgetForVariation(baseBudget: number, variation: string): number {
    const multipliers = {
      'Cultural Explorer': 1.0,
      'Adventure Seeker': 1.1,
      'Luxury Retreat': 1.5,
      'Budget Traveler': 0.7,
      'Family Fun': 1.2
    }
    return Math.round(baseBudget * (multipliers[variation as keyof typeof multipliers] || 1.0))
  }

  private selectDurationForBudget(budget: number): string {
    if (budget < 25000) return '3 days 2 nights'
    if (budget < 50000) return '5 days 4 nights'
    if (budget < 75000) return '7 days 6 nights'
    return '10 days 9 nights'
  }

  private mapCategoryFromVariation(variation: string): PackageCategory {
    const mapping = {
      'Cultural Explorer': 'cultural' as PackageCategory,
      'Adventure Seeker': 'adventure' as PackageCategory,
      'Luxury Retreat': 'luxury' as PackageCategory,
      'Budget Traveler': 'budget' as PackageCategory,
      'Family Fun': 'family' as PackageCategory
    }
    return mapping[variation as keyof typeof mapping] || 'mid_range'
  }

  private generateAIFeatures(variation: string): any[] {
    const features = [
      {
        name: 'Smart Scheduling',
        description: 'AI-optimized daily schedules based on preferences',
        category: 'optimization',
        benefit: 'Maximize time and minimize travel stress'
      },
      {
        name: 'Local Insights',
        description: 'AI-curated local experiences and hidden gems',
        category: 'insights',
        benefit: 'Discover authentic local culture'
      },
      {
        name: 'Budget Optimization',
        description: 'AI-balanced spending across categories',
        category: 'optimization',
        benefit: 'Get maximum value for your money'
      }
    ]
    return features
  }

  private generateCustomizations(category: string): any[] {
    return [
      {
        type: 'dietary',
        value: 'vegetarian_options',
        impact: 'Restaurant selections include vegetarian choices'
      },
      {
        type: 'interest',
        value: category,
        impact: `Itinerary optimized for ${category} preferences`
      }
    ]
  }

  private async fetchRealTimeData(destination: string): Promise<any> {
    // In production, this would fetch real-time data
    return {
      weatherForecast: [],
      currentEvents: [],
      priceFluctuations: [],
      crowdLevels: [],
      lastUpdated: new Date()
    }
  }

  private applyFilters(packages: any[], filter?: PackageFilter): any[] {
    let filtered = packages

    if (filter?.source?.length) {
      filtered = filtered.filter(pkg => filter.source!.includes(pkg.source))
    }

    if (filter?.type?.length) {
      filtered = filtered.filter(pkg => filter.type!.includes(pkg.type))
    }

    if (filter?.category?.length) {
      filtered = filtered.filter(pkg => filter.category!.includes(pkg.category))
    }

    if (filter?.priceRange) {
      filtered = filtered.filter(pkg => 
        pkg.price >= (filter.priceRange!.min || 0) && 
        pkg.price <= (filter.priceRange!.max || Infinity)
      )
    }

    if (filter?.rating?.min) {
      filtered = filtered.filter(pkg => pkg.rating >= filter.rating!.min)
    }

    return filtered
  }

  private sortPackages(packages: any[], sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc'): any[] {
    if (!sortBy) return packages

    return packages.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price
          break
        case 'rating':
          comparison = a.rating - b.rating
          break
        case 'popularity':
          comparison = a.reviewCount - b.reviewCount
          break
        case 'ai_score':
          const aScore = a.source === 'ai_generated' ? a.confidence : (a.aiAnalysis?.qualityScore / 10 || 0.5)
          const bScore = b.source === 'ai_generated' ? b.confidence : (b.aiAnalysis?.qualityScore / 10 || 0.5)
          comparison = aScore - bScore
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  private generateRecommendation(packages: any[], criteria: any[]): any {
    const scores = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      totalScore: this.calculatePackageScore(pkg, criteria)
    }))

    scores.sort((a, b) => b.totalScore - a.totalScore)

    const bestOverall = scores[0]
    const bestValue = packages.find(pkg => this.assessPriceValue(pkg.price, pkg.destination) === 'excellent')
    const bestLuxury = packages.find(pkg => pkg.category === 'luxury')
    const bestBudget = packages.find(pkg => pkg.category === 'budget')

    return {
      bestOverall: bestOverall?.id || packages[0]?.id,
      bestValue: bestValue?.id || packages[0]?.id,
      bestLuxury: bestLuxury?.id || packages[0]?.id,
      bestBudget: bestBudget?.id || packages[0]?.id,
      reasoning: `Based on comprehensive analysis of ${criteria.length} criteria, considering value, quality, and user preferences.`
    }
  }

  private calculatePackageScore(pkg: any, criteria: any[]): number {
    // Simple scoring algorithm
    let score = 0
    score += (pkg.rating / 5) * 0.4  // 40% weight on rating
    score += (1 - (pkg.price / 100000)) * 0.3  // 30% weight on price (inverse)
    score += (pkg.reviewCount / 500) * 0.2  // 20% weight on popularity
    score += (pkg.source === 'ai_generated' ? 0.1 : 0.05) * 0.1  // 10% AI bonus
    return Math.min(1, score)  // Cap at 1.0
  }

  // Helper methods for itinerary generation
  private extractDaysFromDuration(duration: string): number {
    // Handle preset duration ranges
    switch (duration) {
      case '4-6 Days': return 5
      case '7-9 Days': return 8
      case '10-12 Days': return 11
      case '13-15 Days': return 14
      default: {
        // Handle custom duration formats like "5 Days" or "10 Day" or "5 days 4 nights"
        const match = duration.match(/(\d+)\s*days?/i)
        return match ? parseInt(match[1]) : 5
      }
    }
  }

  private inferAccommodationType(rawData: any): string {
    const title = rawData.title?.toLowerCase() || ''
    if (title.includes('luxury') || title.includes('resort')) return 'Resort'
    if (title.includes('hotel')) return 'Hotel'
    if (title.includes('homestay')) return 'Homestay'
    return 'Hotel'
  }

  private generateSampleItinerary(destination: string, days: number, totalBudget: number): any {
    const dailyBudget = totalBudget / days
    const cities = this.getCitiesForDestination(destination)
    
    return {
      days: Array.from({ length: days }, (_, index) => this.generateSampleDay(
        index + 1, 
        cities[index % cities.length], 
        dailyBudget,
        destination
      )),
      totalCost: totalBudget,
      included: ['Accommodation', 'Daily breakfast', 'Transportation', 'Sightseeing'],
      excluded: ['Personal expenses', 'Travel insurance', 'Meals not mentioned'],
      cancellationPolicy: 'Free cancellation up to 24 hours before departure',
      highlights: [
        `Explore the best of ${destination}`,
        'Professional local guide',
        'Comfortable accommodation',
        'All transfers included'
      ],
      overview: `Experience the beauty and culture of ${destination} with this comprehensive ${days}-day package.`,
      bestTimeToVisit: 'October to March',
      difficulty: 'easy' as const,
      groupSize: { min: 1, max: 15 }
    }
  }

  private generateSampleDay(dayNumber: number, city: string, dailyBudget: number, destination: string): any {
    const date = new Date()
    date.setDate(date.getDate() + dayNumber - 1)

    const activities = this.getActivitiesForDestination(destination, city)
    const dayActivities = activities.slice(0, 2).map(activity => ({
      ...activity,
      cost: Math.round(dailyBudget * 0.3)
    }))

    const timeline = this.generateDayTimeline(dayActivities, dayNumber)

    return {
      day: dayNumber,
      date: date.toISOString().split('T')[0],
      city,
      theme: this.getDayTheme(dayNumber, destination),
      weather: {
        condition: 'Sunny',
        temperature: { min: 22, max: 32 },
        recommendation: 'Light clothing, sunscreen recommended'
      },
      activities: dayActivities,
      meals: this.generateRealMeals(city, destination, dailyBudget),
      accommodation: this.generateRealAccommodation(city, destination, dailyBudget * 0.4),
      transport: this.generateDetailedTransport(dayNumber, city, dailyBudget, destination),
      freeTime: '2 hours',
      notes: [
        'Comfortable walking shoes recommended',
        'Camera for scenic spots',
        'Local SIM card available'
      ],
      estimatedCost: Math.round(dailyBudget),
      walkingDistance: '2-3 km',
      highlights: [
        `Best views of ${city}`,
        'Local cultural experience',
        'Traditional cuisine tasting'
      ],
      photos: [],
      timeline
    }
  }

  private generateDayTimeline(activities: any[], dayNumber: number): any[] {
    return [
      {
        time: '08:00',
        activity: 'Breakfast',
        type: 'meal',
        location: 'Hotel Restaurant',
        duration: '1 hour',
        cost: activities[0]?.cost * 0.2 || 500,
        icon: '🍳',
        description: 'Start your day with a healthy breakfast'
      },
      {
        time: '09:30',
        activity: activities[0]?.name || 'Sightseeing',
        type: 'activity',
        location: activities[0]?.location || 'City Center',
        duration: activities[0]?.duration || '3 hours',
        cost: activities[0]?.cost || 1500,
        icon: '🏛️',
        description: activities[0]?.description || 'Explore the main attractions'
      },
      {
        time: '13:00',
        activity: 'Lunch',
        type: 'meal',
        location: 'Local Restaurant',
        duration: '1 hour',
        cost: activities[0]?.cost * 0.3 || 800,
        icon: '🍽️',
        description: 'Taste authentic local cuisine'
      },
      {
        time: '15:00',
        activity: activities[1]?.name || 'Local Market Visit',
        type: 'activity',
        location: activities[1]?.location || 'Local Market',
        duration: activities[1]?.duration || '2 hours',
        cost: activities[1]?.cost || 1000,
        icon: '🛍️',
        description: activities[1]?.description || 'Shopping and local interaction'
      },
      {
        time: '19:30',
        activity: 'Dinner',
        type: 'meal',
        location: 'Hotel Restaurant',
        duration: '1.5 hours',
        cost: activities[0]?.cost * 0.4 || 1200,
        icon: '🍷',
        description: 'Enjoy dinner with cultural entertainment'
      }
    ]
  }

  private getCitiesForDestination(destination: string): string[] {
    const destinationCities: { [key: string]: string[] } = {
      'Goa': ['Panaji', 'Margao', 'Vasco'],
      'Kerala': ['Kochi', 'Munnar', 'Alleppey', 'Thekkady'],
      'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer'],
      'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
      'Tamil Nadu': ['Chennai', 'Madurai', 'Ooty', 'Kodaikanal']
    }
    return destinationCities[destination] || [destination]
  }

  private getActivitiesForDestination(destination: string, city: string): any[] {
    // Get real activities from destination database
    const realActivities = getRealActivities(destination) || getRealActivities(city)
    
    if (realActivities.length > 0) {
      return realActivities.slice(0, 2).map(activity => ({
        name: activity.name,
        description: activity.description,
        duration: activity.duration,
        location: activity.location,
        address: activity.address,
        coordinates: activity.coordinates,
        included: true,
        optional: false,
        bookingRequired: activity.category === 'adventure',
        category: activity.category,
        difficulty: activity.difficulty,
        ageRecommendation: activity.ageRecommendation || 'All ages',
        photos: [],
        tips: [
          `Best time: ${activity.bestTimeToVisit}`,
          'Carry water bottle',
          'Wear comfortable shoes'
        ],
        bestTimeToVisit: activity.bestTimeToVisit,
        crowdLevel: 'medium' as const,
        accessibility: ['Wheelchair accessible']
      }))
    }

    // Fallback to generic activities
    return [
      {
        name: `${city} Heritage Walk`,
        description: `Guided tour of ${city}'s historical landmarks and cultural sites`,
        duration: '3 hours',
        location: `${city} Heritage District`,
        address: `Heritage Area, ${city}`,
        coordinates: { lat: 25.2744, lng: 82.9942 },
        included: true,
        optional: false,
        bookingRequired: false,
        category: 'cultural',
        difficulty: 'easy',
        ageRecommendation: 'All ages',
        photos: [],
        tips: ['Wear comfortable shoes', 'Carry water bottle'],
        bestTimeToVisit: 'Morning hours',
        crowdLevel: 'medium' as const,
        accessibility: ['Wheelchair accessible']
      }
    ]
  }

  private getDayTheme(dayNumber: number, destination: string): string {
    const themes = [
      'Arrival & Exploration',
      'Cultural Immersion',
      'Adventure & Nature',
      'Local Experiences',
      'Relaxation & Departure'
    ]
    return themes[(dayNumber - 1) % themes.length] || `Day ${dayNumber} Activities`
  }

  private parseDuration(duration: string): number {
    // Parse duration like "2h 30m" into total minutes
    const hourMatch = duration.match(/(\d+)h/)
    const minuteMatch = duration.match(/(\d+)m/)
    
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0
    
    return hours * 60 + minutes
  }

  private generateRealAccommodation(city: string, destination: string, budget: number): any {
    const realHotels = getRealHotels(destination) || getRealHotels(city)
    
    if (realHotels.length > 0) {
      // Find hotel that fits budget
      const suitableHotel = realHotels.find(hotel => 
        budget >= hotel.priceRange.min && budget <= hotel.priceRange.max
      ) || realHotels[0] // Fallback to first hotel
      
      return {
        name: suitableHotel.name,
        type: suitableHotel.category.replace('_', ' '),
        location: suitableHotel.location,
        rating: suitableHotel.rating,
        amenities: suitableHotel.amenities,
        costPerNight: Math.round(budget),
        checkIn: '14:00',
        checkOut: '11:00',
        address: suitableHotel.address,
        coordinates: suitableHotel.coordinates
      }
    }
    
    // Fallback to generic hotel
    return {
      name: `${city} Heritage Hotel`,
      type: 'Hotel',
      location: `Central ${city}`,
      rating: 4.2,
      amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa'],
      costPerNight: Math.round(budget),
      checkIn: '14:00',
      checkOut: '11:00'
    }
  }

  private generateRealMeals(city: string, destination: string, dailyBudget: number): any[] {
    const realRestaurants = getRealRestaurants(destination) || getRealRestaurants(city)
    
    if (realRestaurants.length > 0) {
      const breakfast = {
        type: 'breakfast',
        venue: `${city} Hotel Restaurant`,
        cuisine: 'Continental',
        cost: Math.round(dailyBudget * 0.1),
        description: 'Complimentary breakfast at hotel',
        included: true
      }

      const lunchRestaurant = realRestaurants.find(r => r.category === 'casual') || realRestaurants[0]
      const lunch = {
        type: 'lunch',
        venue: lunchRestaurant.name,
        cuisine: lunchRestaurant.cuisine,
        cost: Math.round(dailyBudget * 0.15),
        description: `Authentic ${lunchRestaurant.cuisine} cuisine - ${lunchRestaurant.specialties[0]}`,
        included: true
      }

      const dinnerRestaurant = realRestaurants.find(r => r.category === 'fine_dining') || realRestaurants[realRestaurants.length - 1]
      const dinner = {
        type: 'dinner',
        venue: dinnerRestaurant.name,
        cuisine: dinnerRestaurant.cuisine,
        cost: Math.round(dailyBudget * 0.2),
        description: `Special ${dinnerRestaurant.cuisine} dinner - ${dinnerRestaurant.specialties[0]}`,
        included: true
      }

      return [breakfast, lunch, dinner]
    }

    // Fallback to generic meals
    return [
      {
        type: 'breakfast',
        venue: `${city} Hotel Restaurant`,
        cuisine: 'Continental',
        cost: Math.round(dailyBudget * 0.1),
        description: 'Complimentary breakfast at hotel',
        included: true
      },
      {
        type: 'lunch',
        venue: `Local ${city} Restaurant`,
        cuisine: 'Local',
        cost: Math.round(dailyBudget * 0.15),
        description: 'Authentic local cuisine experience',
        included: true
      },
      {
        type: 'dinner',
        venue: `${city} Fine Dining`,
        cuisine: 'Multi-cuisine',
        cost: Math.round(dailyBudget * 0.2),
        description: 'Special dinner with cultural show',
        included: true
      }
    ]
  }

  private generateDetailedTransport(dayNumber: number, city: string, dailyBudget: number, destination: string): any[] {
    const isFirstDay = dayNumber === 1
    const mode = isFirstDay ? 'flight' : 'car'
    
    const transport: any = {
      mode,
      from: isFirstDay ? 'Delhi (DEL)' : 'Previous Location',
      to: city,
      cost: Math.round(dailyBudget * 0.1),
      duration: isFirstDay ? '2h 30m' : '1h 30m',
      departure: isFirstDay ? '09:00' : '10:00',
      arrival: isFirstDay ? '11:30' : '11:30',
      included: true,
      provider: isFirstDay ? 'Air India' : 'State Transport',
      class: isFirstDay ? 'Economy' : 'AC'
    }

    if (isFirstDay) {
      transport.detailedSchedule = this.generateFlightSchedule(city, destination)
      transport.checkInInfo = this.generateCheckInInfo()
      transport.baggageInfo = this.generateBaggageInfo()
    } else {
      transport.detailedSchedule = this.generateGroundTransportSchedule(city, mode)
    }

    return [transport]
  }

  private generateFlightSchedule(city: string, destination: string): any {
    const destInfo = getDestinationInfo(destination) || getDestinationInfo(city)
    const transportInfo = getTransportationInfo(destination) || getTransportationInfo(city)
    
    const departureAirport = {
      name: 'Indira Gandhi International Airport',
      address: 'New Delhi, Delhi 110037',
      coordinates: { lat: 28.5562, lng: 77.1000 },
      type: 'airport' as const,
      code: 'DEL',
      terminal: 'Terminal 3',
      facilities: ['WiFi', 'Restaurants', 'Lounges', 'Duty Free', 'ATM', 'Currency Exchange', 'Medical Center'],
      transportOptions: ['Metro', 'Airport Express', 'Taxi', 'Bus', 'Car Rental'],
      nearbyAmenities: ['Hotels', 'Parking', 'Medical Center', 'Food Courts']
    }

    const arrivalAirport = {
      name: destInfo?.airportName || `${city} Airport`,
      address: destInfo ? `${destInfo.airportName}, ${city}` : `${city} Airport Complex`,
      coordinates: destInfo?.coordinates || { lat: 25.2744, lng: 82.9942 },
      type: 'airport' as const,
      code: destInfo?.airportCode || city.substring(0, 3).toUpperCase(),
      terminal: destInfo?.airportCode === 'GOI' ? 'Main Terminal' : destInfo?.airportCode === 'KUU' ? 'Domestic Terminal' : 'Main Terminal',
      facilities: ['WiFi', 'Restaurants', 'Car Rental', 'ATM', 'Currency Exchange'],
      transportOptions: ['Taxi', 'Bus', 'Car Rental', 'Hotel Shuttle'],
      nearbyAmenities: ['Hotels', 'Parking', 'Tourist Information']
    }

    // Get real flight duration and distance
    const flightDuration = transportInfo?.fromDelhi.flight.duration || '2h 30m'
    const flightDistance = transportInfo?.fromDelhi.flight.distance || '~1,200 km'
    const airlines = transportInfo?.fromDelhi.flight.airlines || ['Air India', 'IndiGo']
    const selectedAirline = airlines[0] || 'Air India'

    const hourlyBreakdown = [
      {
        time: '06:30',
        duration: '30m',
        activity: 'Airport Departure Preparation',
        location: 'Home/Hotel',
        type: 'departure_prep' as const,
        description: 'Final packing, document check, and departure to airport',
        requirements: ['Valid ID', 'Ticket confirmation', 'Luggage ready'],
        tips: ['Check flight status', 'Keep documents handy', 'Allow extra time for traffic'],
        status: 'required' as const,
        icon: '🏠',
        estimatedTime: '20-40 minutes'
      },
              {
        time: '07:00',
        duration: '1h',
        activity: 'Travel to Airport',
        location: 'Delhi to DEL Airport',
        type: 'ground_transport' as const,
        description: 'Journey from pickup location to Indira Gandhi International Airport via Airport Express Metro',
        tips: [
          'Airport Express Metro: Fastest option (₹60-150)',
          'Pre-paid taxi from Airport Taxi Booth',
          'Allow 90 minutes during peak hours',
          'Check Delhi Metro app for real-time updates'
        ],
        cost: transportInfo?.averageCosts.taxi.min || 400,
        status: 'required' as const,
        icon: '🚗',
        alternatives: [
          'Metro (₹60 - New Delhi to Airport)',
          'Airport Express (₹150 - 20 minutes)',
          'Uber/Ola (₹300-600)',
          'Pre-paid Taxi (₹400-800)'
        ]
      },
      {
        time: '08:00',
        duration: '45m',
        activity: `${selectedAirline} Check-in`,
        location: 'DEL Terminal 3',
        type: 'check_in' as const,
        description: `Complete ${selectedAirline} check-in process, baggage drop, and get boarding pass for ${destInfo?.airportCode || city.substring(0,3).toUpperCase()} flight`,
        requirements: [
          'Government Photo ID (Aadhaar/PAN/Passport)',
          `${selectedAirline} booking PNR`,
          'COVID vaccination certificate (if required)',
          'Baggage within 15kg limit'
        ],
        tips: [
          `Use ${selectedAirline} mobile app for web check-in`,
          'Arrive 2 hours early for domestic flights',
          'Keep boarding pass on phone + printout',
          'Tag your luggage with contact details'
        ],
        status: 'required' as const,
        icon: '✈️',
        estimatedTime: '30-60 minutes'
      },
      {
        time: '08:45',
        duration: '30m',
        activity: 'Security Check',
        location: 'DEL Security Area',
        type: 'security' as const,
        description: 'Security screening for passengers and carry-on luggage',
        requirements: ['Remove laptops/liquids', 'Metal detector screening', 'Baggage X-ray'],
        tips: ['Keep liquids in 100ml containers', 'Wear slip-off shoes', 'Remove belt and jacket'],
        status: 'required' as const,
        icon: '🔒',
        estimatedTime: '15-45 minutes'
      },
      {
        time: '09:15',
        duration: '30m',
        activity: 'Pre-boarding Wait',
        location: 'Departure Gate',
        type: 'layover' as const,
        description: 'Wait at departure gate, grab refreshments, final preparations',
        tips: ['Locate your gate early', 'Use airport WiFi', 'Visit restroom', 'Buy snacks if needed'],
        status: 'recommended' as const,
        icon: '⏳',
        alternatives: ['Visit lounge (₹1,500)', 'Duty-free shopping', 'Restaurant dining']
      },
      {
        time: '09:45',
        duration: '15m',
        activity: 'Boarding Process',
        location: 'Aircraft Gate',
        type: 'boarding' as const,
        description: 'Board the aircraft and locate your seat',
        requirements: ['Boarding pass', 'Photo ID', 'Carry-on luggage'],
        tips: ['Board according to your zone', 'Stow luggage efficiently', 'Keep essentials with you'],
        status: 'required' as const,
        icon: '🎫'
      },
      {
        time: '10:00',
        duration: flightDuration,
        activity: `${selectedAirline} Flight Journey`,
        location: `DEL → ${destInfo?.airportCode || city.substring(0,3).toUpperCase()}`,
        type: 'travel' as const,
        description: `${selectedAirline} flight from Delhi to ${destInfo?.airportName || city} (${flightDistance})`,
        tips: [
          'Stay hydrated - carry water bottle',
          'In-flight meal service available',
          'Entertainment system with movies/music',
          'Window seat for scenic mountain/landscape views'
        ],
        cost: 0,
        status: 'required' as const,
        icon: '✈️',
        estimatedTime: flightDuration
      },
      {
        time: '12:30',
        duration: '15m',
        activity: 'Aircraft Disembarkation',
        location: `${city} Airport`,
        type: 'arrival' as const,
        description: 'Exit aircraft and proceed to arrival area',
        tips: ['Wait for your row to deplane', 'Check for belongings', 'Follow arrival signs'],
        status: 'required' as const,
        icon: '🚪'
      },
      {
        time: '12:45',
        duration: '20m',
        activity: 'Baggage Collection',
        location: 'Baggage Claim Area',
        type: 'baggage' as const,
        description: 'Collect checked baggage from carousel',
        tips: ['Check baggage claim number', 'Keep baggage tags', 'Report missing luggage immediately'],
        status: 'required' as const,
        icon: '🧳',
        estimatedTime: '15-30 minutes'
      },
      {
        time: '13:05',
        duration: '25m',
        activity: 'Airport to Hotel Transfer',
        location: `${city} Airport to Hotel`,
        type: 'hotel_transfer' as const,
        description: 'Ground transportation from airport to accommodation',
        cost: 300,
        tips: ['Pre-book airport transfer', 'Confirm hotel address', 'Keep contact numbers handy'],
        status: 'required' as const,
        icon: '🚗',
        alternatives: ['Taxi (₹300-600)', 'Pre-paid cab', 'Hotel shuttle (if available)']
      }
    ]

    const recommendations = [
      {
        type: 'timing' as const,
        priority: 'high' as const,
        title: 'Arrive Early at Airport',
        description: 'Domestic flights require 2 hours, international flights need 3 hours before departure',
        applicableSteps: ['check_in', 'security'],
        timeRelevant: '2-3 hours before departure'
      },
      {
        type: 'documentation' as const,
        priority: 'high' as const,
        title: 'Keep Documents Ready',
        description: 'Have your ID, ticket confirmation, and any required permits easily accessible',
        applicableSteps: ['check_in', 'security', 'boarding'],
        timeRelevant: 'Throughout journey'
      },
      {
        type: 'comfort' as const,
        priority: 'medium' as const,
        title: 'Pack Smart for Flight',
        description: 'Keep essentials in carry-on, follow liquid restrictions, wear comfortable clothes',
        applicableSteps: ['security', 'travel'],
        timeRelevant: 'During packing and flight'
      },
      {
        type: 'cost' as const,
        priority: 'medium' as const,
        title: 'Transportation Options',
        description: 'Compare costs between Metro (₹60), Airport Express (₹150), and Taxi (₹400-800)',
        applicableSteps: ['ground_transport', 'hotel_transfer'],
        timeRelevant: 'Before travel'
      }
    ]

    // Calculate total journey time based on real flight duration
    const totalMinutes = 390 + this.parseDuration(flightDuration) // 6.5 hours base + actual flight time
    const totalHours = Math.floor(totalMinutes / 60)
    const remainingMinutes = totalMinutes % 60
    const totalJourneyTime = `${totalHours}h ${remainingMinutes}m`

    return {
      departureLocation: departureAirport,
      arrivalLocation: arrivalAirport,
      hourlyBreakdown,
      totalJourneyTime,
      distanceCovered: flightDistance,
      recommendations,
      journeyType: 'direct' as const
    }
  }

  private generateGroundTransportSchedule(city: string, mode: string): any {
    const hourlyBreakdown = [
      {
        time: '09:30',
        duration: '15m',
        activity: 'Hotel Checkout & Preparation',
        location: 'Current Hotel',
        type: 'departure_prep' as const,
        description: 'Complete hotel checkout and prepare for departure',
        requirements: ['Room key return', 'Bill settlement', 'Luggage ready'],
        tips: ['Check out early to avoid rush', 'Confirm bill details', 'Keep valuables secure'],
        status: 'required' as const,
        icon: '🏨'
      },
      {
        time: '09:45',
        duration: '15m',
        activity: 'Vehicle Arrival & Loading',
        location: 'Hotel Pickup Point',
        type: 'ground_transport' as const,
        description: 'Vehicle pickup and luggage loading',
        tips: ['Verify vehicle details', 'Check driver ID', 'Secure luggage properly'],
        status: 'required' as const,
        icon: '🚗'
      },
      {
        time: '10:00',
        duration: '1h 20m',
        activity: `Journey to ${city}`,
        location: `En route to ${city}`,
        type: 'travel' as const,
        description: 'Scenic journey with rest stops',
        tips: ['Stay hydrated', 'Enjoy scenery', 'Take photos at stops'],
        cost: 0,
        status: 'required' as const,
        icon: '🛣️',
        estimatedTime: '1 hour 20 minutes'
      },
      {
        time: '11:20',
        duration: '10m',
        activity: 'Hotel Arrival & Check-in',
        location: `${city} Hotel`,
        type: 'hotel_transfer' as const,
        description: 'Arrive at accommodation and begin check-in process',
        tips: ['Have booking confirmation ready', 'Check room amenities', 'Ask about local attractions'],
        status: 'required' as const,
        icon: '🏨'
      }
    ]

    return {
      departureLocation: {
        name: 'Previous Location Hotel',
        address: 'City Center',
        coordinates: { lat: 25.2744, lng: 82.9942 },
        type: 'hotel' as const,
        facilities: ['Reception', 'Parking', 'Wifi'],
        transportOptions: ['Taxi', 'Car'],
        nearbyAmenities: ['Restaurants', 'Shops']
      },
      arrivalLocation: {
        name: `${city} Hotel`,
        address: `${city} City Center`,
        coordinates: { lat: 25.2744, lng: 82.9942 },
        type: 'hotel' as const,
        facilities: ['Reception', 'Restaurant', 'Room Service'],
        transportOptions: ['Taxi', 'Auto', 'Walking'],
        nearbyAmenities: ['Attractions', 'Restaurants', 'Markets']
      },
      hourlyBreakdown,
      totalJourneyTime: '1h 50m',
      distanceCovered: '~85 km',
      recommendations: [
        {
          type: 'timing' as const,
          priority: 'medium' as const,
          title: 'Flexible Departure Time',
          description: 'Ground transport offers more flexibility in departure timing compared to flights',
          applicableSteps: ['departure_prep'],
          timeRelevant: 'As per convenience'
        }
      ],
      journeyType: 'direct' as const
    }
  }

  private generateCheckInInfo(): any {
    return {
      onlineCheckIn: {
        available: true,
        opensHoursBefore: 48,
        closesHoursBefore: 1,
        website: 'www.airindia.in',
        mobileApp: 'Air India Mobile App'
      },
      airportCheckIn: {
        opensHoursBefore: 3,
        closesMinutesBefore: 45,
        recommendedArrival: '2 hours before departure',
        counters: ['A1-A15', 'B1-B10']
      },
      requirements: ['Valid photo ID', 'Ticket confirmation/PNR', 'Passport (for international)'],
      documents: ['Aadhaar Card', 'PAN Card', 'Driving License', 'Passport'],
      specialServices: ['Wheelchair assistance', 'Special meals', 'Extra baggage']
    }
  }

  private generateBaggageInfo(): any {
    return {
      allowance: {
        checkedBags: { weight: '15 kg', dimensions: '158 cm', count: 1 },
        carryOn: { weight: '7 kg', dimensions: '55x35x25 cm', count: 1 },
        personalItem: { weight: '2 kg', dimensions: '40x30x15 cm', count: 1 }
      },
      restrictions: [
        'No liquids above 100ml in carry-on',
        'No sharp objects in carry-on',
        'Electronics must be easily accessible',
        'Lithium batteries only in carry-on'
      ],
      additionalCosts: [
        { weight: '5 kg extra', cost: 750 },
        { weight: '10 kg extra', cost: 1500 }
      ],
      tips: [
        'Pack liquids in checked baggage',
        'Keep valuables in carry-on',
        'Label luggage clearly',
        'Take photos of luggage contents'
      ],
      checkInProcess: [
        'Present documents at counter',
        'Place baggage on scale',
        'Receive baggage tag',
        'Keep baggage claim receipt'
      ]
    }
  }
}

// Export singleton instance
export const packageService = new UnifiedPackageService()
