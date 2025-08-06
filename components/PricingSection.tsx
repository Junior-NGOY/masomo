"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"

const pricingData = {
  starter: {
    name: "Starter",
    description: "Parfait pour les petites écoles jusqu'à 200 élèves",
    monthlyPrice: 29,
    annualPrice: 278,
    features: [
      "1 école maximum",
      "Jusqu'à 200 élèves",
      "Gestion des élèves",
      "Système de présence",
      "Gestion académique de base",
      "Site web de l'école",
      "Support par email"
    ]
  },
  professional: {
    name: "Professional",
    description: "Idéal pour les écoles moyennes jusqu'à 1000 élèves",
    monthlyPrice: 79,
    annualPrice: 758,
    features: [
      "Jusqu'à 3 écoles",
      "Jusqu'à 1000 élèves",
      "Gestion financière complète",
      "Hub de communication",
      "Gestion du personnel",
      "Analytics & rapports",
      "Portail d'examens",
      "Support prioritaire"
    ],
    popular: true
  },
  enterprise: {
    name: "Enterprise",
    description: "Pour les grandes institutions et réseaux d'écoles",
    monthlyPrice: 199,
    annualPrice: 1910,
    features: [
      "Écoles illimitées",
      "Élèves illimités",
      "Gestion des ressources",
      "Gestion du transport",
      "Sécurité & accès avancés",
      "API personnalisée",
      "Formation et déploiement",
      "Support dédié 24/7"
    ]
  }
}

const featuresComparison = [
  { name: "Gestion des Étudiants", starter: true, professional: true, enterprise: true },
  { name: "Gestion Académique", starter: true, professional: true, enterprise: true },
  { name: "Système de Présence", starter: true, professional: true, enterprise: true },
  { name: "Gestion Financière", starter: "Base", professional: true, enterprise: true },
  { name: "Hub de Communication", starter: false, professional: true, enterprise: true },
  { name: "Gestion du Personnel", starter: false, professional: true, enterprise: true },
  { name: "Analytics & Rapports", starter: false, professional: true, enterprise: true },
  { name: "Portail d'Examens", starter: false, professional: true, enterprise: true },
  { name: "Gestion des Ressources", starter: false, professional: false, enterprise: true },
  { name: "Gestion du Transport", starter: false, professional: false, enterprise: true },
  { name: "Tableau d'Annonces", starter: false, professional: false, enterprise: true },
  { name: "Sécurité & Accès Avancés", starter: false, professional: false, enterprise: true }
]

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  const formatPrice = (monthlyPrice: number, annualPrice: number) => {
    if (isAnnual) {
      return {
        price: Math.round(annualPrice / 12),
        period: "/mois",
        billing: "Facturé annuellement",
        saving: `Économisez ${Math.round(((monthlyPrice * 12) - annualPrice) / (monthlyPrice * 12) * 100)}%`
      }
    }
    return {
      price: monthlyPrice,
      period: "/mois",
      billing: "Facturé mensuellement",
      saving: null
    }
  }

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tarifs transparents et flexibles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Pas de frais cachés, 
            pas d'engagement. Commencez gratuitement dès aujourd'hui.
          </p>
        </div>

        <div className="flex items-center justify-center mb-12">
          <span className={`text-sm mr-3 ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
            Mensuel
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isAnnual ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
              isAnnual ? 'translate-x-6' : 'translate-x-0.5'
            } translate-y-0.5`} />
          </button>
          <span className={`text-sm ml-3 ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
            Annuel
          </span>
          {isAnnual && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Économisez 20%
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {pricingData.starter.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-600">
                  ${formatPrice(pricingData.starter.monthlyPrice, pricingData.starter.annualPrice).price}
                </span>
                <span className="text-gray-600">
                  {formatPrice(pricingData.starter.monthlyPrice, pricingData.starter.annualPrice).period}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatPrice(pricingData.starter.monthlyPrice, pricingData.starter.annualPrice).billing}
              </p>
              {isAnnual && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  {formatPrice(pricingData.starter.monthlyPrice, pricingData.starter.annualPrice).saving}
                </p>
              )}
              <CardDescription className="mt-2">
                {pricingData.starter.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {pricingData.starter.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6" variant="outline">
                Essai gratuit 30 jours
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500 hover:border-blue-600 transition-all duration-300 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white">Plus populaire</Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {pricingData.professional.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-600">
                  ${formatPrice(pricingData.professional.monthlyPrice, pricingData.professional.annualPrice).price}
                </span>
                <span className="text-gray-600">
                  {formatPrice(pricingData.professional.monthlyPrice, pricingData.professional.annualPrice).period}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatPrice(pricingData.professional.monthlyPrice, pricingData.professional.annualPrice).billing}
              </p>
              {isAnnual && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  {formatPrice(pricingData.professional.monthlyPrice, pricingData.professional.annualPrice).saving}
                </p>
              )}
              <CardDescription className="mt-2">
                {pricingData.professional.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {pricingData.professional.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Essai gratuit 30 jours
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {pricingData.enterprise.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-purple-600">
                  ${formatPrice(pricingData.enterprise.monthlyPrice, pricingData.enterprise.annualPrice).price}
                </span>
                <span className="text-gray-600">
                  {formatPrice(pricingData.enterprise.monthlyPrice, pricingData.enterprise.annualPrice).period}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatPrice(pricingData.enterprise.monthlyPrice, pricingData.enterprise.annualPrice).billing}
              </p>
              {isAnnual && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  {formatPrice(pricingData.enterprise.monthlyPrice, pricingData.enterprise.annualPrice).saving}
                </p>
              )}
              <CardDescription className="mt-2">
                {pricingData.enterprise.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {pricingData.enterprise.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6" variant="outline">
                Contactez-nous
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Questions sur les tarifs ?
          </h3>
          <p className="text-gray-600 mb-6">
            Contactez notre équipe pour un devis personnalisé ou une démonstration.
          </p>
          <Button variant="outline" size="lg" className="mr-4" asChild>
            <a href="#contact">Contactez-nous</a>
          </Button>
          <Button size="lg" asChild>
            <Link href="/demo">Voir la démo</Link>
          </Button>
        </div>

        {/* Comparaison détaillée des fonctionnalités */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Comparaison détaillée des fonctionnalités
            </h3>
            <p className="text-gray-600">
              Découvrez toutes les fonctionnalités incluses dans chaque plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Fonctionnalité</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Starter</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Professional</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {featuresComparison.map((feature, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{feature.name}</td>
                    <td className="px-6 py-4 text-center">
                      {feature.starter === true ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : feature.starter === false ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className="text-gray-400">{feature.starter}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.professional === true ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : feature.professional === false ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className="text-gray-400">{feature.professional}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.enterprise === true ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : feature.enterprise === false ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className="text-gray-400">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
