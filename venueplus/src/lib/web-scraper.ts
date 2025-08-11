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

// Real-time data aggregator that combines scraping with API data
export class RealTimeDataAggregator {
  private scraper = new WebScraperService();

  async getComprehensivePackages(destination: string, duration: string, travelers: number) {
    const [scrapedPackages, apiPackages] = await Promise.all([
      this.scraper.scrapePackages(destination, duration, travelers),
      this.getAPIPackages(destination, duration, travelers)
    ]);

    // Combine and deduplicate results
    const allPackages = [...scrapedPackages, ...apiPackages];
    return this.deduplicatePackages(allPackages);
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

  private async getAPIPackages(destination: string, duration: string, travelers: number): Promise<ScrapedPackage[]> {
    // This would integrate with travel APIs like Amadeus, Expedia API, etc.
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
