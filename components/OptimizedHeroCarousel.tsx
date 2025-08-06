"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  {
    src: "/images/hero/teacher-classroom.svg",
    alt: "Enseignant donnant cours dans une classe moderne",
    title: "Enseignement moderne",
    description: "Outils pédagogiques avancés pour un enseignement efficace"
  },
  {
    src: "/images/hero/students-learning.svg", 
    alt: "Étudiants apprenant avec des technologies modernes",
    title: "Apprentissage interactif",
    description: "Expérience d'apprentissage personnalisée et engageante"
  },
  {
    src: "/images/hero/student-presentation.svg",
    alt: "Élève présentant devant la classe",
    title: "Participation active",
    description: "Encourager la participation et la confiance des élèves"
  }
]

export default function OptimizedHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden shadow-2xl">
      {/* Loading Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover object-center"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDMyMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIiBmaWxsPSIjZjFmNWY5Ii8+CjxwYXRoIGQ9Ik0xMjAgODBWMTYwSDIwMFY4MEgxMjBaIiBmaWxsPSIjZDFkNWRiIi8+Cjwvc3ZnPg=="
              onLoad={() => setIsLoaded(true)}
            />
            
            {/* Overlay Content */}
            <div className="absolute inset-0 bg-black/20 flex items-end p-8">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                <p className="text-lg opacity-90">{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Image précédente"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Image suivante"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white shadow-lg' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
