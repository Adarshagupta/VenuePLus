import { GoogleGenerativeAI } from '@google/generative-ai'
import { 
  AIGeneratedPackage, 
  PackageCategory, 
  PackageItinerary,
  AIFeature,
  Customization,
  RealTimeData
} from './package-types'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyBcTnpoAlQ7kz6CZh7ONr9nSLwYhn4yGi8')
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro',
  generationConfig: {
    temperature: 0.8,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 4096,
  }
})

export interface PackageGenerationRequest {
  destination: string
  budget: number
  duration: string
  travelers: number
  category: PackageCategory
  interests: string[]
  travelStyle: 'budget' | 'balanced' | 'luxury'
  startDate?: Date
  specialRequirements?: string[]
}

export interface PackageGenerationOptions {
  includeRealTimeData: boolean
  generateMultipleVariations: boolean
  optimizeForBudget: boolean
  includeAlternatives: boolean
  customizationLevel: 'basic' | 'advanced' | 'expert'
}

export class AIPackageGenerator {
  private destinationCache = new Map<string, any>()
  private generationHistory = new Map<string, AIGeneratedPackage[]>()

  /**
   * Generate AI-powered travel packages based on user requirements
   */
  async generatePackages(
    request: PackageGenerationRequest,
    options: PackageGenerationOptions = {
      includeRealTimeData: true,
      generateMultipleVariations: true,
      optimizeForBudget: true,
      includeAlternatives: true,
      customizationLevel: 'advanced'
    }
  ): Promise<AIGeneratedPackage[]> {
    console.log('🤖 Starting AI package generation...')
    
    try {
      // Step 1: Analyze destination and gather context
      const destinationContext = await this.analyzeDestination(request.destination)
      
      // Step 2: Generate base package variations
      const basePackages = await this.generateBasePackageVariations(request, destinationContext)
      
      // Step 3: Enhance with real-time data if requested
      let enhancedPackages = basePackages
      if (options.includeRealTimeData) {
        enhancedPackages = await this.enhanceWithRealTimeData(basePackages, request)
      }
      
      // Step 4: Add customization options
      const customizedPackages = await this.addCustomizationOptions(enhancedPackages, request, options)
      
      // Step 5: Optimize for user preferences
      const optimizedPackages = await this.optimizeForUserPreferences(customizedPackages, request)
      
      console.log(`✅ Generated ${optimizedPackages.length} AI packages`)
      return optimizedPackages
      
    } catch (error) {
      console.error('❌ Error generating AI packages:', error)
      return this.generateFallbackPackages(request)
    }
  }

  /**
   * Analyze destination to understand attractions, culture, logistics
   */
  private async analyzeDestination(destination: string): Promise<any> {
    const cacheKey = destination.toLowerCase()
    
    if (this.destinationCache.has(cacheKey)) {
      return this.destinationCache.get(cacheKey)
    }

    try {
      const prompt = `
        Analyze ${destination} as a travel destination and provide comprehensive information in JSON format:
        
        {
          "overview": "Brief destination overview",
          "bestTimeToVisit": "Optimal travel period with reasoning",
          "topAttractions": [
            {
              "name": "Attraction name",
              "category": "historical/natural/cultural/adventure/religious",
              "duration": "Recommended visit duration",
              "cost": "Estimated cost in INR",
              "description": "Brief description",
              "mustVisit": true/false
            }
          ],
          "localCuisine": [
            {
              "dish": "Local dish name",
              "description": "What it is",
              "whereToFind": "Best places to try",
              "cost": "Average cost in INR"
            }
          ],
          "accommodation": {
            "luxury": {"priceRange": "Per night range", "recommendations": ["Hotel names"]},
            "midRange": {"priceRange": "Per night range", "recommendations": ["Hotel names"]},
            "budget": {"priceRange": "Per night range", "recommendations": ["Hotel names"]}
          },
          "transportation": {
            "gettingThere": ["Flight", "Train", "Bus options"],
            "localTransport": ["Metro", "Taxi", "Auto", "Bus"],
            "costEstimates": {"flight": "INR amount", "localDaily": "INR amount"}
          },
          "culture": {
            "language": "Primary language(s)",
            "customs": ["Important customs"],
            "etiquette": ["Do's and don'ts"],
            "festivals": ["Major festivals"]
          },
          "weather": {
            "summer": "Apr-Jun condition",
            "monsoon": "Jul-Sep condition", 
            "winter": "Oct-Mar condition"
          },
          "budgetEstimates": {
            "budget": "Daily cost for budget traveler",
            "midRange": "Daily cost for mid-range traveler",
            "luxury": "Daily cost for luxury traveler"
          },
          "hiddenGems": [
            {
              "name": "Off-beat place",
              "description": "Why it's special",
              "accessibility": "How to reach",
              "cost": "Entry/visit cost"
            }
          ],
          "travelTips": ["Practical tips"],
          "safety": ["Safety considerations"]
        }
        
        Provide authentic, current information about ${destination}.
      `

      const result = await model.generateContent(prompt)
      const response = result.response.text()
      
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const destinationData = JSON.parse(jsonMatch[0])
        this.destinationCache.set(cacheKey, destinationData)
        return destinationData
      }
      
    } catch (error) {
      console.warn('Failed to analyze destination with AI:', error)
    }

    // Fallback destination data
    return this.getFallbackDestinationData(destination)
  }

  /**
   * Generate multiple package variations based on different themes
   */
  private async generateBasePackageVariations(
    request: PackageGenerationRequest,
    destinationContext: any
  ): Promise<AIGeneratedPackage[]> {
    const variations = this.getPackageVariations(request.category, request.travelStyle)
    const packages: AIGeneratedPackage[] = []

    for (const variation of variations) {
      try {
        const packageData = await this.generateSinglePackage(request, destinationContext, variation)
        packages.push(packageData)
      } catch (error) {
        console.warn(`Failed to generate ${variation.name} package:`, error)
      }
    }

    return packages
  }

  /**
   * Generate a single AI package with detailed itinerary
   */
  private async generateSinglePackage(
    request: PackageGenerationRequest,
    destinationContext: any,
    variation: any
  ): Promise<AIGeneratedPackage> {
    const prompt = this.createPackageGenerationPrompt(request, destinationContext, variation)
    
    try {
      const result = await model.generateContent(prompt)
      const response = result.response.text()
      
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response')
      }
      
      const aiPackageData = JSON.parse(jsonMatch[0])
      
      const durationDays = this.extractDaysFromDuration(request.duration)
      
      return {
        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: aiPackageData.name || `${request.destination} ${variation.name}`,
        description: aiPackageData.description || `AI-generated ${variation.theme} package`,
        destination: request.destination,
        duration: request.duration,
        price: this.adjustPriceForBudget(aiPackageData.estimatedCost || request.budget, request.budget),
        currency: 'INR',
        source: 'ai_generated',
        type: 'complete_package',
        category: request.category,
        rating: 4.3 + (Math.random() * 0.5), // 4.3-4.8 range
        reviewCount: 25 + Math.floor(Math.random() * 100),
        imageUrl: this.getDestinationImage(request.destination, variation.theme),
        provider: 'VenuePlus AI',
        createdAt: new Date(),
        updatedAt: new Date(),
        prompt: prompt.substring(0, 200) + '...',
        generationModel: 'gemini-1.5-pro',
        confidence: this.calculateGenerationConfidence(aiPackageData, destinationContext),
        aiFeatures: this.generateAIFeatures(variation),
        customizations: this.generateCustomizations(request),
        realTimeData: undefined, // Will be added later if requested
        summary: {
          totalDays: durationDays,
          cities: this.getCitiesForDestination(request.destination),
          totalActivities: durationDays * 2,
          totalMeals: durationDays * 3,
          accommodationType: this.getAccommodationTypeForCategory(request.category),
          transportModes: this.getTransportModes(request.destination)
        },
        itinerary: aiPackageData.itinerary || this.generateAISampleItinerary(request, durationDays, variation)
      }
      
    } catch (error) {
      console.error('Error generating single package:', error)
      return this.createFallbackPackage(request, variation)
    }
  }

  /**
   * Create comprehensive prompt for package generation
   */
  private createPackageGenerationPrompt(
    request: PackageGenerationRequest,
    destinationContext: any,
    variation: any
  ): string {
    return `
      You are an expert travel consultant specializing in ${request.destination}. Create a comprehensive ${variation.name} travel package.

      TRAVEL REQUIREMENTS:
      - Destination: ${request.destination}
      - Duration: ${request.duration}
      - Budget: ₹${request.budget.toLocaleString()}
      - Travelers: ${request.travelers}
      - Travel Style: ${request.travelStyle}
      - Package Theme: ${variation.theme}
      - Interests: ${request.interests.join(', ')}
      ${request.specialRequirements ? `- Special Requirements: ${request.specialRequirements.join(', ')}` : ''}

      DESTINATION CONTEXT:
      ${JSON.stringify(destinationContext, null, 2)}

      PACKAGE VARIATION FOCUS:
      - Name: ${variation.name}
      - Theme: ${variation.theme}
      - Focus Areas: ${variation.focusAreas.join(', ')}
      - Special Features: ${variation.specialFeatures.join(', ')}

      Generate a detailed travel package in JSON format:
      {
        "name": "Package name with destination",
        "description": "Compelling 2-3 sentence description highlighting unique aspects",
        "estimatedCost": total_package_cost_number,
        "highlights": ["Key package highlights"],
        "itinerary": {
          "days": [
            {
              "day": 1,
              "title": "Day theme/title",
              "activities": [
                {
                  "time": "09:00",
                  "activity": "Activity name",
                  "location": "Specific location",
                  "duration": "2 hours",
                  "cost": cost_in_inr,
                  "description": "Activity description",
                  "type": "sightseeing/cultural/adventure/food/shopping"
                }
              ],
              "meals": [
                {
                  "type": "breakfast/lunch/dinner",
                  "restaurant": "Restaurant name",
                  "cuisine": "Cuisine type",
                  "cost": cost_in_inr,
                  "speciality": "Signature dish"
                }
              ],
              "accommodation": {
                "name": "Hotel/stay name",
                "type": "Hotel/Resort/Guesthouse",
                "location": "Area/neighborhood",
                "amenities": ["WiFi", "Pool", "Spa"],
                "costPerNight": cost_in_inr
              },
              "transportation": [
                {
                  "mode": "Car/Bus/Flight/Train",
                  "from": "Starting point",
                  "to": "Destination",
                  "cost": cost_in_inr,
                  "duration": "travel time"
                }
              ],
              "estimatedDailyCost": daily_total_cost
            }
          ]
        },
        "inclusions": [
          "What's included in the package"
        ],
        "exclusions": [
          "What's not included"
        ],
        "packageFeatures": [
          "Unique selling points of this package"
        ],
        "bestFor": [
          "Type of travelers this suits"
        ],
        "seasonalNotes": "Best time to book this package",
        "bookingAdvice": "Tips for booking and preparation",
        "alternatives": [
          {
            "name": "Alternative option name",
            "difference": "How it differs",
            "costDifference": "Price difference"
          }
        ],
        "localExperiences": [
          {
            "name": "Local experience name",
            "description": "What makes it authentic",
            "cost": cost_in_inr,
            "duration": "time needed"
          }
        ]
      }

      IMPORTANT GUIDELINES:
      1. Stay within the budget of ₹${request.budget.toLocaleString()}
      2. Focus on ${variation.theme} experiences
      3. Include realistic costs for ${request.destination}
      4. Provide authentic local experiences
      5. Consider ${request.travelStyle} travel style
      6. Include practical transportation and accommodation
      7. Balance must-see attractions with hidden gems
      8. Ensure activities match the interests: ${request.interests.join(', ')}
    `
  }

  /**
   * Get package variations based on category and style
   */
  private getPackageVariations(category: PackageCategory, travelStyle: string): any[] {
    const baseVariations = [
      {
        name: 'Cultural Explorer',
        theme: 'cultural immersion',
        focusAreas: ['heritage sites', 'museums', 'traditional experiences'],
        specialFeatures: ['local guide', 'cultural workshops', 'historical tours']
      },
      {
        name: 'Adventure Seeker',
        theme: 'adventure and activities',
        focusAreas: ['outdoor activities', 'adventure sports', 'nature experiences'],
        specialFeatures: ['activity equipment', 'experienced guides', 'safety measures']
      },
      {
        name: 'Culinary Journey',
        theme: 'food and gastronomy',
        focusAreas: ['local cuisine', 'food tours', 'cooking experiences'],
        specialFeatures: ['food tastings', 'cooking classes', 'restaurant reservations']
      },
      {
        name: 'Wellness Retreat',
        theme: 'relaxation and wellness',
        focusAreas: ['spa treatments', 'yoga sessions', 'peaceful locations'],
        specialFeatures: ['spa access', 'wellness activities', 'healthy dining']
      },
      {
        name: 'Photography Tour',
        theme: 'photography and sightseeing',
        focusAreas: ['scenic locations', 'golden hour spots', 'unique perspectives'],
        specialFeatures: ['photography guide', 'best timing', 'photo stops']
      }
    ]

    // Filter and adjust based on category and style
    let variations = baseVariations

    if (category === 'family') {
      variations = variations.map(v => ({
        ...v,
        specialFeatures: [...v.specialFeatures, 'family-friendly activities', 'child-safe options']
      }))
    }

    if (category === 'luxury') {
      variations = variations.map(v => ({
        ...v,
        specialFeatures: [...v.specialFeatures, 'VIP access', 'premium services', 'luxury amenities']
      }))
    }

    if (category === 'budget') {
      variations = variations.map(v => ({
        ...v,
        specialFeatures: [...v.specialFeatures, 'cost-effective options', 'value experiences']
      }))
    }

    return variations.slice(0, 3) // Return top 3 variations
  }

  /**
   * Enhance packages with real-time data
   */
  private async enhanceWithRealTimeData(
    packages: AIGeneratedPackage[],
    request: PackageGenerationRequest
  ): Promise<AIGeneratedPackage[]> {
    console.log('🌐 Enhancing packages with real-time data...')

    return Promise.all(packages.map(async (pkg) => {
      try {
        const realTimeData = await this.fetchRealTimeData(request.destination, request.startDate)
        return {
          ...pkg,
          realTimeData
        }
      } catch (error) {
        console.warn('Failed to fetch real-time data for package:', error)
        return pkg
      }
    }))
  }

  /**
   * Add customization options to packages
   */
  private async addCustomizationOptions(
    packages: AIGeneratedPackage[],
    request: PackageGenerationRequest,
    options: PackageGenerationOptions
  ): Promise<AIGeneratedPackage[]> {
    return packages.map(pkg => ({
      ...pkg,
      customizations: [
        ...pkg.customizations,
        ...this.generateAdvancedCustomizations(request, options.customizationLevel)
      ]
    }))
  }

  /**
   * Optimize packages for user preferences
   */
  private async optimizeForUserPreferences(
    packages: AIGeneratedPackage[],
    request: PackageGenerationRequest
  ): Promise<AIGeneratedPackage[]> {
    // Sort by relevance to user preferences
    return packages.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, request)
      const bScore = this.calculateRelevanceScore(b, request)
      return bScore - aScore
    })
  }

  // Helper Methods
  private adjustPriceForBudget(estimatedCost: number, targetBudget: number): number {
    // Ensure price is within 20% of target budget
    const minPrice = targetBudget * 0.8
    const maxPrice = targetBudget * 1.2
    return Math.max(minPrice, Math.min(maxPrice, estimatedCost))
  }

  private getDestinationImage(destination: string, theme: string): string {
    const images = {
      'cultural': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'adventure': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'food': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'wellness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'photography': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
    return images[theme as keyof typeof images] || images['cultural']
  }

  private calculateGenerationConfidence(packageData: any, destinationContext: any): number {
    let confidence = 0.8 // Base confidence

    if (packageData.itinerary?.days?.length > 0) confidence += 0.05
    if (packageData.inclusions?.length > 3) confidence += 0.05
    if (destinationContext.topAttractions?.length > 5) confidence += 0.05
    if (packageData.localExperiences?.length > 0) confidence += 0.05

    return Math.min(0.95, confidence)
  }

  private generateAIFeatures(variation: any): AIFeature[] {
    return [
      {
        name: 'Smart Itinerary Planning',
        description: 'AI-optimized daily schedules based on location and preferences',
        category: 'optimization',
        benefit: 'Maximize time efficiency and minimize travel between locations'
      },
      {
        name: 'Dynamic Pricing',
        description: 'Real-time price optimization based on availability and demand',
        category: 'optimization',
        benefit: 'Get the best possible rates for your budget'
      },
      {
        name: 'Local Insights',
        description: `AI-curated ${variation.theme} experiences from local knowledge`,
        category: 'insights',
        benefit: 'Discover authentic experiences that match your interests'
      },
      {
        name: 'Adaptive Recommendations',
        description: 'Personalized suggestions based on your travel style and preferences',
        category: 'personalization',
        benefit: 'Tailored recommendations that evolve with your preferences'
      }
    ]
  }

  private generateCustomizations(request: PackageGenerationRequest): Customization[] {
    const customizations: Customization[] = []

    // Budget customizations
    customizations.push({
      type: 'budget',
      value: request.travelStyle,
      impact: `Package optimized for ${request.travelStyle} travel style`
    })

    // Interest-based customizations
    request.interests.forEach(interest => {
      customizations.push({
        type: 'interest',
        value: interest,
        impact: `Activities and experiences focused on ${interest}`
      })
    })

    // Group size customizations
    if (request.travelers > 1) {
      customizations.push({
        type: 'group_size',
        value: `${request.travelers} travelers`,
        impact: 'Accommodations and activities suitable for group travel'
      })
    }

    return customizations
  }

  private generateAdvancedCustomizations(
    request: PackageGenerationRequest,
    level: string
  ): Customization[] {
    const advanced: Customization[] = []

    if (level === 'advanced' || level === 'expert') {
      advanced.push({
        type: 'pace',
        value: 'moderate',
        impact: 'Balanced itinerary with rest time between activities'
      })

      advanced.push({
        type: 'dietary',
        value: 'flexible',
        impact: 'Restaurant recommendations include various dietary options'
      })
    }

    if (level === 'expert') {
      advanced.push({
        type: 'accessibility',
        value: 'standard',
        impact: 'Venues and activities accessible to all travelers'
      })
    }

    return advanced
  }

  private async fetchRealTimeData(destination: string, startDate?: Date): Promise<RealTimeData> {
    // In production, this would fetch real weather, events, pricing data
    return {
      weatherForecast: [],
      currentEvents: [],
      priceFluctuations: [],
      crowdLevels: [],
      lastUpdated: new Date()
    }
  }

  private calculateRelevanceScore(pkg: AIGeneratedPackage, request: PackageGenerationRequest): number {
    let score = 0

    // Budget alignment
    const budgetDiff = Math.abs(pkg.price - request.budget) / request.budget
    score += (1 - budgetDiff) * 0.3

    // Category match
    if (pkg.category === request.category) score += 0.2

    // Interest alignment
    const interestMatches = request.interests.filter(interest =>
      pkg.name.toLowerCase().includes(interest.toLowerCase()) ||
      pkg.description.toLowerCase().includes(interest.toLowerCase())
    ).length
    score += (interestMatches / request.interests.length) * 0.3

    // AI confidence
    score += pkg.confidence * 0.2

    return score
  }

  private getFallbackDestinationData(destination: string): any {
    return {
      overview: `Popular destination in India`,
      bestTimeToVisit: 'October to March for pleasant weather',
      topAttractions: [
        { name: 'Local landmarks', category: 'cultural', duration: '2 hours', cost: '500', mustVisit: true }
      ],
      budgetEstimates: {
        budget: '2000-3000 per day',
        midRange: '4000-6000 per day',
        luxury: '8000+ per day'
      }
    }
  }

  private createFallbackPackage(request: PackageGenerationRequest, variation: any): AIGeneratedPackage {
    const durationDays = this.extractDaysFromDuration(request.duration)
    
    return {
      id: `ai_fallback_${Date.now()}`,
      name: `${request.destination} ${variation.name}`,
      description: `Explore ${request.destination} with this ${variation.theme} package`,
      destination: request.destination,
      duration: request.duration,
      price: request.budget,
      currency: 'INR',
      source: 'ai_generated',
      type: 'complete_package',
      category: request.category,
      rating: 4.0,
      reviewCount: 25,
      imageUrl: this.getDestinationImage(request.destination, variation.theme),
      provider: 'VenuePlus AI',
      createdAt: new Date(),
      updatedAt: new Date(),
      prompt: 'Fallback package generation',
      generationModel: 'gemini-1.5-pro',
      confidence: 0.6,
      aiFeatures: this.generateAIFeatures(variation),
      customizations: this.generateCustomizations(request),
      summary: {
        totalDays: durationDays,
        cities: this.getCitiesForDestination(request.destination),
        totalActivities: durationDays * 2,
        totalMeals: durationDays * 3,
        accommodationType: this.getAccommodationTypeForCategory(request.category),
        transportModes: this.getTransportModes(request.destination)
      },
      itinerary: this.generateAISampleItinerary(request, durationDays, variation)
    }
  }

  private generateFallbackPackages(request: PackageGenerationRequest): AIGeneratedPackage[] {
    const variations = this.getPackageVariations(request.category, request.travelStyle)
    return variations.map(variation => this.createFallbackPackage(request, variation))
  }

  // Helper methods for itinerary generation
  private extractDaysFromDuration(duration: string): number {
    const match = duration.match(/(\d+)\s*days?/i)
    return match ? parseInt(match[1]) : 5
  }

  private getCitiesForDestination(destination: string): string[] {
    const destinationCities: { [key: string]: string[] } = {
      'Goa': ['Panaji', 'Margao', 'Vasco', 'Mapusa'],
      'Kerala': ['Kochi', 'Munnar', 'Alleppey', 'Thekkady', 'Wayanad'],
      'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar'],
      'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Kasol'],
      'Tamil Nadu': ['Chennai', 'Madurai', 'Ooty', 'Kodaikanal', 'Pondicherry'],
      'Karnataka': ['Bangalore', 'Mysore', 'Hampi', 'Coorg'],
      'Uttarakhand': ['Dehradun', 'Rishikesh', 'Nainital', 'Mussoorie']
    }
    return destinationCities[destination] || [destination]
  }

  private getAccommodationTypeForCategory(category: string): string {
    const accommodationMap: { [key: string]: string } = {
      'luxury': 'Luxury Resort',
      'budget': 'Budget Hotel',
      'mid_range': 'Mid-range Hotel',
      'adventure': 'Adventure Lodge',
      'family': 'Family Resort',
      'romantic': 'Boutique Hotel'
    }
    return accommodationMap[category] || 'Hotel'
  }

  private getTransportModes(destination: string): string[] {
    const transportMap: { [key: string]: string[] } = {
      'Goa': ['Flight', 'Train', 'Bus', 'Taxi'],
      'Kerala': ['Flight', 'Train', 'Houseboat', 'Car'],
      'Rajasthan': ['Flight', 'Train', 'Camel', 'Car'],
      'Himachal Pradesh': ['Flight', 'Bus', 'Car', 'Toy Train'],
      'Kashmir': ['Flight', 'Shikara', 'Car', 'Cable Car']
    }
    return transportMap[destination] || ['Flight', 'Car', 'Train']
  }

  private generateAISampleItinerary(request: PackageGenerationRequest, days: number, variation: any): any {
    const cities = this.getCitiesForDestination(request.destination)
    const dailyBudget = request.budget / days

    return {
      days: Array.from({ length: days }, (_, index) => 
        this.generateAISampleDay(index + 1, cities[index % cities.length], dailyBudget, request, variation)
      ),
      totalCost: request.budget,
      included: this.getIncludedItems(request.category),
      excluded: ['Personal expenses', 'Travel insurance', 'Optional activities'],
      cancellationPolicy: 'Free cancellation up to 48 hours before departure',
      highlights: this.generateHighlights(request.destination, variation.theme),
      overview: `AI-curated ${variation.theme} experience in ${request.destination} designed for ${request.travelStyle} travelers`,
      bestTimeToVisit: this.getBestTimeToVisit(request.destination),
      difficulty: this.getDifficultyLevel(request.category, variation.theme),
      groupSize: { min: 1, max: request.travelers * 2 }
    }
  }

  private generateAISampleDay(dayNumber: number, city: string, dailyBudget: number, request: PackageGenerationRequest, variation: any): any {
    const date = new Date(request.startDate || new Date())
    date.setDate(date.getDate() + dayNumber - 1)

    const activities = this.generateThemeBasedActivities(city, variation.theme, request.interests)
    const timeline = this.generateAITimeline(activities, dayNumber)

    return {
      day: dayNumber,
      date: date.toISOString().split('T')[0],
      city,
      theme: this.getAIDayTheme(dayNumber, variation.theme, request.destination),
      weather: this.generateWeatherInfo(request.destination, date),
      activities,
      meals: this.generateMeals(city, request.category, dailyBudget),
      accommodation: this.generateAccommodation(city, request.category, dailyBudget),
      transport: this.generateTransport(dayNumber, city, request.category),
      freeTime: this.calculateFreeTime(activities.length),
      notes: this.generateDayNotes(city, variation.theme),
      estimatedCost: Math.round(dailyBudget),
      walkingDistance: this.estimateWalkingDistance(activities.length),
      highlights: this.generateDayHighlights(city, variation.theme),
      photos: [],
      timeline
    }
  }

  private generateThemeBasedActivities(city: string, theme: string, interests: string[]): any[] {
    const activityTemplates = {
      'cultural immersion': [
        {
          name: `${city} Heritage Tour`,
          category: 'cultural',
          description: 'Explore historical landmarks and cultural sites',
          duration: '3 hours'
        },
        {
          name: `Local Art Workshop`,
          category: 'cultural',
          description: 'Learn traditional arts and crafts',
          duration: '2 hours'
        }
      ],
      'adventure and activities': [
        {
          name: `${city} Adventure Trail`,
          category: 'adventure',
          description: 'Exciting outdoor adventure activities',
          duration: '4 hours'
        },
        {
          name: `Nature Exploration`,
          category: 'nature',
          description: 'Discover local flora and fauna',
          duration: '3 hours'
        }
      ],
      'food and gastronomy': [
        {
          name: `${city} Food Walk`,
          category: 'food',
          description: 'Taste authentic local cuisine',
          duration: '3 hours'
        },
        {
          name: `Cooking Class`,
          category: 'food',
          description: 'Learn to cook traditional dishes',
          duration: '2.5 hours'
        }
      ]
    }

    const selectedTemplate = activityTemplates[theme as keyof typeof activityTemplates] || activityTemplates['cultural immersion']
    
    return selectedTemplate.map((template, index) => ({
      ...template,
      location: `${city} ${template.category === 'cultural' ? 'Heritage District' : 'Activity Center'}`,
      address: `${template.category} Area, ${city}`,
      coordinates: { lat: 25.2744 + (index * 0.01), lng: 82.9942 + (index * 0.01) },
      included: true,
      optional: false,
      additionalCost: 0,
      bookingRequired: template.category === 'adventure',
      difficulty: template.category === 'adventure' ? 'moderate' : 'easy',
      ageRecommendation: 'All ages',
      photos: [],
      tips: [`Best time: ${template.category === 'food' ? 'Evening' : 'Morning'}`, 'Carry water'],
      bestTimeToVisit: template.category === 'food' ? 'Evening' : 'Morning',
      crowdLevel: 'medium' as const,
      accessibility: ['Wheelchair accessible'],
      cost: Math.round(Math.random() * 2000 + 500)
    }))
  }

  // Additional helper methods for comprehensive data generation
  private generateAITimeline(activities: any[], dayNumber: number): any[] {
    const timeline = [
      {
        time: '08:00',
        activity: 'Breakfast',
        type: 'meal',
        location: 'Hotel Restaurant',
        duration: '1 hour',
        cost: 600,
        icon: '🍳',
        description: 'Start your day with a nutritious breakfast'
      }
    ]

    let currentTime = 9.5 // 9:30 AM
    activities.forEach((activity, index) => {
      const hours = Math.floor(currentTime)
      const minutes = (currentTime % 1) * 60
      const timeString = `${hours.toString().padStart(2, '0')}:${Math.round(minutes).toString().padStart(2, '0')}`
      
      timeline.push({
        time: timeString,
        activity: activity.name,
        type: 'activity',
        location: activity.location,
        duration: activity.duration,
        cost: activity.cost,
        icon: this.getActivityIcon(activity.category),
        description: activity.description
      })

      currentTime += parseFloat(activity.duration) + 0.5 // Activity duration + 30 min break
    })

    return timeline
  }

  private getActivityIcon(category: string): string {
    const icons = {
      'cultural': '🏛️',
      'adventure': '🏔️',
      'nature': '🌿',
      'food': '🍽️',
      'shopping': '🛍️'
    }
    return icons[category as keyof typeof icons] || '📍'
  }

  private generateWeatherInfo(destination: string, date: Date): any {
    // Simplified weather based on destination and season
    const month = date.getMonth()
    const isWinter = month >= 10 || month <= 2
    const isSummer = month >= 3 && month <= 6
    
    return {
      condition: isWinter ? 'Pleasant' : isSummer ? 'Hot' : 'Moderate',
      temperature: {
        min: isWinter ? 15 : isSummer ? 28 : 22,
        max: isWinter ? 25 : isSummer ? 38 : 32
      },
      recommendation: isWinter ? 'Light woolens recommended' : isSummer ? 'Cotton clothes, sunscreen essential' : 'Light clothing'
    }
  }

  private getIncludedItems(category: string): string[] {
    const baseItems = ['Accommodation', 'Daily breakfast', 'Transportation', 'Sightseeing']
    const categoryItems = {
      'luxury': [...baseItems, 'Welcome drinks', 'Spa access', 'Concierge service'],
      'adventure': [...baseItems, 'Equipment rental', 'Professional guide', 'Safety gear'],
      'family': [...baseItems, 'Child-friendly activities', 'Family rooms', 'Kid meals'],
      'cultural': [...baseItems, 'Cultural guide', 'Museum entries', 'Heritage walks']
    }
    return categoryItems[category as keyof typeof categoryItems] || baseItems
  }

  private generateHighlights(destination: string, theme: string): string[] {
    return [
      `Discover the essence of ${destination}`,
      `${theme} focused experiences`,
      'AI-optimized schedule',
      'Local expert guidance',
      'Authentic experiences'
    ]
  }

  private getBestTimeToVisit(destination: string): string {
    const seasonMap: { [key: string]: string } = {
      'Goa': 'November to March',
      'Kerala': 'October to March',
      'Rajasthan': 'October to March',
      'Himachal Pradesh': 'March to June, September to November',
      'Kashmir': 'March to October'
    }
    return seasonMap[destination] || 'October to March'
  }

  private getDifficultyLevel(category: string, theme: string): 'easy' | 'moderate' | 'challenging' {
    if (theme.includes('adventure') || category === 'adventure') return 'moderate'
    if (category === 'luxury' || theme.includes('relaxation')) return 'easy'
    return 'easy'
  }

  private generateMeals(city: string, category: string, dailyBudget: number): any[] {
    const mealTypes = ['breakfast', 'lunch', 'dinner']
    return mealTypes.map(type => ({
      type,
      venue: `${city} ${type === 'breakfast' ? 'Hotel' : type === 'lunch' ? 'Local' : 'Fine Dining'} Restaurant`,
      cuisine: type === 'breakfast' ? 'Continental' : type === 'lunch' ? 'Local' : 'Multi-cuisine',
      cost: Math.round(dailyBudget * (type === 'breakfast' ? 0.1 : type === 'lunch' ? 0.15 : 0.2)),
      description: `${type === 'breakfast' ? 'Complimentary' : 'Authentic'} ${type} experience`
    }))
  }

  private generateAccommodation(city: string, category: string, dailyBudget: number): any {
    const accommodationTypes = {
      'luxury': 'Luxury Resort',
      'budget': 'Comfortable Hotel',
      'mid_range': 'Premium Hotel'
    }

    return {
      name: `${city} ${accommodationTypes[category as keyof typeof accommodationTypes] || 'Hotel'}`,
      type: 'Hotel',
      location: `Central ${city}`,
      rating: category === 'luxury' ? 4.8 : category === 'budget' ? 3.8 : 4.3,
      amenities: category === 'luxury' 
        ? ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge'] 
        : ['WiFi', 'Restaurant', 'Room Service'],
      costPerNight: Math.round(dailyBudget * 0.4),
      checkIn: '14:00',
      checkOut: '11:00'
    }
  }

  private generateTransport(dayNumber: number, city: string, category: string): any[] {
    return [{
      mode: dayNumber === 1 ? 'flight' : category === 'luxury' ? 'private_car' : 'car',
      from: dayNumber === 1 ? 'Origin City' : 'Previous Location',
      to: city,
      cost: dayNumber === 1 ? 5000 : 1000,
      duration: dayNumber === 1 ? '2 hours' : '1 hour',
      departure: dayNumber === 1 ? '09:00' : '10:00',
      arrival: dayNumber === 1 ? '11:00' : '11:00'
    }]
  }

  private calculateFreeTime(activityCount: number): string {
    return activityCount > 3 ? '1 hour' : '2-3 hours'
  }

  private generateDayNotes(city: string, theme: string): string[] {
    return [
      'Comfortable walking shoes recommended',
      `Perfect for ${theme} enthusiasts`,
      'Local guide available throughout',
      'Flexible timing for personal preferences'
    ]
  }

  private estimateWalkingDistance(activityCount: number): string {
    return activityCount > 3 ? '3-4 km' : '2-3 km'
  }

  private generateDayHighlights(city: string, theme: string): string[] {
    return [
      `Best of ${city}`,
      `${theme} experience`,
      'Photo opportunities',
      'Local interactions'
    ]
  }

  private getAIDayTheme(dayNumber: number, packageTheme: string, destination: string): string {
    const themesByDay = {
      1: `Arrival & ${destination} Welcome`,
      2: `${packageTheme} Discovery`,
      3: `Deep ${packageTheme} Immersion`,
      4: `Local ${packageTheme} Experiences`,
      5: `${packageTheme} Mastery & Departure`
    }
    return themesByDay[dayNumber as keyof typeof themesByDay] || `Day ${dayNumber} ${packageTheme}`
  }
}

export const aiPackageGenerator = new AIPackageGenerator()
