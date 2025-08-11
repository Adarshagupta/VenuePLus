'use client'

import { useState, useEffect } from 'react'
import { DollarSign, PieChart, Calculator, TrendingUp, Home, Plane, UtensilsCrossed, Camera, ShoppingBag, Sparkles, Target, ArrowRight, Users, Calendar } from 'lucide-react'
import { TripData } from '../trip-planning-modal'

interface BudgetPlannerProps {
  tripData: TripData
  onUpdate: (data: Partial<TripData>) => void
  onNext: () => void
}

export function BudgetPlanner({ tripData, onUpdate, onNext }: BudgetPlannerProps) {
  // Helper function to validate percentage values
  const validatePercentage = (value: number | undefined, defaultValue: number): number => {
    if (typeof value !== 'number' || value < 0 || value > 100) {
      return defaultValue
    }
    return value
  }

  const [totalBudget, setTotalBudget] = useState(tripData.budget?.total || 50000)
  const [budgetBreakdown, setBudgetBreakdown] = useState({
    accommodation: validatePercentage(tripData.budget?.breakdown?.accommodation, 40),
    transportation: validatePercentage(tripData.budget?.breakdown?.transportation, 25),
    food: validatePercentage(tripData.budget?.breakdown?.food, 20),
    activities: validatePercentage(tripData.budget?.breakdown?.activities, 10),
    shopping: validatePercentage(tripData.budget?.breakdown?.shopping, 5)
  })

  const calculateAmounts = () => {
    return {
      accommodation: Math.round((totalBudget * budgetBreakdown.accommodation) / 100),
      transportation: Math.round((totalBudget * budgetBreakdown.transportation) / 100),
      food: Math.round((totalBudget * budgetBreakdown.food) / 100),
      activities: Math.round((totalBudget * budgetBreakdown.activities) / 100),
      shopping: Math.round((totalBudget * budgetBreakdown.shopping) / 100)
    }
  }

  const amounts = calculateAmounts()

  // Clean up corrupted data on component mount
  useEffect(() => {
    const breakdown = tripData.budget?.breakdown
    if (breakdown) {
      const hasCorruptedData = Object.values(breakdown).some(value => 
        typeof value === 'number' && value > 100
      )
      
      if (hasCorruptedData) {
        console.log('Detected corrupted budget data, resetting to defaults')
        // Reset to default percentages
        const defaultBreakdown = {
          accommodation: 40,
          transportation: 25,
          food: 20,
          activities: 10,
          shopping: 5
        }
        setBudgetBreakdown(defaultBreakdown)
        
        // Also update the trip data to prevent corruption from persisting
        onUpdate({ 
          budget: {
            total: totalBudget,
            breakdown: defaultBreakdown
          }
        })
      }
    }
  }, [])

  const handlePercentageChange = (category: string, value: number) => {
    const newBreakdown = { ...budgetBreakdown, [category]: value }
    const total = Object.values(newBreakdown).reduce((sum, val) => sum + val, 0)
    
    if (total <= 100) {
      setBudgetBreakdown(newBreakdown)
    }
  }

  const handleContinue = () => {
    const budget = {
      total: totalBudget,
      breakdown: budgetBreakdown
    }
    onUpdate({ budget })
    onNext()
  }

  const resetToDefaults = () => {
    const defaultBreakdown = {
      accommodation: 40,
      transportation: 25,
      food: 20,
      activities: 10,
      shopping: 5
    }
    setBudgetBreakdown(defaultBreakdown)
    setTotalBudget(50000)
  }

  const budgetCategories = [
    {
      key: 'accommodation',
      label: 'Accommodation',
      icon: Home,
      gradient: 'from-gray-600 to-gray-700',
      bgGradient: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-800',
      description: 'Hotels, resorts, homestays',
      emoji: '🏨'
    },
    {
      key: 'transportation',
      label: 'Transportation',
      icon: Plane,
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-slate-50 to-slate-100',
      borderColor: 'border-slate-300',
      textColor: 'text-slate-800',
      description: 'Flights, local transport',
      emoji: '✈️'
    },
    {
      key: 'food',
      label: 'Food & Dining',
      icon: UtensilsCrossed,
      gradient: 'from-zinc-600 to-zinc-700',
      bgGradient: 'from-zinc-50 to-zinc-100',
      borderColor: 'border-zinc-300',
      textColor: 'text-zinc-800',
      description: 'Meals, restaurants, street food',
      emoji: '🍽️'
    },
    {
      key: 'activities',
      label: 'Activities',
      icon: Camera,
      gradient: 'from-stone-600 to-stone-700',
      bgGradient: 'from-stone-50 to-stone-100',
      borderColor: 'border-stone-300',
      textColor: 'text-stone-800',
      description: 'Tours, experiences, sightseeing',
      emoji: '🎭'
    },
    {
      key: 'shopping',
      label: 'Shopping',
      icon: ShoppingBag,
      gradient: 'from-neutral-600 to-neutral-700',
      bgGradient: 'from-neutral-50 to-neutral-100',
      borderColor: 'border-neutral-300',
      textColor: 'text-neutral-800',
      description: 'Souvenirs, local products',
      emoji: '🛍️'
    }
  ]

  const totalPercentage = Object.values(budgetBreakdown).reduce((sum, val) => sum + val, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full mb-4 shadow-sm">
            <Calculator className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm font-semibold text-gray-800">
              Budget Planner
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-3 text-gray-900">
            Plan Your Travel Budget
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create a smart budget breakdown for your <span className="font-semibold text-gray-800">{tripData.duration}</span> adventure to{' '}
            <span className="font-semibold text-gray-800">{tripData.destination}</span>
          </p>
          <button 
            onClick={resetToDefaults}
            className="mt-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            title="Reset budget to default values"
          >
            Reset to Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Side - Budget Input & Controls */}
          <div className="space-y-6">
            {/* Total Budget Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-3 shadow-sm">
                  <Target className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Set Your Budget</h3>
                <p className="text-sm text-gray-600">How much would you like to spend on this trip?</p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                    <span className="text-lg font-bold text-gray-600">₹</span>
                  </div>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-4 text-xl font-bold text-center bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-300"
                    placeholder="50000"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[25000, 50000, 100000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTotalBudget(amount)}
                      className={`py-3 px-3 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 ${
                        totalBudget === amount
                          ? 'bg-gray-800 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400 hover:shadow-md'
                      }`}
                    >
                      ₹{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Breakdown Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-3 shadow-sm">
                  <PieChart className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customize Your Spending</h3>
                <p className="text-sm text-gray-600">Adjust the budget allocation for each category</p>
              </div>

              <div className="space-y-4">
                {budgetCategories.map((category) => {
                  const Icon = category.icon
                  const percentage = budgetBreakdown[category.key as keyof typeof budgetBreakdown]
                  const amount = amounts[category.key as keyof typeof amounts]
                  
                  return (
                    <div key={category.key} className={`bg-gradient-to-r ${category.bgGradient} border ${category.borderColor} rounded-xl p-4 transition-all duration-300 hover:shadow-lg`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 bg-gradient-to-r ${category.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                            <span className="text-lg">{category.emoji}</span>
                          </div>
                          <div>
                            <h4 className={`font-bold ${category.textColor} text-sm`}>
                              {category.label}
                            </h4>
                            <p className="text-xs text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${category.textColor}`}>
                            ₹{amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">{percentage}%</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="60"
                          value={percentage}
                          onChange={(e) => handlePercentageChange(category.key, Number(e.target.value))}
                          className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-${category.key} transition-all duration-300`}
                          style={{
                            background: `linear-gradient(to right, 
                              #4B5563 0%, 
                              #4B5563 ${percentage}%, 
                              #E5E7EB ${percentage}%, 
                              #E5E7EB 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>60%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className={`mt-6 p-4 rounded-xl transition-all duration-300 ${
                totalPercentage === 100 
                  ? 'bg-gray-50 border-2 border-gray-300' 
                  : 'bg-yellow-50 border-2 border-yellow-300'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">Total Allocated:</span>
                  <span className={`text-xl font-bold ${totalPercentage === 100 ? 'text-gray-800' : 'text-yellow-700'}`}>
                    {totalPercentage}%
                  </span>
                </div>
                {totalPercentage !== 100 && (
                  <p className="text-xs text-yellow-700 mt-2 font-medium">
                    {totalPercentage < 100 ? '🎯 You have unallocated budget remaining' : '⚠️ Budget allocation exceeds 100%'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Visual Summary */}
          <div className="space-y-6">
            {/* Animated Budget Visualization */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-3 shadow-sm">
                  <TrendingUp className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Budget Preview</h3>
                <p className="text-sm text-gray-600">Real-time budget allocation overview</p>
              </div>

              <div className="space-y-4">
                {budgetCategories.map((category) => {
                  const percentage = budgetBreakdown[category.key as keyof typeof budgetBreakdown]
                  const amount = amounts[category.key as keyof typeof amounts]
                  const Icon = category.icon

                  return (
                    <div key={category.key} className="group hover:scale-105 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 bg-gradient-to-r ${category.gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                            <span className="text-sm">{category.emoji}</span>
                          </div>
                          <span className={`font-bold ${category.textColor} text-sm`}>
                            {category.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${category.textColor} tabular-nums`}>
                            ₹{amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">{percentage}%</div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`bg-gray-600 h-3 rounded-full transition-all duration-700 ease-out`}
                            style={{ width: `${percentage}%` }}
                          >
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Total Budget Summary */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg text-white border border-gray-700">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-700 rounded-xl mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-100">Your Trip Budget</h3>
                <div className="text-3xl font-extrabold mb-3 tabular-nums text-white">
                  ₹{totalBudget.toLocaleString()}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-3 text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span className="text-xs font-medium">{tripData.travelers} travelers</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs font-medium">{tripData.duration}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">
                    For your trip to <span className="font-semibold text-gray-200">{tripData.destination}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 text-center">
          <div className="relative inline-block">
            <button
              onClick={handleContinue}
              disabled={totalPercentage !== 100}
              className={`relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                totalPercentage === 100
                  ? 'bg-gray-800 text-white hover:bg-gray-900 shadow-lg hover:shadow-xl hover:scale-105 group'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed scale-95 opacity-60'
              }`}
            >
              <div className="relative flex items-center space-x-2">
                <span>Continue to Itinerary Planning</span>
                <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${totalPercentage === 100 ? 'group-hover:translate-x-1' : ''}`} />
              </div>
            </button>
          </div>
          
          {totalPercentage !== 100 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-sm mx-auto">
              <p className="text-yellow-800 font-medium text-sm">
                🎯 Please allocate exactly 100% of your budget to continue
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Current allocation: <span className="font-bold">{totalPercentage}%</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
