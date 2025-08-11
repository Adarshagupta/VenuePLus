import { useRouter } from 'next/navigation'

export interface PackageBookingData {
  id?: string
  name?: string
  destination?: string
  price?: number
  duration?: string
  provider?: string
  description?: string
}

export function redirectToBookingPage(packageData: PackageBookingData) {
  const params = new URLSearchParams({
    packageId: packageData.id || 'custom-package',
    destination: packageData.destination || '',
    price: packageData.price?.toString() || '15000',
    duration: packageData.duration || '5 Days 4 Nights',
  })
  
  // Use window.location for immediate redirect
  window.location.href = `/book-package?${params.toString()}`
}

export function createBookingUrl(packageData: PackageBookingData): string {
  const params = new URLSearchParams({
    packageId: packageData.id || 'custom-package',
    destination: packageData.destination || '',
    price: packageData.price?.toString() || '15000',
    duration: packageData.duration || '5 Days 4 Nights',
  })
  
  return `/book-package?${params.toString()}`
}
