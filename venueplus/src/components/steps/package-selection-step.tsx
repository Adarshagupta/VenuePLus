'use client'

import { useState, useEffect } from 'react'
import { 
  Package, Filter, ArrowRight, ArrowLeft, Sparkles, Globe, Brain,
  Star, Clock, MapPin, DollarSign, Users, CheckCircle, 
  Loader2, RefreshCw, GitCompare, Heart, Share2, Download,
  Award, Shield, TrendingUp, Eye, Info, AlertCircle, ExternalLink
} from 'lucide-react'
import { TripData } from '../trip-planning-modal'
import { PackageSelector } from '../package-selector'
import { PackageItineraryView } from '../package-itinerary-view'
import { 
  ScrapedPackage, 
  AIGeneratedPackage, 
  PackageFilter,
  PackageSource,
  PackageCategory 
} from '@/lib/package-types'
import { packageService } from '@/lib/package-service'
import { aiPackageGenerator, PackageGenerationRequest } from '@/lib/ai-package-generator'
import { useUserActivity } from '@/hooks/useUserActivity'
import { redirectToBookingPage } from '@/lib/booking-utils'

interface PackageSelectionStepProps {
  tripData: TripData
  onUpdate: (data: Partial<TripData>) => void
  onNext: () => void
  onBack: () => void
}

export function PackageSelectionStep({ tripData, onUpdate, onNext, onBack }: PackageSelectionStepProps) {
  const [currentView, setCurrentView] = useState<'selection' | 'comparison' | 'details'>('selection')
  const [selectedPackage, setSelectedPackage] = useState<ScrapedPackage | AIGeneratedPackage | null>(null)
  const [comparisonPackages, setComparisonPackages] = useState<(ScrapedPackage | AIGeneratedPackage)[]>([])
  const [loading, setLoading] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const [packageStats, setPackageStats] = useState({
    total: 0,
    scraped: 0,
    aiGenerated: 0,
    avgPrice: 0
  })
  
  // Activity tracking
  const { trackPackageView, trackPackageSelection, saveItinerary } = useUserActivity()

  useEffect(() => {
    loadInitialPackageStats()
  }, [tripData.destination, tripData.budget])

  const loadInitialPackageStats = async () => {
    try {
      const filter: PackageFilter = {
        destination: tripData.destination,
        priceRange: tripData.budget ? { min: 0, max: tripData.budget.total } : undefined
      }
      
      const packages = await packageService.getAllPackages(filter)
      
      const stats = {
        total: packages.length,
        scraped: packages.filter(p => p.source === 'scraped').length,
        aiGenerated: packages.filter(p => p.source === 'ai_generated').length,
        avgPrice: packages.length > 0 ? 
          packages.reduce((sum, p) => sum + p.price, 0) / packages.length : 0
      }
      
      setPackageStats(stats)
    } catch (error) {
      console.error('Error loading package stats:', error)
    }
  }

  const handlePackageSelect = async (pkg: ScrapedPackage | AIGeneratedPackage) => {
    setSelectedPackage(pkg)
    setCurrentView('details')
    
    // Update trip data with selected package
    onUpdate({
      selectedPackage: {
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        source: pkg.source,
        provider: pkg.provider,
        description: pkg.description
      }
    })
    
    // Track package selection activity
    await trackPackageSelection(pkg)
  }

  const handleComparePackages = (packages: (ScrapedPackage | AIGeneratedPackage)[]) => {
    setComparisonPackages(packages)
    setCurrentView('comparison')
  }

  const handleProceedWithPackage = async () => {
    if (selectedPackage) {
      // Save the itinerary to database
      const itineraryData = {
        name: `${tripData.destination} Trip - ${selectedPackage.name}`,
        description: selectedPackage.description,
        destination: tripData.destination || '',
        duration: tripData.duration || '',
        travelers: parseInt(tripData.travelers || '1'),
        totalCost: selectedPackage.price,
        currency: 'INR',
        startDate: tripData.startDate,
        endDate: undefined, // Will be calculated from duration if needed
        status: 'planned' as const,
        packageId: selectedPackage.id,
        tags: [tripData.destination, selectedPackage.source].filter(Boolean)
      }
      
      const savedItinerary = await saveItinerary(itineraryData)
      
      if (savedItinerary) {
        console.log('Itinerary saved successfully:', savedItinerary.id)
      }
    }
    
    onNext()
  }

  const generateMoreAIPackages = async () => {
    if (!tripData.destination || !tripData.budget) return

    setGeneratingAI(true)
    try {
      const request: PackageGenerationRequest = {
        destination: tripData.destination,
        budget: tripData.budget.total,
        duration: tripData.duration || '5 days 4 nights',
        travelers: parseInt(tripData.travelers || '2'),
        category: 'mid_range' as PackageCategory,
        interests: ['sightseeing', 'culture', 'food'],
        travelStyle: 'balanced',
        startDate: tripData.startDate
      }

      const newPackages = await aiPackageGenerator.generatePackages(request)
      
      // Refresh the package stats
      await loadInitialPackageStats()
      
      alert(`Generated ${newPackages.length} new AI packages! Refresh the list to see them.`)
    } catch (error) {
      console.error('Error generating AI packages:', error)
      alert('Failed to generate AI packages. Please try again.')
    } finally {
      setGeneratingAI(false)
    }
  }

  const confirmPackageSelection = async () => {
    if (selectedPackage) {
      onUpdate({
        selectedPackage: {
          id: selectedPackage.id,
          name: selectedPackage.name,
          price: selectedPackage.price,
          source: selectedPackage.source,
          provider: selectedPackage.provider,
          description: selectedPackage.description,
          fullData: selectedPackage // Store complete package data
        }
      })
      
      // Save the itinerary to database and proceed
      await handleProceedWithPackage()
    }
  }

  const renderSelectionView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 via-purple-100 to-green-100 rounded-full mb-6 shadow-lg">
          <Package className="w-6 h-6 text-blue-600 mr-3" />
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Perfect Package
          </span>
        </div>
        <h1 className="text-3xl font-extrabold mb-4 text-gray-900">
          Travel Packages for {tripData.destination}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Compare packages from web scraping and AI generation to find your ideal travel experience
        </p>
      </div>

      {/* Package Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">{packageStats.total}</div>
          <div className="text-sm text-gray-600">Total Packages</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="flex items-center justify-center mb-2">
            <Globe className="w-4 h-4 text-green-500 mr-1" />
            <div className="text-2xl font-bold text-green-600">{packageStats.scraped}</div>
          </div>
          <div className="text-sm text-gray-600">Web Scraped</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="flex items-center justify-center mb-2">
            <Brain className="w-4 h-4 text-purple-500 mr-1" />
            <div className="text-2xl font-bold text-purple-600">{packageStats.aiGenerated}</div>
          </div>
          <div className="text-sm text-gray-600">AI Generated</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-orange-600">
            ₹{Math.round(packageStats.avgPrice).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Avg Price</div>
        </div>
      </div>

      {/* Package Highlights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Package Options Available</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center mb-3">
              <Globe className="w-6 h-6 text-blue-500 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Web Scraped Packages</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Real-time pricing from travel websites
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Current availability and offers
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Authentic customer reviews
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Direct booking links
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center mb-3">
              <Brain className="w-6 h-6 text-purple-500 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">AI Generated Packages</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
                Personalized to your preferences
              </li>
              <li className="flex items-center">
                <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
                Optimized schedules and routes
              </li>
              <li className="flex items-center">
                <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
                Hidden gems and local insights
              </li>
              <li className="flex items-center">
                <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
                Budget-optimized experiences
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={generateMoreAIPackages}
            disabled={generatingAI}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {generatingAI ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating AI Packages...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate More AI Packages
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Get personalized packages created just for your trip
          </p>
        </div>
      </div>

      {/* Package Selector Component */}
      <PackageSelector
        destination={tripData.destination}
        budget={tripData.budget?.total}
        travelers={parseInt(tripData.travelers || '2')}
        onPackageSelect={handlePackageSelect}
        onComparePackages={handleComparePackages}
      />

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          onClick={() => setCurrentView('details')}
          disabled={!selectedPackage}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  const renderComparisonView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Package Comparison</h2>
          <p className="text-gray-600">Compare up to {comparisonPackages.length} selected packages</p>
        </div>
        <button
          onClick={() => setCurrentView('selection')}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          Back to Selection
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                {comparisonPackages.map((pkg, index) => (
                  <th key={pkg.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Package {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Package Names */}
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Package Name</td>
                {comparisonPackages.map(pkg => (
                  <td key={pkg.id} className="px-6 py-4 text-center">
                    <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                    <div className="text-xs text-gray-500">{pkg.provider}</div>
                  </td>
                ))}
              </tr>

              {/* Source */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Source</td>
                {comparisonPackages.map(pkg => (
                  <td key={pkg.id} className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      pkg.source === 'ai_generated' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {pkg.source === 'ai_generated' ? (
                        <>
                          <Brain className="w-3 h-3 mr-1" />
                          AI Generated
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3 mr-1" />
                          Web Scraped
                        </>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Price</td>
                {comparisonPackages.map(pkg => (
                  <td key={pkg.id} className="px-6 py-4 text-center">
                    <div className="text-lg font-bold text-green-600">₹{pkg.price.toLocaleString()}</div>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Rating</td>
                {comparisonPackages.map(pkg => (
                  <td key={pkg.id} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{pkg.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({pkg.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Duration */}
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Duration</td>
                {comparisonPackages.map(pkg => (
                  <td key={pkg.id} className="px-6 py-4 text-center text-sm text-gray-700">
                    {pkg.duration}
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Category</td>
                {comparisonPackages.map(pkg => (
                  <td key={pkg.id} className="px-6 py-4 text-center">
                    <span className="capitalize text-sm text-gray-700">
                      {pkg.category.replace('_', ' ')}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Actions</td>
                {comparisonPackages.map(pkg => (
                  <td key={pkg.id} className="px-6 py-4 text-center">
                    <button
                      onClick={() => handlePackageSelect(pkg)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-200"
                    >
                      Select
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentView('selection')}
          className="flex items-center space-x-2 px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Selection</span>
        </button>
      </div>
    </div>
  )

  const renderDetailsView = () => (
    <div className="space-y-6">
      {selectedPackage && (
        <>
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-6 shadow-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <span className="text-lg font-semibold text-green-700">
                Package Selected
              </span>
            </div>
            <h1 className="text-3xl font-extrabold mb-4 text-gray-900">
              {selectedPackage.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {selectedPackage.description}
            </p>
          </div>

          {/* Package Details Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Image Header */}
            <div className="relative h-64">
              <img 
                src={selectedPackage.imageUrl} 
                alt={selectedPackage.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                {selectedPackage.source === 'ai_generated' ? (
                  <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Generated Package
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <Globe className="w-4 h-4 mr-2" />
                    Web Scraped Package
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="flex items-center space-x-1 bg-white/90 rounded-full px-3 py-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{selectedPackage.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-600">({selectedPackage.reviewCount})</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">₹{selectedPackage.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900">{selectedPackage.duration}</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900">{selectedPackage.destination}</div>
                  <div className="text-sm text-gray-600">Destination</div>
                </div>
                <div className="text-center">
                  <Package className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900 capitalize">
                    {selectedPackage.category.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-600">Category</div>
                </div>
              </div>

              {/* Package Features */}
              {selectedPackage.source === 'ai_generated' && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(selectedPackage as AIGeneratedPackage).aiFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-xl">
                        <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                          <p className="text-xs text-purple-600 mt-1">{feature.benefit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust & Quality Indicators */}
              {selectedPackage.source === 'scraped' && (selectedPackage as ScrapedPackage).aiAnalysis && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">AI Quality Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {(selectedPackage as ScrapedPackage).aiAnalysis!.qualityScore}/10
                      </div>
                      <div className="text-sm text-gray-600">Quality Score</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">
                        {(selectedPackage as ScrapedPackage).aiAnalysis!.trustScore}/10
                      </div>
                      <div className="text-sm text-gray-600">Trust Score</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-lg font-bold text-orange-600 capitalize">
                        {(selectedPackage as ScrapedPackage).aiAnalysis!.priceValue}
                      </div>
                      <div className="text-sm text-gray-600">Price Value</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Provider Information */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Package Provider</h4>
                    <p className="text-gray-600">{selectedPackage.provider}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Last Updated</div>
                    <div className="text-sm text-gray-700">
                      {selectedPackage.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Itinerary */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h3 className="text-2xl font-bold">📋 Detailed Package Itinerary</h3>
              <p className="text-blue-100 mt-2">Hour-by-hour breakdown including transport, activities, and accommodations</p>
            </div>
            <div className="p-6">
              <PackageItineraryView package={selectedPackage} showDetailed={true} />
            </div>
          </div>

          {/* Confirmation */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Package Selection</h3>
            <p className="text-gray-600 mb-6">
              You're about to select "{selectedPackage.name}" for ₹{selectedPackage.price.toLocaleString()}. 
              This will be used as the base for your detailed itinerary.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentView('selection')}
                className="px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Change Package
              </button>
              <button
                onClick={() => redirectToBookingPage({
                  id: selectedPackage.id,
                  name: selectedPackage.name,
                  destination: selectedPackage.destination,
                  price: selectedPackage.price,
                  duration: selectedPackage.duration,
                  provider: selectedPackage.provider,
                  description: selectedPackage.description
                })}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Book Now</span>
              </button>
              <button
                onClick={confirmPackageSelection}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Confirm & Continue
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </>
      )}
    </div>
  )

  if (currentView === 'comparison') {
    return renderComparisonView()
  }

  if (currentView === 'details') {
    return renderDetailsView()
  }

  return renderSelectionView()
}
