// Mapping between homepage package IDs and database package IDs
export const packageIdMapping: { [key: number]: string } = {
  1: 'golden-triangle-premium',     // Delhi (Golden Triangle)
  2: 'kerala-backwaters-hills',     // Kochi (Kerala Backwaters)  
  3: 'rajasthan-royal-heritage',    // Jaipur (Rajasthan Royal)
  4: 'goa-beaches-portuguese',      // Goa (Beach Paradise) - was Mumbai
  5: 'ladakh-adventure-mountains',  // Leh (Ladakh Adventure) - was Goa
  6: 'himachal-hill-stations'       // Shimla (Himachal Hills) - was Udaipur
}

// Package price mapping to ensure consistent pricing
export const packagePriceMapping: { [key: string]: number } = {
  'golden-triangle-premium': 35999,
  'kerala-backwaters-hills': 42999,
  'rajasthan-royal-heritage': 48999,
  'goa-beaches-portuguese': 28999,
  'ladakh-adventure-mountains': 52999,
  'himachal-hill-stations': 32999
}

// Function to get database package ID from homepage package ID
export function getDatabasePackageId(homepagePackageId: number): string {
  return packageIdMapping[homepagePackageId] || 'custom-package'
}

// Function to get package price
export function getPackagePrice(packageId: string): number {
  return packagePriceMapping[packageId] || 15000
}

