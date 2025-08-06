"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Star, Check } from "lucide-react"

interface AnimatedButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  disabled?: boolean
}

export function AnimatedButton({
  children,
  className = '',
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false
}: AnimatedButtonProps) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    if (disabled) return
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
    onClick?.()
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-md hover:shadow-lg'
      case 'outline':
        return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm'
      case 'md':
        return 'px-6 py-3 text-base'
      case 'lg':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-6 py-3 text-base'
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
        relative overflow-hidden rounded-lg font-medium
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        ${isClicked ? 'animate-pulse' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        group
      `}
    >
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      <span className="relative flex items-center justify-center gap-2">
        {children}
        {icon && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </span>
    </button>
  )
}

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  delay?: number
}

export function AnimatedCard({ 
  children, 
  className = '', 
  hover = true,
  delay = 0
}: AnimatedCardProps) {
  return (
    <Card 
      className={`
        ${className}
        transition-all duration-500 ease-out
        ${hover ? 'hover:shadow-2xl hover:-translate-y-2' : ''}
        animate-in fade-in slide-in-from-bottom-4
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Card>
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  amplitude?: number
  duration?: number
  delay?: number
}

export function FloatingElement({
  children,
  className = '',
  amplitude = 10,
  duration = 3000,
  delay = 0
}: FloatingElementProps) {
  return (
    <div
      className={`${className} animate-float`}
      style={{
        '--float-amplitude': `${amplitude}px`,
        '--float-duration': `${duration}ms`,
        '--float-delay': `${delay}ms`,
        animationDelay: `${delay}ms`
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

interface ParallaxElementProps {
  children: React.ReactNode
  className?: string
  offset?: number
}

export function ParallaxElement({
  children,
  className = '',
  offset = 0.5
}: ParallaxElementProps) {
  return (
    <div
      className={`${className} transform transition-transform duration-300 ease-out`}
      style={{
        transform: `translateY(${offset * 50}px)`,
      }}
    >
      {children}
    </div>
  )
}

interface PulseElementProps {
  children: React.ReactNode
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  duration?: number
}

export function PulseElement({
  children,
  className = '',
  intensity = 'medium',
  duration = 2000
}: PulseElementProps) {
  const getIntensityClasses = () => {
    switch (intensity) {
      case 'low':
        return 'animate-pulse-low'
      case 'medium':
        return 'animate-pulse'
      case 'high':
        return 'animate-pulse-high'
      default:
        return 'animate-pulse'
    }
  }

  return (
    <div
      className={`${className} ${getIntensityClasses()}`}
      style={{
        animationDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  )
}

// Composant pour les notifications toast avec animation
export function AnimatedToast({ 
  message, 
  type = 'success', 
  onClose 
}: { 
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
}) {
  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-black'
      case 'info':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-green-500 text-white'
    }
  }

  return (
    <div className={`
      fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg
      ${getTypeClasses()}
      transform transition-all duration-300 ease-out
      animate-in slide-in-from-top-full
      max-w-md
    `}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-current hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  )
}
