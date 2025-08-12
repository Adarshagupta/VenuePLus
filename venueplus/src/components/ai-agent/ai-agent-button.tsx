'use client'

import { useState } from 'react'
import { Bot, MessageCircle, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AIAgentButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function AIAgentButton({ onClick, isOpen }: AIAgentButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/* Floating AI Agent Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 1
        }}
      >
        <motion.button
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
            text-white rounded-full p-4 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300
            ${isOpen ? 'rotate-45' : ''}
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulsing animation ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageCircle size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <Bot size={24} />
                  <motion.div
                    className="ml-1"
                    animate={{
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles size={12} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification badge */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="bg-black/80 text-white text-sm px-3 py-2 rounded-lg backdrop-blur-sm">
                <div className="font-medium">AI Travel Assistant</div>
                <div className="text-xs text-gray-300">Get instant help with hotels & bookings</div>
                
                {/* Arrow */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black/80" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Background overlay when drawer is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClick}
          />
        )}
      </AnimatePresence>
    </>
  )
}
