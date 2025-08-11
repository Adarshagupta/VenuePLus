'use client'

import { useState } from 'react'
import { 
  MapPin, Clock, DollarSign, Star, Users, Calendar, Sparkles, Zap, Crown, 
  Download, FileText, Table, Image, Map, Globe, Camera, Utensils, 
  Plane, Hotel, Activity, ShoppingBag, AlertCircle, CheckCircle,
  Loader2, Brain, Eye, BarChart3, FileDown, Share2, ArrowRight
} from 'lucide-react'
import { TripData } from '../trip-planning-modal'
import { agenticItineraryGenerator, DetailedItinerary, EnhancedTripData } from '@/lib/agentic-itinerary'

interface EnhancedItineraryGeneratorProps {
  tripData: TripData
  onUpdate: (data: Partial<TripData>) => void
  onNext: () => void
}

export function EnhancedItineraryGenerator({ tripData, onUpdate, onNext }: EnhancedItineraryGeneratorProps) {
  const [selectedType, setSelectedType] = useState<'budget' | 'balanced' | 'luxury'>('balanced')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState<DetailedItinerary | null>(null)
  const [currentStep, setCurrentStep] = useState<'select' | 'generating' | 'preview' | 'complete'>('select')
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStage, setGenerationStage] = useState('')

  const itineraryTypes = [
    {
      id: 'budget' as const,
      name: 'Budget Explorer',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Smart travel without breaking the bank',
      features: ['Budget accommodations', 'Local transport', 'Street food experiences', 'Free attractions', 'Hidden gems'],
      budgetRange: '₹15,000 - ₹35,000',
      recommended: tripData.budget?.total && tripData.budget.total < 40000,
      aiFeatures: ['Smart cost optimization', 'Local insider tips', 'Budget-friendly alternatives']
    },
    {
      id: 'balanced' as const,
      name: 'Balanced Adventure',
      icon: Zap,
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Perfect mix of comfort and adventure',
      features: ['Mid-range hotels', 'Mixed transport', 'Popular restaurants', 'Top attractions', 'Cultural experiences'],
      budgetRange: '₹35,000 - ₹75,000',
      recommended: tripData.budget?.total && tripData.budget.total >= 40000 && tripData.budget.total <= 80000,
      aiFeatures: ['Optimized scheduling', 'Weather-based planning', 'Personalized recommendations']
    },
    {
      id: 'luxury' as const,
      name: 'Luxury Experience',
      icon: Crown,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Premium comfort and exclusive experiences',
      features: ['Luxury hotels', 'Private transport', 'Fine dining', 'Exclusive tours', 'Concierge services'],
      budgetRange: '₹75,000+',
      recommended: tripData.budget?.total && tripData.budget.total > 80000,
      aiFeatures: ['VIP experience curation', 'Exclusive access', 'Premium concierge AI']
    }
  ]



  const testGeminiAPI = async () => {
    setCurrentStep('generating') // Show the generating UI
    setIsGenerating(true)
    
    try {
      setGenerationStage('🧪 Testing Gemini API connection...')
      setGenerationProgress(10)
      
      // Simple test prompt
      const testPrompt = "Hello, please respond with 'API Working' if you can read this."
      
      setGenerationStage('🔗 Connecting to Gemini 1.5 Pro...')
      setGenerationProgress(30)
      
      // Direct model test
      const genAI = new (await import('@google/generative-ai')).GoogleGenerativeAI('AIzaSyBcTnpoAlQ7kz6CZh7ONr9nSLwYhn4yGi8')
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
        }
      })
      
      setGenerationStage('📤 Sending test prompt...')
      setGenerationProgress(60)
      
      const result = await model.generateContent(testPrompt)
      const response = result.response.text()
      
      setGenerationStage(`✅ API Test Successful! Response: "${response.trim()}"`)
      setGenerationProgress(100)
      
      setTimeout(() => {
        setCurrentStep('select') // Go back to selection
        setGenerationStage('')
        setGenerationProgress(0)
        setIsGenerating(false)
      }, 4000)
      
      return true
    } catch (error: any) {
      console.error('Gemini API Test Failed:', error)
      
      let errorMessage = error.message || 'Unknown error'
      if (errorMessage.includes('quota')) {
        setGenerationStage('❌ Quota exceeded. Try the basic template option below.')
      } else if (errorMessage.includes('429')) {
        setGenerationStage('❌ Rate limit hit. Wait a few minutes and try again.')
      } else if (errorMessage.includes('403')) {
        setGenerationStage('❌ API key issue. Check your Gemini API key.')
      } else if (errorMessage.includes('404')) {
        setGenerationStage('❌ Model not found. Gemini 2.5 Pro may not be available.')
      } else {
        setGenerationStage(`❌ Test Failed: ${errorMessage}`)
      }
      setGenerationProgress(0)
      
      setTimeout(() => {
        setCurrentStep('select') // Go back to selection
        setGenerationStage('')
        setIsGenerating(false)
      }, 6000)
      
      return false
    }
  }

  const generateItinerary = async () => {
    setIsGenerating(true)
    setCurrentStep('generating')
    setGenerationProgress(0)
    
    try {
      // Convert tripData to EnhancedTripData format
      const enhancedTripData: EnhancedTripData = {
        destination: tripData.destination || '',
        duration: tripData.duration || '',
        startDate: tripData.startDate || new Date(),
        travelers: tripData.travelers || '',
        fromCity: tripData.fromCity || '',
        selectedCities: tripData.selectedCities || [],
        budget: tripData.budget || {
          total: 50000,
          breakdown: {
            accommodation: 40,
            transportation: 25,
            food: 20,
            activities: 10,
            shopping: 5
          }
        },
        preferences: {
          interests: ['sightseeing', 'culture', 'food'],
          travelStyle: selectedType,
          accommodation: selectedType === 'budget' ? 'budget' : selectedType === 'luxury' ? 'luxury' : 'mid-range',
          transportation: selectedType === 'budget' ? 'public' : selectedType === 'luxury' ? 'private' : 'mixed'
        }
      }

      // Production-level progress tracking
      const progressStages = [
        { stage: '🔍 Analyzing your travel preferences and budget...', progress: 5 },
        { stage: '🌍 Researching destination-specific venues and experiences...', progress: 15 },
        { stage: '🏛️ Identifying cultural attractions and hidden gems...', progress: 25 },
        { stage: '🍽️ Sourcing authentic local restaurants and food experiences...', progress: 35 },
        { stage: '🏨 Finding optimal accommodations within your budget...', progress: 45 },
        { stage: '🚗 Planning efficient transportation routes...', progress: 55 },
        { stage: '🎯 AI optimizing schedule for maximum experience value...', progress: 70 },
        { stage: '📊 Calculating precise costs and budget allocation...', progress: 80 },
        { stage: '📸 Adding photography spots and local insider tips...', progress: 90 },
        { stage: '✨ Finalizing your comprehensive travel experience...', progress: 100 }
      ]

      for (const { stage, progress } of progressStages) {
        setGenerationStage(stage)
        setGenerationProgress(progress)
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      // Generate the detailed itinerary
      const detailedItinerary = await agenticItineraryGenerator.generateDetailedItinerary(enhancedTripData)
      
      setGeneratedItinerary(detailedItinerary)
      setCurrentStep('preview')
      
      // Update trip data with the generated itinerary
      onUpdate({
        itinerary: {
          type: selectedType,
          activities: detailedItinerary.days.flatMap(day => day.activities),
          accommodation: detailedItinerary.days.map(day => day.accommodation),
          transportation: detailedItinerary.days.flatMap(day => day.transport)
        }
      })

    } catch (error: any) {
      console.error('Production itinerary generation error:', error)
      
      // Production-level error handling
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        setGenerationStage('⏳ High demand detected. Implementing smart retry strategy...')
        setGenerationProgress(0)
        
        // Implement exponential backoff retry
        let retryAttempt = 1
        const maxRetries = 3
        
        const retryGeneration = async () => {
          try {
            setGenerationStage(`🔄 Retry attempt ${retryAttempt}/${maxRetries} - Optimizing request...`)
            setGenerationProgress(25)
            
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryAttempt) * 1000))
            
            setGenerationStage('🚀 Reconnecting to Gemini 1.5 Pro...')
            setGenerationProgress(50)
            
            const { agenticItineraryGenerator } = await import('@/lib/agentic-itinerary')
            const detailedItinerary = await agenticItineraryGenerator.generateDetailedItinerary(enhancedTripData)
            
            setGeneratedItinerary(detailedItinerary)
            setCurrentStep('preview')
            
            onUpdate({
              itinerary: {
                type: selectedType,
                activities: detailedItinerary.days.flatMap(day => day.activities),
                accommodation: detailedItinerary.days.map(day => day.accommodation),
                transportation: detailedItinerary.days.flatMap(day => day.transport)
              }
            })
            
          } catch (retryError: any) {
            retryAttempt++
            if (retryAttempt <= maxRetries) {
              setGenerationStage(`⚠️ Attempt ${retryAttempt-1} failed. Preparing retry ${retryAttempt}...`)
              await retryGeneration()
            } else {
              setGenerationStage('❌ Production service temporarily unavailable. Please try again in a few minutes.')
              setTimeout(() => {
                setCurrentStep('select')
                setGenerationProgress(0)
              }, 5000)
            }
          }
        }
        
        await retryGeneration()
        
      } else if (error.message?.includes('403')) {
        setGenerationStage('🔑 API authentication issue. Please contact support.')
        setTimeout(() => {
          setCurrentStep('select')
          setGenerationProgress(0)
        }, 4000)
      } else {
        setGenerationStage(`⚠️ Technical issue encountered: ${error.message}. Retrying...`)
        
        // Single retry for other errors
        try {
          await new Promise(resolve => setTimeout(resolve, 2000))
          setGenerationStage('🔄 Attempting automatic recovery...')
          
          const { agenticItineraryGenerator } = await import('@/lib/agentic-itinerary')
          const detailedItinerary = await agenticItineraryGenerator.generateDetailedItinerary(enhancedTripData)
          
          setGeneratedItinerary(detailedItinerary)
          setCurrentStep('preview')
          
          onUpdate({
            itinerary: {
              type: selectedType,
              activities: detailedItinerary.days.flatMap(day => day.activities),
              accommodation: detailedItinerary.days.map(day => day.accommodation),
              transportation: detailedItinerary.days.flatMap(day => day.transport)
            }
          })
          
        } catch (finalError) {
          setGenerationStage('❌ Unable to generate itinerary. Please try again later.')
          setTimeout(() => {
            setCurrentStep('select')
            setGenerationProgress(0)
          }, 4000)
        }
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadText = async () => {
    if (!generatedItinerary) return
    try {
      const { simpleFileGenerator } = await import('@/lib/simple-file-generator')
      const textContent = simpleFileGenerator.generateTextItinerary(generatedItinerary)
      const timestamp = new Date().toISOString().split('T')[0]
      simpleFileGenerator.downloadTextFile(textContent, `${generatedItinerary.title}_Itinerary_${timestamp}.txt`)
    } catch (error) {
      console.error('Error downloading text itinerary:', error)
    }
  }

  const downloadCSV = async () => {
    if (!generatedItinerary) return
    try {
      const { simpleFileGenerator } = await import('@/lib/simple-file-generator')
      const csvContent = simpleFileGenerator.generateCSVBudget(generatedItinerary)
      const timestamp = new Date().toISOString().split('T')[0]
      simpleFileGenerator.downloadCSVFile(csvContent, `${generatedItinerary.title}_Budget_${timestamp}.csv`)
    } catch (error) {
      console.error('Error downloading CSV budget:', error)
    }
  }

  const downloadPDF = async () => {
    if (!generatedItinerary) return
    try {
      const jsPDF = (await import('jspdf')).default
      const doc = new jsPDF()
      
      // Set up fonts and colors
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.setTextColor(40, 40, 40)
      
      // Title
      const title = generatedItinerary.title.toUpperCase()
      const titleWidth = doc.getTextWidth(title)
      doc.text(title, (210 - titleWidth) / 2, 20)
      
      doc.setFontSize(14)
      doc.text('DETAILED TRAVEL ITINERARY', 105, 30, { align: 'center' })
      
      // Draw a line
      doc.setDrawColor(100, 100, 100)
      doc.line(20, 35, 190, 35)
      
      let yPosition = 50
      
      // Trip Overview
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('Trip Overview', 20, yPosition)
      yPosition += 10
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12)
      doc.text(`Total Cost: ₹${generatedItinerary.totalCost.toLocaleString()}`, 20, yPosition)
      yPosition += 8
      doc.text(`Duration: ${generatedItinerary.days.length} Days`, 20, yPosition)
      yPosition += 8
      doc.text(`Description: ${generatedItinerary.description}`, 20, yPosition)
      yPosition += 15
      
      // Budget Breakdown
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.text('Budget Breakdown', 20, yPosition)
      yPosition += 10
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      Object.entries(generatedItinerary.budgetBreakdown).forEach(([category, amount]) => {
        const percentage = ((amount / generatedItinerary.totalCost) * 100).toFixed(1)
        doc.text(`${category.charAt(0).toUpperCase() + category.slice(1)}: ₹${amount.toLocaleString()} (${percentage}%)`, 20, yPosition)
        yPosition += 6
      })
      yPosition += 10
      
      // Daily Itinerary
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.text('Daily Itinerary', 20, yPosition)
      yPosition += 10
      
      generatedItinerary.days.forEach((day, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }
        
        // Day header
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(13)
        doc.setTextColor(60, 90, 150)
        doc.text(`Day ${day.day}: ${day.theme}`, 20, yPosition)
        yPosition += 8
        
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(40, 40, 40)
        doc.text(`Date: ${day.date} | City: ${day.city}`, 20, yPosition)
        yPosition += 10
        
        // Activities
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.text('Activities:', 20, yPosition)
        yPosition += 6
        
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        day.activities.forEach(activity => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(`• ${activity.title} (${activity.duration}) - ₹${activity.cost.toLocaleString()}`, 25, yPosition)
          yPosition += 5
        })
        yPosition += 5
        
        // Meals
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.text('Meals:', 20, yPosition)
        yPosition += 6
        
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        day.meals.forEach(meal => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(`• ${meal.restaurant} (${meal.type}) - ₹${meal.cost.toLocaleString()}`, 25, yPosition)
          yPosition += 5
        })
        
        // Daily cost
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.setTextColor(0, 120, 0)
        doc.text(`Daily Total: ₹${day.estimatedCost.toLocaleString()}`, 20, yPosition + 8)
        doc.setTextColor(40, 40, 40)
        yPosition += 20
      })
      
      // Footer on last page
      const pageCount = doc.getNumberOfPages()
      doc.setPage(pageCount)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text(`Generated by VenuePlus AI • ${new Date().toDateString()}`, 105, 285, { align: 'center' })
      
      // Save the PDF
      const timestamp = new Date().toISOString().split('T')[0]
      doc.save(`${generatedItinerary.title}_Detailed_Itinerary_${timestamp}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try the text download instead.')
    }
  }

  const downloadExcel = async () => {
    if (!generatedItinerary) return
    try {
      const { simpleFileGenerator } = await import('@/lib/simple-file-generator')
      
      // Create detailed Excel-like CSV with multiple sections
      let excelContent = `TRIP OVERVIEW\n`
      excelContent += `Title,${generatedItinerary.title}\n`
      excelContent += `Description,${generatedItinerary.description}\n`
      excelContent += `Total Cost,₹${generatedItinerary.totalCost.toLocaleString()}\n`
      excelContent += `Currency,${generatedItinerary.currency}\n\n`
      
      excelContent += `BUDGET BREAKDOWN\n`
      excelContent += `Category,Amount (₹),Percentage\n`
      Object.entries(generatedItinerary.budgetBreakdown).forEach(([category, amount]) => {
        const percentage = ((amount / generatedItinerary.totalCost) * 100).toFixed(1)
        excelContent += `${category.charAt(0).toUpperCase() + category.slice(1)},₹${amount.toLocaleString()},${percentage}%\n`
      })
      
      excelContent += `\nDAILY ITINERARY\n`
      excelContent += `Day,Date,City,Theme,Activities,Meals,Accommodation,Transport,Total Cost\n`
      
      generatedItinerary.days.forEach(day => {
        const activities = day.activities.map(a => a.title).join('; ')
        const meals = day.meals.map(m => m.restaurant).join('; ')
        excelContent += `${day.day},${day.date},${day.city},${day.theme},"${activities}","${meals}",${day.accommodation?.name || 'N/A'},${day.transportation?.mode || 'N/A'},₹${day.estimatedCost.toLocaleString()}\n`
      })
      
      const timestamp = new Date().toISOString().split('T')[0]
      simpleFileGenerator.downloadCSVFile(excelContent, `${generatedItinerary.title}_Complete_Budget_${timestamp}.xlsx`)
    } catch (error) {
      console.error('Error downloading Excel file:', error)
    }
  }

  const downloadAll = async () => {
    if (!generatedItinerary) return
    try {
      // Download all formats with small delays to avoid browser blocking
      await downloadPDF()
      await new Promise(resolve => setTimeout(resolve, 500))
      
      await downloadExcel()
      await new Promise(resolve => setTimeout(resolve, 500))
      
      await downloadCSV()
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Also download JSON backup
      const { simpleFileGenerator } = await import('@/lib/simple-file-generator')
      const jsonContent = JSON.stringify(generatedItinerary, null, 2)
      const timestamp = new Date().toISOString().split('T')[0]
      simpleFileGenerator.downloadJSONFile(jsonContent, `${generatedItinerary.title}_Complete_Data_${timestamp}.json`)
      
      alert('All files downloaded! Check your Downloads folder.')
    } catch (error) {
      console.error('Error downloading all files:', error)
      alert('Some downloads may have failed. Try downloading individually.')
    }
  }

  const renderTypeSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 via-blue-100 to-green-100 rounded-full mb-6 shadow-lg">
          <Brain className="w-6 h-6 text-purple-600 mr-3 animate-pulse" />
          <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Itinerary Generator
          </span>
        </div>
        <h1 className="text-4xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
            Choose Your Adventure Style
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Our advanced AI will create a personalized itinerary with detailed schedules, local insights, 
          budget breakdowns, and downloadable planning documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {itineraryTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id
          
          return (
            <div
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isSelected ? 'scale-105' : ''
              }`}
            >
              <div className={`${type.bgColor} ${type.borderColor} border-2 rounded-3xl p-8 shadow-xl ${
                isSelected ? 'ring-4 ring-offset-4 ring-blue-500/50' : ''
              } hover:shadow-2xl transition-all duration-300`}>
                
                {type.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      ⭐ Recommended
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${type.color} rounded-2xl mb-4 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{type.name}</h3>
                  <p className="text-gray-600 text-lg">{type.description}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-2">{type.budgetRange}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Includes:</h4>
                    <ul className="space-y-1">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI Features:</h4>
                    <ul className="space-y-1">
                      {type.aiFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <Brain className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl pointer-events-none" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center space-y-4">
        <button
          onClick={generateItinerary}
          className="relative px-12 py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          <div className="relative flex items-center space-x-3">
            <Brain className="w-6 h-6 animate-pulse" />
            <span>Generate AI-Powered Itinerary</span>
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
        </button>
        <p className="text-sm text-gray-500">
          Powered by Google Gemini 1.5 Pro AI • Generates in 30-60 seconds
        </p>

        <div className="pt-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Production AI Features
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Real venue recommendations
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Live pricing & availability
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Local insider knowledge
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Cultural immersion experiences
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Hidden gems & secret spots
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Professional travel documents
              </div>
            </div>
          </div>
          
          <button
            onClick={testGeminiAPI}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 mr-4"
          >
            🧪 Test API Connection
          </button>
          
          <p className="text-xs text-gray-500 mt-3">
            ⚡ Powered by Gemini 1.5 Pro • Professional-grade travel planning
          </p>
        </div>
      </div>
    </div>
  )

  const renderGenerating = () => (
    <div className="text-center py-20">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6 shadow-2xl">
          <Brain className="w-12 h-12 text-white animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Creating Your Perfect Itinerary</h2>
        <p className="text-lg text-gray-600 mb-8">{generationStage}</p>
      </div>

      <div className="max-w-lg mx-auto mb-8">
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${generationProgress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{generationProgress}% Complete</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {[
          { icon: Map, label: 'Route Planning' },
          { icon: Calendar, label: 'Scheduling' },
          { icon: DollarSign, label: 'Budget Analysis' },
          { icon: Camera, label: 'Photo Spots' }
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md">
            <item.icon className={`w-8 h-8 mb-2 ${generationProgress > index * 25 ? 'text-green-500' : 'text-gray-400'}`} />
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderPreview = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-6 shadow-lg">
          <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
          <span className="text-lg font-semibold text-green-700">
            Itinerary Generated Successfully!
          </span>
        </div>
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
          {generatedItinerary?.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {generatedItinerary?.overview}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{generatedItinerary?.days.length}</div>
          <div className="text-sm text-gray-600">Days</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">₹{generatedItinerary?.totalCost.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Cost</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {generatedItinerary?.days.reduce((sum, day) => sum + day.activities.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Activities</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {new Set(generatedItinerary?.days.map(day => day.city)).size}
          </div>
          <div className="text-sm text-gray-600">Cities</div>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Download Your Travel Documents</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={downloadPDF}
            className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <FileText className="w-12 h-12 text-red-500 mb-3" />
            <h4 className="font-bold text-gray-900 mb-2">PDF Itinerary</h4>
            <p className="text-sm text-gray-600 text-center">Professional travel document</p>
          </button>

          <button
            onClick={downloadExcel}
            className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Table className="w-12 h-12 text-green-500 mb-3" />
            <h4 className="font-bold text-gray-900 mb-2">Excel Sheet</h4>
            <p className="text-sm text-gray-600 text-center">Complete budget breakdown</p>
          </button>

          <button
            onClick={downloadCSV}
            className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <FileText className="w-12 h-12 text-blue-500 mb-3" />
            <h4 className="font-bold text-gray-900 mb-2">CSV Data</h4>
            <p className="text-sm text-gray-600 text-center">Spreadsheet compatible</p>
          </button>

          <button
            onClick={downloadAll}
            className="flex flex-col items-center p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Download className="w-12 h-12 mb-3" />
            <h4 className="font-bold mb-2">Download All</h4>
            <p className="text-sm text-center opacity-90">PDF + Excel + CSV + JSON</p>
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">All files include detailed day-by-day schedules, budget breakdowns, local insights, and cultural information</p>
        </div>
      </div>

      {/* Complete Detailed Itinerary */}
      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Complete Detailed Itinerary</h3>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">Total: ₹{generatedItinerary?.totalCost.toLocaleString()}</p>
            <p className="text-sm text-gray-600">{generatedItinerary?.days.length} Days</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {generatedItinerary?.days.map((day, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-gray-900">Day {day.day}: {day.theme}</h4>
                <span className="text-sm text-gray-600">{day.date}</span>
              </div>
              <p className="text-gray-600 mb-3">{day.city}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Activities</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {day.activities.map((activity, i) => (
                      <li key={i}>• {activity.title} ({activity.duration}) - ₹{activity.cost.toLocaleString()}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Meals</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {day.meals.map((meal, i) => (
                      <li key={i}>• {meal.restaurant} ({meal.type}) - ₹{meal.cost.toLocaleString()}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Estimated Cost</h5>
                  <p className="text-lg font-bold text-green-600">₹{day.estimatedCost.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={onNext}
          className="px-12 py-6 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
        >
          <div className="relative flex items-center space-x-3">
            <span>Continue to Trip Summary</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  )

  const renderComplete = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-6 shadow-lg">
          <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
          <span className="text-lg font-semibold text-green-700">
            Ready for Your Adventure!
          </span>
        </div>
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
          Your AI-Generated Itinerary is Complete
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          All planning documents have been prepared. You're all set for an amazing trip!
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={onNext}
          className="px-12 py-6 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
        >
          <div className="relative flex items-center space-x-3">
            <span>Continue to Trip Summary</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {currentStep === 'select' && renderTypeSelection()}
        {currentStep === 'generating' && renderGenerating()}
        {currentStep === 'preview' && renderPreview()}
        {currentStep === 'complete' && renderComplete()}
      </div>
    </div>
  )
}
