"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useScrollToSection() {
  const router = useRouter()

  const scrollToSection = (sectionId: string) => {
    // Si on est déjà sur la page d'accueil, scroll direct
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Sinon, navigue vers la page d'accueil avec l'ancre
      router.push(`/#${sectionId}`)
    }
  }

  // Gère le scroll automatique après navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1)
      if (hash) {
        // Attendre un petit délai pour que la page se charge
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    }

    // Déclenche le scroll si on arrive sur une page avec une ancre
    if (window.location.hash) {
      handleHashChange()
    }

    // Écoute les changements d'ancre
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return { scrollToSection }
}
