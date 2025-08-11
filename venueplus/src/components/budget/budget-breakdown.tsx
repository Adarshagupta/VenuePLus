'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

interface BudgetItem {
  category: string
  planned: number
  actual: number
  items: Array<{
    name: string
    amount: number
    date: string
  }>
}

interface BudgetBreakdownProps {
  tripId: string
}

export function BudgetBreakdown({ tripId }: BudgetBreakdownProps) {
  const [budget, setBudget] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBudget()
  }, [tripId])

  const fetchBudget = async () => {
    try {
      // Mock data for now
      const mockBudget: BudgetItem[] = [
        {
          category: 'Accommodation',
          planned: 400,
          actual: 420,
          items: [
            { name: 'Beachfront Resort (3 nights)', amount: 420, date: '2025-08-13' }
          ]
        },
        {
          category: 'Transportation',
          planned: 150,
          actual: 140,
          items: [
            { name: 'Airport Transfer', amount: 25, date: '2025-08-13' },
            { name: 'Car Rental (2 days)', amount: 80, date: '2025-08-14' },
            { name: 'Local Transport', amount: 35, date: '2025-08-15' }
          ]
        },
        {
          category: 'Activities',
          planned: 200,
          actual: 180,
          items: [
            { name: 'Tanah Lot Temple Visit', amount: 15, date: '2025-08-13' },
            { name: 'Ubud Rice Terraces Tour', amount: 50, date: '2025-08-14' },
            { name: 'Monkey Forest Entry', amount: 5, date: '2025-08-14' },
            { name: 'Balinese Cooking Class', amount: 75, date: '2025-08-15' },
            { name: 'Beach Activities', amount: 35, date: '2025-08-16' }
          ]
        },
        {
          category: 'Food & Dining',
          planned: 300,
          actual: 275,
          items: [
            { name: 'Resort Meals', amount: 120, date: '2025-08-13' },
            { name: 'Local Restaurant Dinners', amount: 90, date: '2025-08-14' },
            { name: 'Street Food & Snacks', amount: 45, date: '2025-08-15' },
            { name: 'Breakfast & Coffee', amount: 20, date: '2025-08-16' }
          ]
        },
        {
          category: 'Shopping & Souvenirs',
          planned: 150,
          actual: 120,
          items: [
            { name: 'Local Handicrafts', amount: 60, date: '2025-08-14' },
            { name: 'Clothing & Accessories', amount: 40, date: '2025-08-15' },
            { name: 'Gifts & Souvenirs', amount: 20, date: '2025-08-16' }
          ]
        }
      ]
      
      setBudget(mockBudget)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching budget:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-gentle-pulse text-slate-600 text-center py-12">
        Loading budget breakdown...
      </div>
    )
  }

  const totalPlanned = budget.reduce((sum, item) => sum + item.planned, 0)
  const totalActual = budget.reduce((sum, item) => sum + item.actual, 0)
  const variance = totalActual - totalPlanned
  const variancePercentage = totalPlanned > 0 ? (variance / totalPlanned) * 100 : 0

  const getCategoryColor = (category: string) => {
    const colors = {
      'Accommodation': 'bg-blue-500',
      'Transportation': 'bg-green-500',
      'Activities': 'bg-purple-500',
      'Food & Dining': 'bg-orange-500',
      'Shopping & Souvenirs': 'bg-pink-500'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="space-y-8">
      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-elegant p-6 text-center">
          <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-800">${totalPlanned}</div>
          <div className="text-sm text-slate-600">Planned Budget</div>
        </div>
        
        <div className="card-elegant p-6 text-center">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-800">${totalActual}</div>
          <div className="text-sm text-slate-600">Actual Spending</div>
        </div>
        
        <div className="card-elegant p-6 text-center">
          <AlertCircle className={`w-8 h-8 mx-auto mb-3 ${variance > 0 ? 'text-red-600' : 'text-green-600'}`} />
          <div className={`text-2xl font-bold ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {variance > 0 ? '+' : ''}${variance}
          </div>
          <div className="text-sm text-slate-600">
            {variancePercentage > 0 ? '+' : ''}{variancePercentage.toFixed(1)}% variance
          </div>
        </div>
      </div>

      {/* Budget Chart */}
      <div className="card-elegant p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Budget vs Actual by Category</h3>
        
        <div className="space-y-6">
          {budget.map((item) => {
            const percentage = totalPlanned > 0 ? (item.planned / totalPlanned) * 100 : 0
            const actualPercentage = totalActual > 0 ? (item.actual / totalActual) * 100 : 0
            
            return (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getCategoryColor(item.category)}`}></div>
                    <span className="font-medium text-slate-800">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800">${item.actual}</div>
                    <div className="text-sm text-slate-600">of ${item.planned}</div>
                  </div>
                </div>
                
                <div className="relative">
                  {/* Planned budget bar (background) */}
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full opacity-50 ${getCategoryColor(item.category)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Actual spending bar (foreground) */}
                  <div 
                    className={`absolute top-0 h-3 rounded-full ${getCategoryColor(item.category)}`}
                    style={{ width: `${actualPercentage}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-slate-500">
                  {item.actual > item.planned ? 
                    `$${item.actual - item.planned} over budget` : 
                    `$${item.planned - item.actual} under budget`
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budget.map((category) => (
          <div key={category.category} className="card-elegant p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-800">{category.category}</h4>
              <div className="text-right">
                <div className="font-semibold text-slate-800">${category.actual}</div>
                <div className="text-sm text-slate-600">of ${category.planned}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {category.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                  <div className="flex-1">
                    <div className="font-medium text-slate-700">{item.name}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="font-semibold text-slate-800">${item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Expense Button */}
      <div className="text-center">
        <button className="btn-secondary">
          + Add New Expense
        </button>
      </div>
    </div>
  )
}
