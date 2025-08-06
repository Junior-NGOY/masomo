"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface CarouselItem {
  id: string
  image: string
  title: string
  description: string
  userType: string
}

const carouselItems: CarouselItem[] = [
  {
    id: "teaching",
    image: "/images/carousel-teaching.svg",
    title: "Enseignement interactif",
    description: "Un enseignant passionné partageant ses connaissances avec dynamisme et méthode",
    userType: "Enseignant"
  },
  {
    id: "student-board",
    image: "/images/carousel-student-board.svg",
    title: "Participation active",
    description: "Les élèves participent activement et développent leur confiance en résolvant des problèmes",
    userType: "Élève"
  },
  {
    id: "classroom",
    image: "/images/carousel-classroom.svg",
    title: "Classe interactive",
    description: "Engagement et participation de tous les élèves pour un apprentissage enrichi et collaboratif",
    userType: "Classe"
  },
  {
    id: "collaboration",
    image: "/images/carousel-collaboration.svg",
    title: "Collaboration moderne",
    description: "Technologie et travail d'équipe pour un apprentissage du 21e siècle",
    userType: "Équipe"
  }
]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const currentItem = carouselItems[currentIndex]

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main carousel container */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
        {/* Image container */}
        <div className="relative h-96 sm:h-[500px]">
          <Image
            src={currentItem.image}
            alt={currentItem.title}
            fill
            className="object-cover transition-all duration-500"
            priority
          />
          
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-sm font-medium">
                {currentItem.userType}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{currentItem.title}</h3>
            <p className="text-lg opacity-90 leading-relaxed">
              {currentItem.description}
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Image précédente"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Image suivante"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-blue-600 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
        <div 
          className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-100"
          style={{ width: `${((currentIndex + 1) / carouselItems.length) * 100}%` }}
        />
      </div>

      {/* User type indicators */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {carouselItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => goToSlide(index)}
            className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              index === currentIndex
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {item.userType}
          </button>
        ))}
      </div>
    </div>
  )
}
