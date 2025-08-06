"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  fill = false,
  sizes,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer pour le lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px'
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  // Générer un blur data URL par défaut
  const defaultBlurDataURL = `data:image/svg+xml;base64,${btoa(
    `<svg width="${width || 400}" height="${height || 300}" viewBox="0 0 ${width || 400} ${height || 300}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f1f5f9"/>
      <rect x="20%" y="40%" width="60%" height="20%" fill="#e2e8f0" rx="4"/>
    </svg>`
  )}`

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setIsError(true)
    onError?.()
  }

  // Placeholder pendant le chargement
  const LoadingPlaceholder = () => (
    <div 
      className={`
        bg-gray-100 animate-pulse flex items-center justify-center
        ${fill ? 'absolute inset-0' : ''}
        ${className}
      `}
      style={!fill ? { width, height } : {}}
    >
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
    </div>
  )

  // Placeholder en cas d'erreur
  const ErrorPlaceholder = () => (
    <div 
      className={`
        bg-gray-100 border-2 border-dashed border-gray-300 
        flex items-center justify-center text-gray-400
        ${fill ? 'absolute inset-0' : ''}
        ${className}
      `}
      style={!fill ? { width, height } : {}}
    >
      <div className="text-center">
        <div className="text-2xl mb-2">📷</div>
        <div className="text-sm">Image non disponible</div>
      </div>
    </div>
  )

  return (
    <div 
      ref={imgRef}
      className={`relative ${fill ? 'w-full h-full' : ''}`}
      style={!fill ? { width, height } : {}}
    >
      {!isInView && !priority && <LoadingPlaceholder />}
      
      {isError && <ErrorPlaceholder />}
      
      {isInView && !isError && (
        <>
          {!isLoaded && <LoadingPlaceholder />}
          
          <Image
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            className={`
              ${className}
              transition-opacity duration-300 ease-in-out
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            priority={priority}
            quality={quality}
            sizes={sizes}
            placeholder={placeholder}
            blurDataURL={blurDataURL || defaultBlurDataURL}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
          />
        </>
      )}
    </div>
  )
}

// Hook pour le lazy loading d'éléments
export function useLazyLoad(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Composant wrapper pour le lazy loading de contenu
export function LazyContent({ 
  children, 
  className = '',
  threshold = 0.1,
  fallback = null 
}: {
  children: React.ReactNode
  className?: string
  threshold?: number
  fallback?: React.ReactNode
}) {
  const { ref, isInView } = useLazyLoad(threshold)

  return (
    <div ref={ref} className={className}>
      {isInView ? children : fallback}
    </div>
  )
}
