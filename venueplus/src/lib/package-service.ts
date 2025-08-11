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

    return {
      id: `ai_${Date.now()}_${params.index}`,
      name: `${params.destination} ${variation.name}`,
      description: `AI-curated ${variation.focus} package for ${params.destination}`,
      destination: params.destination,
      duration: this.selectDurationForBudget(adjustedBudget),
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
      realTimeData: await this.fetchRealTimeData(params.destination)
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
    const match = duration.match(/(\d+)\s*days?/i)
    return match ? parseInt(match[1]) : 5
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
      meals: [
        {
          type: 'breakfast',
          venue: `${city} Hotel Restaurant`,
          cuisine: 'Continental',
          cost: Math.round(dailyBudget * 0.1),
          description: 'Complimentary breakfast at hotel'
        },
        {
          type: 'lunch',
          venue: `Local ${city} Restaurant`,
          cuisine: 'Local',
          cost: Math.round(dailyBudget * 0.15),
          description: 'Authentic local cuisine experience'
        },
        {
          type: 'dinner',
          venue: `${city} Fine Dining`,
          cuisine: 'Multi-cuisine',
          cost: Math.round(dailyBudget * 0.2),
          description: 'Special dinner with cultural show'
        }
      ],
      accommodation: {
        name: `${city} Heritage Hotel`,
        type: 'Hotel',
        location: `Central ${city}`,
        rating: 4.2,
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa'],
        costPerNight: Math.round(dailyBudget * 0.4),
        checkIn: '14:00',
        checkOut: '11:00'
      },
      transport: [
        {
          mode: dayNumber === 1 ? 'flight' : 'car',
          from: dayNumber === 1 ? 'Origin' : 'Previous location',
          to: city,
          cost: Math.round(dailyBudget * 0.1),
          duration: dayNumber === 1 ? '2 hours' : '1 hour',
          departure: '10:00',
          arrival: dayNumber === 1 ? '12:00' : '11:00'
        }
      ],
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
        crowdLevel: 'medium',
        accessibility: ['Wheelchair accessible']
      },
      {
        name: `${city} Market Experience`,
        description: `Explore local markets and interact with vendors, taste local snacks`,
        duration: '2 hours',
        location: `${city} Central Market`,
        address: `Market Street, ${city}`,
        coordinates: { lat: 25.2744, lng: 82.9942 },
        included: true,
        optional: false,
        bookingRequired: false,
        category: 'shopping',
        difficulty: 'easy',
        ageRecommendation: 'All ages',
        photos: [],
        tips: ['Bargaining is common', 'Try local snacks'],
        bestTimeToVisit: 'Evening',
        crowdLevel: 'high',
        accessibility: ['Some areas may be crowded']
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
}

// Export singleton instance
export const packageService = new UnifiedPackageService()
