"use client"

import { useEffect, useRef, useState } from 'react'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale'
  delay?: number
  duration?: number
}

export default function AnimatedSection({ 
  children, 
  className = '', 
  animation = 'fade',
  delay = 0,
  duration = 600
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-50px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getAnimationClasses = () => {
    const baseClasses = `transition-all duration-${duration} ease-out`
    
    if (!isVisible) {
      switch (animation) {
        case 'fade':
          return `${baseClasses} opacity-0`
        case 'slide-up':
          return `${baseClasses} opacity-0 translate-y-10`
        case 'slide-left':
          return `${baseClasses} opacity-0 translate-x-10`
        case 'slide-right':
          return `${baseClasses} opacity-0 -translate-x-10`
        case 'scale':
          return `${baseClasses} opacity-0 scale-95`
        default:
          return `${baseClasses} opacity-0`
      }
    }
    
    return `${baseClasses} opacity-100 translate-y-0 translate-x-0 scale-100`
  }

  return (
    <div 
      ref={sectionRef} 
      className={`${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  )
}

// Hook pour les animations de compteur
export function useCountAnimation(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const endTime = startTime + duration

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [isVisible, end, duration])

  return { count, setIsVisible }
}

// Composant pour les statistiques animées
export function AnimatedCounter({ 
  value, 
  label, 
  suffix = '' 
}: { 
  value: number
  label: string
  suffix?: string
}) {
  const counterRef = useRef<HTMLDivElement>(null)
  const { count, setIsVisible } = useCountAnimation(value)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [setIsVisible])

  return (
    <div ref={counterRef} className="text-center">
      <div className="text-4xl font-bold text-blue-600 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}
