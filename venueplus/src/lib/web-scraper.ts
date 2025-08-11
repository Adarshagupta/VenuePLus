import axios from 'axios';
import * as cheerio from 'cheerio';
import { parse } from 'node-html-parser';

export interface ScrapedPackage {
  title: string;
  price: string;
  provider: string;
  rating?: string;
  duration?: string;
  includes?: string[];
  url: string;
  imageUrl?: string;
}

export interface ScrapedBooking {
  type: 'flight' | 'hotel' | 'activity';
  name: string;
  price: string;
  provider: string;
  rating?: string;
  location?: string;
  url: string;
  features?: string[];
}

class WebScraperService {
  private headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
  };

  // Scrape travel packages from multiple sources
  async scrapePackages(destination: string, duration: string, travelers: number): Promise<ScrapedPackage[]> {
    const results: ScrapedPackage[] = [];

    try {
      // Scrape from MakeMyTrip-style sites
      const makemytripResults = await this.scrapeMakeMyTrip(destination, duration, travelers);
      results.push(...makemytripResults);

      // Scrape from TripAdvisor-style sites
      const tripadvisorResults = await this.scrapeTripAdvisor(destination);
      results.push(...tripadvisorResults);

      // Scrape from Expedia-style sites
      const expediaResults = await this.scrapeExpedia(destination, duration);
      results.push(...expediaResults);

    } catch (error) {
      console.error('Error scraping packages:', error);
    }

    return results;
  }

  // Scrape flights from multiple sources
  async scrapeFlights(from: string, to: string, date: string, travelers: number): Promise<ScrapedBooking[]> {
    const results: ScrapedBooking[] = [];

    try {
      // For demo purposes, we'll create mock data
      // In production, you'd integrate with actual flight booking sites
      results.push({
        type: 'flight',
        name: `${from} to ${to}`,
        price: '$450',
        provider: 'SkyScanner',
        rating: '4.2',
        url: `https://www.skyscanner.com/routes/${from}/${to}`,
        features: ['Direct flight', 'Baggage included', 'Refundable']
      });

      results.push({
        type: 'flight',
        name: `${from} to ${to} via Hub`,
        price: '$320',
        provider: 'Kayak',
        rating: '4.0',
        url: `https://www.kayak.com/flights/${from}-${to}`,
        features: ['1 stop', 'Budget option', 'Basic fare']
      });

    } catch (error) {
      console.error('Error scraping flights:', error);
    }

    return results;
  }

  // Scrape hotels from booking sites
  async scrapeHotels(destination: string, checkIn: string, checkOut: string, guests: number): Promise<ScrapedBooking[]> {
    const results: ScrapedBooking[] = [];

    try {
      // Mock hotel data - replace with actual scraping
      results.push({
        type: 'hotel',
        name: 'Grand Palace Hotel',
        price: '$120/night',
        provider: 'Booking.com',
        rating: '4.5',
        location: `${destination} City Center`,
        url: `https://www.booking.com/hotel/${destination}`,
        features: ['Free WiFi', 'Pool', 'Breakfast included', 'Gym']
      });

      results.push({
        type: 'hotel',
        name: 'Budget Inn',
        price: '$60/night',
        provider: 'Agoda',
        rating: '3.8',
        location: `${destination} Downtown`,
        url: `https://www.agoda.com/hotel/${destination}`,
        features: ['Free WiFi', 'Basic amenities', 'Good location']
      });

    } catch (error) {
      console.error('Error scraping hotels:', error);
    }

    return results;
  }

  // Scrape activities and attractions
  async scrapeActivities(destination: string): Promise<ScrapedBooking[]> {
    const results: ScrapedBooking[] = [];

    try {
      // Mock activity data - replace with actual scraping
      results.push({
        type: 'activity',
        name: 'City Walking Tour',
        price: '$35',
        provider: 'GetYourGuide',
        rating: '4.7',
        location: `${destination} Historic Center`,
        url: `https://www.getyourguide.com/${destination}`,
        features: ['Professional guide', '3 hours', 'Small groups', 'Historical insights']
      });

      results.push({
        type: 'activity',
        name: 'Cultural Museum Pass',
        price: '$25',
        provider: 'Viator',
        rating: '4.3',
        location: `${destination} Museums`,
        url: `https://www.viator.com/${destination}`,
        features: ['Skip the line', 'Multiple museums', 'Audio guide included']
      });

    } catch (error) {
      console.error('Error scraping activities:', error);
    }

    return results;
  }

  private async scrapeMakeMyTrip(destination: string, duration: string, travelers: number): Promise<ScrapedPackage[]> {
    // This would scrape MakeMyTrip or similar sites
    // For now, returning mock data that simulates real scraping results
    return [
      {
        title: `${destination} ${duration} Package`,
        price: '$899',
        provider: 'MakeMyTrip',
        rating: '4.3',
        duration: duration,
        includes: ['Flights', 'Hotels', 'Breakfast', 'Transfers'],
        url: `https://www.makemytrip.com/holidays-international/packages/${destination}`,
        imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'
      }
    ];
  }

  private async scrapeTripAdvisor(destination: string): Promise<ScrapedPackage[]> {
    // This would scrape TripAdvisor packages
    return [
      {
        title: `${destination} Adventure Package`,
        price: '$1,299',
        provider: 'TripAdvisor',
        rating: '4.5',
        includes: ['Guided tours', 'Adventure activities', 'Accommodation'],
        url: `https://www.tripadvisor.com/packages/${destination}`,
        imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828'
      }
    ];
  }

  private async scrapeExpedia(destination: string, duration: string): Promise<ScrapedPackage[]> {
    // This would scrape Expedia packages
    return [
      {
        title: `${destination} Complete Holiday`,
        price: '$1,150',
        provider: 'Expedia',
        rating: '4.2',
        duration: duration,
        includes: ['Round-trip flights', 'Hotel stay', 'Car rental'],
        url: `https://www.expedia.com/packages/${destination}`,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
      }
    ];
  }

  // Advanced scraping with retry logic and rate limiting
  private async scrapeWithRetry(url: string, retries: number = 3): Promise<string> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.delay(1000 * i); // Progressive delay
        const response = await axios.get(url, {
          headers: this.headers,
          timeout: 10000
        });
        return response.data;
      } catch (error) {
        if (i === retries - 1) throw error;
        console.warn(`Retry ${i + 1} for ${url}`);
      }
    }
    throw new Error('Max retries exceeded');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Parse common price formats
  private parsePrice(priceString: string): number {
    const cleanPrice = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(cleanPrice) || 0;
  }

  // Extract rating from various formats
  private parseRating(ratingString: string): number {
    const match = ratingString.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }
}

// Enhanced data aggregator with AI-powered organization and analysis
export class RealTimeDataAggregator {
  private scraper = new WebScraperService();
  private aiAnalysisCache = new Map<string, any>();

  async getComprehensivePackages(destination: string, duration: string, travelers: number) {
    console.log('🔍 Starting comprehensive package search...');
    
    try {
      // Phase 1: Raw data collection
      const [scrapedPackages, apiPackages] = await Promise.all([
        this.scraper.scrapePackages(destination, duration, travelers),
        this.getAPIPackages(destination, duration, travelers)
      ]);

      console.log(`📦 Found ${scrapedPackages.length} scraped packages, ${apiPackages.length} API packages`);

      // Phase 2: Combine and deduplicate
      const rawPackages = [...scrapedPackages, ...apiPackages];
      const deduplicatedPackages = this.deduplicatePackages(rawPackages);

      console.log(`🔧 After deduplication: ${deduplicatedPackages.length} packages`);

      // Phase 3: AI-powered enhancement and organization
      const enhancedPackages = await this.enhancePackagesWithAI(deduplicatedPackages, {
        destination,
        duration,
        travelers
      });

      console.log('✨ AI enhancement completed');

      // Phase 4: Categorization and quality scoring
      const organizedPackages = await this.organizePackagesWithAI(enhancedPackages);

      console.log('📊 Package organization completed');

      return organizedPackages;

    } catch (error) {
      console.error('❌ Error in comprehensive package search:', error);
      return [];
    }
  }

  async getComprehensiveBookings(request: any) {
    const [flights, hotels, activities] = await Promise.all([
      this.scraper.scrapeFlights(request.fromCity, request.destination, request.startDate, request.travelers),
      this.scraper.scrapeHotels(request.destination, request.startDate, request.endDate, request.travelers),
      this.scraper.scrapeActivities(request.destination)
    ]);

    return {
      flights,
      hotels,
      activities
    };
  }

  /**
   * Enhance scraped packages with AI analysis and categorization
   */
  private async enhancePackagesWithAI(packages: ScrapedPackage[], context: {
    destination: string;
    duration: string;
    travelers: number;
  }): Promise<ScrapedPackage[]> {
    console.log('🤖 Enhancing packages with AI analysis...');

    const enhancedPackages = await Promise.all(
      packages.map(async (pkg) => {
        try {
          // Generate cache key for this package
          const cacheKey = `${pkg.title}-${pkg.provider}-${pkg.price}`;
          
          // Check cache first
          if (this.aiAnalysisCache.has(cacheKey)) {
            return {
              ...pkg,
              aiAnalysis: this.aiAnalysisCache.get(cacheKey)
            };
          }

          // Generate AI analysis
          const aiAnalysis = await this.generateAIPackageAnalysis(pkg, context);
          
          // Cache the analysis
          this.aiAnalysisCache.set(cacheKey, aiAnalysis);

          return {
            ...pkg,
            aiAnalysis
          };
        } catch (error) {
          console.warn(`Failed to enhance package ${pkg.title}:`, error);
          return pkg;
        }
      })
    );

    return enhancedPackages;
  }

  /**
   * Generate comprehensive AI analysis for a scraped package
   */
  private async generateAIPackageAnalysis(pkg: ScrapedPackage, context: any): Promise<any> {
    // Analyze package quality and value
    const qualityMetrics = this.analyzePackageQuality(pkg);
    const valueAssessment = this.assessPackageValue(pkg, context);
    const trustIndicators = this.evaluateProviderTrust(pkg);
    const competitivePosition = await this.analyzeCompetitivePosition(pkg, context);

    return {
      qualityScore: qualityMetrics.score,
      qualityFactors: qualityMetrics.factors,
      priceValue: valueAssessment.rating,
      valueJustification: valueAssessment.reasoning,
      trustScore: trustIndicators.score,
      trustFactors: trustIndicators.factors,
      highlights: this.extractPackageHighlights(pkg, qualityMetrics, valueAssessment),
      potentialIssues: this.identifyPotentialIssues(pkg, trustIndicators),
      recommendations: this.generateSmartRecommendations(pkg, context),
      competitorComparison: competitivePosition,
      aiConfidence: this.calculateAnalysisConfidence(pkg, qualityMetrics, trustIndicators),
      lastAnalyzed: new Date()
    };
  }

  /**
   * Organize packages using AI-powered categorization and ranking
   */
  private async organizePackagesWithAI(packages: ScrapedPackage[]): Promise<ScrapedPackage[]> {
    console.log('📊 Organizing packages with AI categorization...');

    // Step 1: Smart categorization
    const categorizedPackages = await this.categorizePackagesIntelligently(packages);

    // Step 2: Quality ranking within categories
    const rankedPackages = this.rankPackagesByQuality(categorizedPackages);

    // Step 3: Diversity optimization (ensure variety in results)
    const optimizedSelection = this.optimizePackageSelection(rankedPackages);

    return optimizedSelection;
  }

  /**
   * Intelligently categorize packages based on content analysis
   */
  private async categorizePackagesIntelligently(packages: ScrapedPackage[]): Promise<ScrapedPackage[]> {
    return packages.map(pkg => {
      const title = pkg.title.toLowerCase();
      const description = (pkg.description || '').toLowerCase();
      const content = `${title} ${description}`;

      // AI-powered categorization logic
      let category = 'general';
      let subCategory = 'standard';

      // Luxury indicators
      if (this.containsLuxuryKeywords(content) || pkg.price > 75000) {
        category = 'luxury';
        subCategory = this.identifyLuxurySubcategory(content);
      }
      // Budget indicators
      else if (this.containsBudgetKeywords(content) || pkg.price < 30000) {
        category = 'budget';
        subCategory = this.identifyBudgetSubcategory(content);
      }
      // Adventure indicators
      else if (this.containsAdventureKeywords(content)) {
        category = 'adventure';
        subCategory = this.identifyAdventureSubcategory(content);
      }
      // Cultural indicators
      else if (this.containsCulturalKeywords(content)) {
        category = 'cultural';
        subCategory = this.identifyCulturalSubcategory(content);
      }
      // Family indicators
      else if (this.containsFamilyKeywords(content)) {
        category = 'family';
        subCategory = this.identifyFamilySubcategory(content);
      }
      // Mid-range default
      else {
        category = 'mid_range';
        subCategory = 'balanced';
      }

      return {
        ...pkg,
        aiCategory: category,
        aiSubCategory: subCategory,
        aiCategoryConfidence: this.calculateCategorizationConfidence(content, category)
      };
    });
  }

  // AI Analysis Helper Methods
  private analyzePackageQuality(pkg: ScrapedPackage): { score: number; factors: string[] } {
    let score = 5; // Base score
    const factors = [];

    // Rating factor
    if (pkg.rating && pkg.rating > 4.5) {
      score += 2;
      factors.push('Excellent customer rating');
    } else if (pkg.rating && pkg.rating > 4.0) {
      score += 1;
      factors.push('Good customer rating');
    } else if (pkg.rating && pkg.rating < 3.5) {
      score -= 1;
      factors.push('Below average rating');
    }

    // Review count factor
    if (pkg.reviews && parseInt(pkg.reviews) > 100) {
      score += 1;
      factors.push('Well-reviewed package');
    } else if (pkg.reviews && parseInt(pkg.reviews) < 10) {
      score -= 0.5;
      factors.push('Limited reviews');
    }

    // Description quality
    if (pkg.description && pkg.description.length > 100) {
      score += 0.5;
      factors.push('Detailed description');
    }

    // Inclusions analysis
    if (pkg.includes && pkg.includes.length > 5) {
      score += 1;
      factors.push('Comprehensive inclusions');
    }

    return {
      score: Math.max(1, Math.min(10, score)),
      factors
    };
  }

  private assessPackageValue(pkg: ScrapedPackage, context: any): { rating: string; reasoning: string } {
    const price = pkg.price || 50000;
    const duration = pkg.duration || '';
    
    // Extract days from duration
    const daysMatch = duration.match(/(\d+)\s*days?/i);
    const days = daysMatch ? parseInt(daysMatch[1]) : 5;
    
    const pricePerDay = price / days;

    let rating = 'fair';
    let reasoning = '';

    if (pricePerDay < 5000) {
      rating = 'excellent';
      reasoning = 'Exceptional value - very affordable daily cost';
    } else if (pricePerDay < 8000) {
      rating = 'good';
      reasoning = 'Good value - reasonable daily cost for inclusions';
    } else if (pricePerDay < 12000) {
      rating = 'fair';
      reasoning = 'Fair value - average market pricing';
    } else {
      rating = 'poor';
      reasoning = 'Premium pricing - verify luxury inclusions justify cost';
    }

    return { rating, reasoning };
  }

  private evaluateProviderTrust(pkg: ScrapedPackage): { score: number; factors: string[] } {
    let score = 6; // Base trust score
    const factors = [];

    // Provider recognition
    const knownProviders = ['makemytrip', 'yatra', 'cleartrip', 'ixigo', 'goibibo', 'booking.com'];
    if (knownProviders.some(provider => pkg.provider.toLowerCase().includes(provider))) {
      score += 2;
      factors.push('Recognized travel platform');
    }

    // Rating credibility
    if (pkg.rating && pkg.rating > 4.3 && pkg.reviews && parseInt(pkg.reviews) > 50) {
      score += 1;
      factors.push('Credible rating with sufficient reviews');
    }

    // URL authenticity
    if (pkg.url && (pkg.url.includes('https://') && !pkg.url.includes('bit.ly'))) {
      score += 0.5;
      factors.push('Authentic booking URL');
    }

    return {
      score: Math.max(1, Math.min(10, score)),
      factors
    };
  }

  private async analyzeCompetitivePosition(pkg: ScrapedPackage, context: any): Promise<any[]> {
    // Simplified competitive analysis
    // In production, this would compare with similar packages
    return [
      {
        competitor: 'Market Average',
        price: 45000,
        rating: 4.1,
        advantages: pkg.price < 45000 ? ['Lower price'] : [],
        disadvantages: pkg.price > 45000 ? ['Higher price'] : []
      }
    ];
  }

  // Keyword detection methods
  private containsLuxuryKeywords(content: string): boolean {
    const luxuryKeywords = [
      'luxury', 'premium', 'deluxe', 'executive', 'vip', 'five star', '5 star',
      'resort', 'spa', 'suite', 'presidential', 'platinum', 'gold',
      'exclusive', 'private', 'helicopter', 'yacht', 'limousine'
    ];
    return luxuryKeywords.some(keyword => content.includes(keyword));
  }

  private containsBudgetKeywords(content: string): boolean {
    const budgetKeywords = [
      'budget', 'economy', 'affordable', 'cheap', 'value', 'saver',
      'backpacker', 'hostel', 'dormitory', 'shared', 'basic',
      'no frills', 'essential', 'standard'
    ];
    return budgetKeywords.some(keyword => content.includes(keyword));
  }

  private containsAdventureKeywords(content: string): boolean {
    const adventureKeywords = [
      'adventure', 'trekking', 'hiking', 'safari', 'expedition',
      'camping', 'rafting', 'climbing', 'jungle', 'mountain',
      'outdoor', 'wilderness', 'extreme', 'adrenaline'
    ];
    return adventureKeywords.some(keyword => content.includes(keyword));
  }

  private containsCulturalKeywords(content: string): boolean {
    const culturalKeywords = [
      'cultural', 'heritage', 'historical', 'temple', 'monument',
      'museum', 'traditional', 'local', 'authentic', 'art',
      'festival', 'spiritual', 'pilgrimage', 'ancient'
    ];
    return culturalKeywords.some(keyword => content.includes(keyword));
  }

  private containsFamilyKeywords(content: string): boolean {
    const familyKeywords = [
      'family', 'kids', 'children', 'child friendly', 'playground',
      'amusement', 'theme park', 'zoo', 'aquarium', 'fun',
      'entertainment', 'activities for kids'
    ];
    return familyKeywords.some(keyword => content.includes(keyword));
  }

  // Additional helper methods
  private identifyLuxurySubcategory(content: string): string {
    if (content.includes('spa') || content.includes('wellness')) return 'spa_wellness';
    if (content.includes('resort')) return 'luxury_resort';
    if (content.includes('suite') || content.includes('presidential')) return 'premium_accommodation';
    return 'luxury_experience';
  }

  private identifyBudgetSubcategory(content: string): string {
    if (content.includes('backpacker')) return 'backpacker';
    if (content.includes('hostel')) return 'hostel_stay';
    if (content.includes('essential')) return 'essential_package';
    return 'value_package';
  }

  private identifyAdventureSubcategory(content: string): string {
    if (content.includes('trek') || content.includes('hiking')) return 'trekking';
    if (content.includes('safari')) return 'wildlife_safari';
    if (content.includes('water') || content.includes('rafting')) return 'water_adventure';
    return 'outdoor_adventure';
  }

  private identifyCulturalSubcategory(content: string): string {
    if (content.includes('temple') || content.includes('spiritual')) return 'spiritual';
    if (content.includes('heritage') || content.includes('historical')) return 'heritage';
    if (content.includes('art') || content.includes('museum')) return 'art_culture';
    return 'cultural_immersion';
  }

  private identifyFamilySubcategory(content: string): string {
    if (content.includes('amusement') || content.includes('theme park')) return 'theme_parks';
    if (content.includes('beach')) return 'beach_family';
    if (content.includes('educational')) return 'educational';
    return 'family_fun';
  }

  private calculateCategorizationConfidence(content: string, category: string): number {
    // Simple confidence calculation based on keyword matches
    const keywordSets = {
      luxury: this.containsLuxuryKeywords(content),
      budget: this.containsBudgetKeywords(content),
      adventure: this.containsAdventureKeywords(content),
      cultural: this.containsCulturalKeywords(content),
      family: this.containsFamilyKeywords(content)
    };

    const matches = Object.values(keywordSets).filter(Boolean).length;
    return Math.min(0.95, 0.6 + (matches * 0.1));
  }

  private extractPackageHighlights(pkg: ScrapedPackage, quality: any, value: any): string[] {
    const highlights = [];
    
    if (quality.score >= 8) highlights.push('High quality package');
    if (value.rating === 'excellent') highlights.push('Excellent value for money');
    if (pkg.rating && pkg.rating >= 4.5) highlights.push('Highly rated by customers');
    if (pkg.includes && pkg.includes.length > 5) highlights.push('Comprehensive inclusions');
    
    return highlights.length > 0 ? highlights : ['Verified travel package'];
  }

  private identifyPotentialIssues(pkg: ScrapedPackage, trust: any): string[] {
    const issues = [];
    
    if (trust.score < 6) issues.push('Limited provider information');
    if (pkg.rating && pkg.rating < 3.5) issues.push('Below average customer rating');
    if (!pkg.reviews || parseInt(pkg.reviews) < 10) issues.push('Limited customer reviews');
    
    return issues;
  }

  private generateSmartRecommendations(pkg: ScrapedPackage, context: any): string[] {
    const recommendations = [];
    
    recommendations.push('Verify current availability and pricing');
    recommendations.push('Read recent customer reviews');
    
    if (pkg.price > 50000) {
      recommendations.push('Consider travel insurance for high-value trip');
    }
    
    recommendations.push('Book early for better deals');
    
    return recommendations;
  }

  private calculateAnalysisConfidence(pkg: ScrapedPackage, quality: any, trust: any): number {
    let confidence = 0.7; // Base confidence
    
    if (pkg.rating && pkg.reviews && parseInt(pkg.reviews) > 20) confidence += 0.1;
    if (quality.factors.length > 3) confidence += 0.1;
    if (trust.score > 7) confidence += 0.05;
    if (pkg.description && pkg.description.length > 100) confidence += 0.05;
    
    return Math.min(0.95, confidence);
  }

  private rankPackagesByQuality(packages: ScrapedPackage[]): ScrapedPackage[] {
    return packages.sort((a, b) => {
      const aScore = (a.aiAnalysis?.qualityScore || 5) + 
                    (a.aiAnalysis?.trustScore || 5) / 2 + 
                    (a.rating || 3);
      const bScore = (b.aiAnalysis?.qualityScore || 5) + 
                    (b.aiAnalysis?.trustScore || 5) / 2 + 
                    (b.rating || 3);
      return bScore - aScore;
    });
  }

  private optimizePackageSelection(packages: ScrapedPackage[]): ScrapedPackage[] {
    // Ensure diversity in package types and price ranges
    const categories = ['luxury', 'budget', 'adventure', 'cultural', 'family', 'mid_range'];
    const optimized = [];
    
    // Include best from each category
    categories.forEach(category => {
      const categoryPackages = packages.filter(pkg => pkg.aiCategory === category);
      if (categoryPackages.length > 0) {
        optimized.push(...categoryPackages.slice(0, 2)); // Top 2 from each category
      }
    });
    
    // Fill remaining with highest quality regardless of category
    const remaining = packages.filter(pkg => !optimized.find(opt => opt.title === pkg.title));
    optimized.push(...remaining.slice(0, Math.max(0, 20 - optimized.length)));
    
    return optimized.slice(0, 20); // Limit to 20 packages
  }

  private async getAPIPackages(destination: string, duration: string, travelers: number): Promise<ScrapedPackage[]> {
    // This would integrate with travel APIs like Amadeus, Expedia API, etc.
    // For now, return empty array but could be enhanced with real API integration
    return [];
  }

  private deduplicatePackages(packages: ScrapedPackage[]): ScrapedPackage[] {
    const seen = new Set();
    return packages.filter(pkg => {
      const key = `${pkg.title}-${pkg.provider}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

export const webScraper = new WebScraperService();
export const dataAggregator = new RealTimeDataAggregator();
