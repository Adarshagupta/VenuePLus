'use client'

import { useState, useEffect } from 'react'
import { 
  Package, Filter, Search, Star, Clock, DollarSign, Users, MapPin, 
  Globe, Brain, CheckCircle, XCircle, ArrowUpDown, MoreHorizontal,
  Heart, Share2, Calendar, TrendingUp, Award, Shield, Sparkles,
  Verified, AlertCircle, Info, ChevronDown, ChevronUp, Eye,
  BookOpen, Download, GitCompare, ShoppingCart, ExternalLink
} from 'lucide-react'
import { 
  ScrapedPackage, 
  AIGeneratedPackage, 
  PackageFilter,
  PackageSource,
  PackageType,
  PackageCategory 
} from '@/lib/package-types'
import { packageService } from '@/lib/package-service'
import { PackageItineraryView } from './package-itinerary-view'
import { userService } from '@/lib/user-service'
import { redirectToBookingPage } from '@/lib/booking-utils'

interface PackageSelectorProps {
  destination?: string
  budget?: number
  travelers?: number
  onPackageSelect: (packageData: ScrapedPackage | AIGeneratedPackage) => void
  onComparePackages?: (packages: (ScrapedPackage | AIGeneratedPackage)[]) => void
}

export function PackageSelector({ 
  destination, 
  budget, 
  travelers, 
  onPackageSelect,
  onComparePackages 
}: PackageSelectorProps) {
  const [packages, setPackages] = useState<(ScrapedPackage | AIGeneratedPackage)[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [filter, setFilter] = useState<PackageFilter>({
    destination,
    priceRange: budget ? { min: 0, max: budget } : undefined,
    sortBy: 'ai_score',
    sortOrder: 'desc'
  })
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null)

  useEffect(() => {
    loadPackages()
  }, [filter, destination, budget])

  const loadPackages = async () => {
    setLoading(true)
    try {
      const fetchedPackages = await packageService.getAllPackages(filter)
      setPackages(fetchedPackages)
    } catch (error) {
      console.error('Error loading packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSourceFilter = (sources: PackageSource[]) => {
    setFilter(prev => ({ ...prev, source: sources }))
  }

  const handleCategoryFilter = (categories: PackageCategory[]) => {
    setFilter(prev => ({ ...prev, category: categories }))
  }

  const handlePriceRangeFilter = (range: { min: number; max: number }) => {
    setFilter(prev => ({ ...prev, priceRange: range }))
  }

  const handleSortChange = (sortBy: string) => {
    setFilter(prev => ({ 
      ...prev, 
      sortBy: sortBy as any,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }))
  }

  const togglePackageSelection = (packageId: string) => {
    setSelectedPackages(prev => {
      const newSelection = prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
      return newSelection
    })
  }

  const handleCompare = () => {
    if (selectedPackages.length > 0 && onComparePackages) {
      const packagesToCompare = packages.filter(pkg => selectedPackages.includes(pkg.id))
      onComparePackages(packagesToCompare)
    }
  }

  const getPackageIcon = (pkg: ScrapedPackage | AIGeneratedPackage) => {
    if (pkg.source === 'ai_generated') {
      return <Brain className="w-5 h-5 text-purple-500" />
    } else {
      return <Globe className="w-5 h-5 text-blue-500" />
    }
  }

  const getSourceBadge = (source: PackageSource) => {
    if (source === 'ai_generated') {
      return (
        <div className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          <Brain className="w-3 h-3 mr-1" />
          AI Generated
        </div>
      )
    } else {
      return (
        <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          <Globe className="w-3 h-3 mr-1" />
          Scraped from Web
        </div>
      )
    }
  }

  const getQualityIndicator = (pkg: ScrapedPackage | AIGeneratedPackage) => {
    if (pkg.source === 'ai_generated') {
      const confidence = (pkg as AIGeneratedPackage).confidence
      return (
        <div className="flex items-center space-x-1">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-xs text-purple-600 font-medium">
            {Math.round(confidence * 100)}% AI Confidence
          </span>
        </div>
      )
    } else {
      const scraped = pkg as ScrapedPackage
      const trustScore = scraped.aiAnalysis?.trustScore || 6
      return (
        <div className="flex items-center space-x-1">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600 font-medium">
            Trust Score: {trustScore}/10
          </span>
        </div>
      )
    }
  }

  const renderFilters = () => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 mb-6 transition-all duration-300 ${
      showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Source Filter */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Package Source</h4>
          <div className="space-y-2">
            {[
              { key: 'scraped', label: 'Scraped from Web', icon: Globe },
              { key: 'ai_generated', label: 'AI Generated', icon: Brain }
            ].map(({ key, label, icon: Icon }) => (
              <label key={key} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!filter.source || filter.source.includes(key as PackageSource)}
                  onChange={(e) => {
                    const currentSources = filter.source || ['scraped', 'ai_generated']
                    if (e.target.checked) {
                      const newSources = currentSources.includes(key as PackageSource) 
                        ? currentSources 
                        : [...currentSources, key as PackageSource]
                      handleSourceFilter(newSources)
                    } else {
                      const newSources = currentSources.filter(s => s !== key)
                      handleSourceFilter(newSources)
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Package Category</h4>
          <div className="space-y-2">
            {[
              'budget', 'mid_range', 'luxury', 'adventure', 'cultural', 'family', 'romantic'
            ].map((category) => (
              <label key={category} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!filter.category || filter.category.includes(category as PackageCategory)}
                  onChange={(e) => {
                    const currentCategories = filter.category || []
                    if (e.target.checked) {
                      const newCategories = [...currentCategories, category as PackageCategory]
                      handleCategoryFilter(newCategories)
                    } else {
                      const newCategories = currentCategories.filter(c => c !== category)
                      handleCategoryFilter(newCategories)
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{category.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min Price</label>
              <input
                type="number"
                value={filter.priceRange?.min || 0}
                onChange={(e) => handlePriceRangeFilter({
                  min: parseInt(e.target.value) || 0,
                  max: filter.priceRange?.max || 100000
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="₹0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Price</label>
              <input
                type="number"
                value={filter.priceRange?.max || 100000}
                onChange={(e) => handlePriceRangeFilter({
                  min: filter.priceRange?.min || 0,
                  max: parseInt(e.target.value) || 100000
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="₹100,000"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPackageCard = (pkg: ScrapedPackage | AIGeneratedPackage) => (
    <div key={pkg.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Package Image */}
      <div className="relative h-48">
        <img 
          src={pkg.imageUrl} 
          alt={pkg.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          {getSourceBadge(pkg.source)}
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={() => togglePackageSelection(pkg.id)}
            className={`p-2 rounded-full transition-all duration-200 ${
              selectedPackages.includes(pkg.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${selectedPackages.includes(pkg.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{pkg.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-600">({pkg.reviewCount})</span>
            </div>
            {getQualityIndicator(pkg)}
          </div>
        </div>
      </div>

      {/* Package Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getPackageIcon(pkg)}
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{pkg.name}</h3>
          </div>
          <button
            onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {expandedPackage === pkg.id ? 
              <ChevronUp className="w-4 h-4 text-gray-500" /> : 
              <ChevronDown className="w-4 h-4 text-gray-500" />
            }
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

        {/* Package Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{pkg.destination}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{pkg.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 capitalize">{pkg.category.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{pkg.provider}</span>
          </div>
        </div>

        {/* Expanded Details */}
        {expandedPackage === pkg.id && (
          <div className="border-t pt-4 mt-4">
            {pkg.source === 'ai_generated' && (
              <div className="mb-4">
                <h5 className="font-semibold text-gray-900 mb-2">AI Features</h5>
                <div className="space-y-1">
                  {(pkg as AIGeneratedPackage).aiFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      <span className="text-gray-600">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pkg.source === 'scraped' && (pkg as ScrapedPackage).aiAnalysis && (
              <div className="mb-4">
                <h5 className="font-semibold text-gray-900 mb-2">AI Analysis</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Quality Score:</span>
                    <span className="font-medium">{(pkg as ScrapedPackage).aiAnalysis!.qualityScore}/10</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price Value:</span>
                    <span className={`font-medium capitalize ${
                      (pkg as ScrapedPackage).aiAnalysis!.priceValue === 'excellent' ? 'text-green-600' :
                      (pkg as ScrapedPackage).aiAnalysis!.priceValue === 'good' ? 'text-blue-600' :
                      (pkg as ScrapedPackage).aiAnalysis!.priceValue === 'fair' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(pkg as ScrapedPackage).aiAnalysis!.priceValue}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Highlights:</span>
                    <ul className="text-xs text-gray-600 ml-2">
                      {(pkg as ScrapedPackage).aiAnalysis!.highlights.map((highlight, i) => (
                        <li key={i}>• {highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Itinerary */}
            <div className="mt-6 border-t pt-4">
              <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Detailed Itinerary
              </h5>
              <PackageItineraryView package={pkg} showDetailed={false} />
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <div className="text-2xl font-bold text-green-600">
              ₹{pkg.price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => redirectToBookingPage({
                id: pkg.id,
                name: pkg.name,
                destination: pkg.destination,
                price: pkg.price,
                duration: pkg.duration,
                provider: pkg.provider,
                description: pkg.description
              })}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center space-x-1"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Book Now</span>
            </button>
            <button
              onClick={() => onPackageSelect(pkg)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Select Package
            </button>
            <button
              onClick={() => togglePackageSelection(pkg.id)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                selectedPackages.includes(pkg.id)
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <GitCompare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderListView = (pkg: ScrapedPackage | AIGeneratedPackage) => (
    <div key={pkg.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
      <div className="flex items-center space-x-6">
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <img 
            src={pkg.imageUrl} 
            alt={pkg.name}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute -top-2 -right-2">
            {getSourceBadge(pkg.source)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getPackageIcon(pkg)}
              <h3 className="text-lg font-bold text-gray-900 truncate">{pkg.name}</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{pkg.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-1">{pkg.description}</p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{pkg.destination}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{pkg.duration}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Package className="w-3 h-3" />
              <span className="capitalize">{pkg.category.replace('_', ' ')}</span>
            </span>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="text-right">
          <div className="text-xl font-bold text-green-600 mb-2">
            ₹{pkg.price.toLocaleString()}
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => redirectToBookingPage({
                id: pkg.id,
                name: pkg.name,
                destination: pkg.destination,
                price: pkg.price,
                duration: pkg.duration,
                provider: pkg.provider,
                description: pkg.description
              })}
              className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-medium rounded flex items-center justify-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Book Now</span>
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => onPackageSelect(pkg)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded"
              >
                Select
              </button>
              <button
                onClick={() => togglePackageSelection(pkg.id)}
                className={`p-1 rounded transition-colors duration-200 ${
                  selectedPackages.includes(pkg.id)
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <GitCompare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Perfect Package</h2>
          <p className="text-gray-600">Compare packages from web scraping and AI generation</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedPackages.length > 0 && (
            <button
              onClick={handleCompare}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center space-x-2"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare ({selectedPackages.length})</span>
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {renderFilters()}

      {/* Controls */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-md">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {packages.length} packages found
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={filter.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ai_score">AI Score</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Package className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Package Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <div className={view === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {packages.map(pkg => view === 'grid' ? renderPackageCard(pkg) : renderListView(pkg))}
        </div>
      )}
    </div>
  )
}
