'use client'

import { useState, useEffect } from 'react'
import { AIAgentButton } from './ai-agent-button'
import { AIAgentDrawer } from './ai-agent-drawer'

export function AIAgent() {
  const [isOpen, setIsOpen] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <AIAgentButton onClick={toggleDrawer} isOpen={isOpen} />
      <AIAgentDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export { AIAgentButton } from './ai-agent-button'
export { AIAgentDrawer } from './ai-agent-drawer'
