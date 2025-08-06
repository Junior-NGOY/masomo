"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, GraduationCap, Users, MessageSquare, DollarSign, ClipboardList, Bus, BarChart2, BookOpen, CalendarDays, FileText, Bell, Shield, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"

const features = [
  {
    icon: Users,
    title: "Gestion des Étudiants",
    description: "Système complet d'information étudiant pour gérer les inscriptions, profils et dossiers académiques",
    href: "/features/student-management"
  },
  {
    icon: GraduationCap,
    title: "Gestion Académique",
    description: "Planification curriculaire, examens, notation et génération de bulletins dans un système unifié",
    href: "/features/academic-management"
  },
  {
    icon: MessageSquare,
    title: "Hub de Communication",
    description: "Système de messagerie intégré avec notifications multi-canaux pour une communication scolaire fluide",
    href: "/features/communication"
  },
  {
    icon: DollarSign,
    title: "Gestion Financière",
    description: "Système complet de gestion des frais avec paiements en ligne, facturation et rapports financiers",
    href: "/features/finance"
  },
  {
    icon: ClipboardList,
    title: "Gestion du Personnel",
    description: "Outils efficaces pour gérer les dossiers du personnel, présences, évaluations et paie",
    href: "/features/staff-management"
  },
  {
    icon: Bus,
    title: "Gestion du Transport",
    description: "Suivi transport en temps réel, gestion des itinéraires et notifications automatisées",
    href: "/features/transport"
  },
  {
    icon: BarChart2,
    title: "Analytics & Rapports",
    description: "Outils d'analyse puissants pour des décisions basées sur les données avec rapports personnalisables",
    href: "/features/analytics"
  },
  {
    icon: BookOpen,
    title: "Gestion des Ressources",
    description: "Système de bibliothèque numérique, suivi d'inventaire et planification des installations",
    href: "/features/resources"
  },
  {
    icon: CalendarDays,
    title: "Système de Présence",
    description: "Suivi automatisé des présences pour étudiants et personnel avec notifications instantanées",
    href: "/features/attendance"
  },
  {
    icon: FileText,
    title: "Portail d'Examens",
    description: "Système complet de gestion des examens de la planification à la publication des résultats",
    href: "/features/examinations"
  },
  {
    icon: Bell,
    title: "Tableau d'Annonces",
    description: "Tableau d'annonces numérique pour communiqués, événements et mises à jour importantes",
    href: "/features/announcements"
  },
  {
    icon: Shield,
    title: "Sécurité & Accès",
    description: "Contrôle d'accès basé sur les rôles avec chiffrement des données et sauvegardes sécurisées",
    href: "/features/security"
  }
]

export default function ModernHeader() {
  const [showFeatures, setShowFeatures] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollToSection } = useScrollToSection()

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Masomo Pro
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Accueil
            </Link>
            
            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span>Fonctionnalités</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFeatures ? 'rotate-180' : ''}`} />
              </button>
              
              {showFeatures && (
                <div className="absolute top-full left-0 mt-2 w-[800px] bg-white rounded-lg shadow-xl border border-gray-200 p-6 z-50">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b">
                    <h4 className="text-lg font-medium">Fonctionnalités</h4>
                    <Link
                      href="/features"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Voir tout
                    </Link>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {features.map((feature, index) => (
                      <Link
                        key={index}
                        href={feature.href}
                        className="block group p-3 rounded-lg hover:bg-gray-50"
                        onClick={() => setShowFeatures(false)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-md group-hover:bg-blue-100">
                            <feature.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-medium mb-1 group-hover:text-blue-600">
                              {feature.title}
                            </h5>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Tarifs
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              À propos
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Contact
            </button>
            <Link href="/help" className="text-gray-600 hover:text-blue-600 transition-colors">
              Aide
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
              <Link href="/school-onboarding">Essai gratuit</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="py-4 space-y-4">
              <Link 
                href="/" 
                className="block px-4 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              
              <div>
                <button
                  onClick={() => setShowFeatures(!showFeatures)}
                  className="flex items-center justify-between w-full px-4 py-2 text-gray-600 hover:text-blue-600"
                >
                  <span>Fonctionnalités</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFeatures ? 'rotate-180' : ''}`} />
                </button>
                
                {showFeatures && (
                  <div className="px-4 py-2 space-y-2">
                    {features.map((feature, index) => (
                      <Link
                        key={index}
                        href={feature.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {feature.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => {
                  scrollToSection('pricing')
                  setMobileMenuOpen(false)
                }}
                className="block px-4 py-2 text-gray-600 hover:text-blue-600 cursor-pointer text-left w-full"
              >
                Tarifs
              </button>
              <button 
                onClick={() => {
                  scrollToSection('about')
                  setMobileMenuOpen(false)
                }}
                className="block px-4 py-2 text-gray-600 hover:text-blue-600 cursor-pointer text-left w-full"
              >
                À propos
              </button>
              <button 
                onClick={() => {
                  scrollToSection('contact')
                  setMobileMenuOpen(false)
                }}
                className="block px-4 py-2 text-gray-600 hover:text-blue-600 cursor-pointer text-left w-full"
              >
                Contact
              </button>
              <Link 
                href="/help" 
                className="block px-4 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Aide
              </Link>
              
              <div className="px-4 py-2 space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                  <Link href="/school-onboarding">Essai gratuit</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay for features dropdown */}
      {showFeatures && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={() => setShowFeatures(false)}
        />
      )}
    </header>
  )
}
