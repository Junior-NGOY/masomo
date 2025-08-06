// app/demo/page.tsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert-new"
import SchoolStatusDemo from '@/components/dev/SchoolStatusDemo'
import TrialStatusBanner from '@/components/TrialStatusBanner'
import { MockSchool, MockDataService, useMockSchool, useUpgrade } from '@/services/mockDataService'
import { 
  Rocket, 
  Code, 
  Palette, 
  Database, 
  Globe, 
  Users, 
  BookOpen, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

export default function DemoPage() {
  const [selectedSchool, setSelectedSchool] = useState<MockSchool | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { upgrade, upgrading, error } = useUpgrade()

  const handleSchoolChange = (school: MockSchool) => {
    setSelectedSchool(school)
  }

  const handleUpgrade = async (planId: string) => {
    if (!selectedSchool) return
    
    const result = await upgrade(selectedSchool.id, planId)
    if (result.success) {
      alert(`✅ ${result.message}`)
      setShowUpgradeModal(false)
      // Refresh school data
      const updatedSchool = await MockDataService.getSchool(selectedSchool.id)
      if (updatedSchool) {
        setSelectedSchool(updatedSchool)
      }
    } else {
      alert(`❌ ${result.message}`)
    }
  }

  const frontendFeatures = [
    {
      icon: <Palette className="h-5 w-5 text-blue-500" />,
      title: "Interface moderne",
      description: "Design responsive avec Tailwind CSS et composants réutilisables",
      status: "completed"
    },
    {
      icon: <Clock className="h-5 w-5 text-orange-500" />,
      title: "Animations fluides",
      description: "Micro-interactions et transitions avec Framer Motion",
      status: "completed"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      title: "Optimisations performances",
      description: "Lazy loading, compression d'images, et cache optimisé",
      status: "completed"
    },
    {
      icon: <Globe className="h-5 w-5 text-purple-500" />,
      title: "SEO avancé",
      description: "Meta tags dynamiques et structured data",
      status: "completed"
    },
    {
      icon: <Users className="h-5 w-5 text-indigo-500" />,
      title: "Gestion d'essai",
      description: "Statuts d'abonnement et transitions fluides",
      status: "completed"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-pink-500" />,
      title: "Expérience utilisateur",
      description: "Parcours d'onboarding et notifications intelligentes",
      status: "in-progress"
    }
  ]

  const backendFeatures = [
    {
      icon: <Database className="h-5 w-5 text-gray-400" />,
      title: "Base de données",
      description: "Prisma ORM avec PostgreSQL pour la production",
      status: "pending"
    },
    {
      icon: <Code className="h-5 w-5 text-gray-400" />,
      title: "API REST",
      description: "Endpoints sécurisés avec validation et authentification",
      status: "pending"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-gray-400" />,
      title: "Paiements",
      description: "Intégration Stripe et systèmes de paiement locaux",
      status: "pending"
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-gray-400" />,
      title: "Notifications",
      description: "Emails automatiques et notifications push",
      status: "pending"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Rocket className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Masomo Pro - Démonstration Frontend
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Démonstration complète des fonctionnalités frontend avec données fictives. 
            Testez les différents états d'abonnement et les transitions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✅ Frontend Ready
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              🚀 Phase 1 Complete
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              ⏳ Backend Next
            </Badge>
          </div>
        </div>

        {/* Trial Status Demo */}
        {selectedSchool && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Démonstration - État d'abonnement
            </h2>
            <TrialStatusBanner 
              school={selectedSchool} 
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          </div>
        )}

        {/* School Status Interactive Demo */}
        <SchoolStatusDemo onSchoolChange={handleSchoolChange} />

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Frontend Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-blue-500" />
                Fonctionnalités Frontend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {frontendFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">{feature.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{feature.title}</h3>
                        <Badge 
                          variant={feature.status === 'completed' ? 'default' : 'secondary'}
                          className={
                            feature.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }
                        >
                          {feature.status === 'completed' ? '✅ Terminé' : '🔄 En cours'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Backend Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-gray-500" />
                Fonctionnalités Backend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backendFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 opacity-60">
                    <div className="mt-1">{feature.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{feature.title}</h3>
                        <Badge variant="outline" className="bg-gray-100 text-gray-600">
                          ⏳ En attente
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Strategy */}
        <Card>
          <CardHeader>
            <CardTitle>Stratégie d'implémentation - Frontend First</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="font-medium text-green-700">Phase 1 - Frontend ✅</h3>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Composants UI complets</li>
                  <li>• Données fictives fonctionnelles</li>
                  <li>• Animations et transitions</li>
                  <li>• Gestion d'état locale</li>
                  <li>• Tests d'interface utilisateur</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="font-medium text-blue-700">Phase 2 - API ⏳</h3>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Base de données Prisma</li>
                  <li>• Endpoints REST sécurisés</li>
                  <li>• Authentification JWT</li>
                  <li>• Validation des données</li>
                  <li>• Gestion des erreurs</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h3 className="font-medium text-purple-700">Phase 3 - Business 🔮</h3>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Intégration paiements</li>
                  <li>• Notifications email</li>
                  <li>• Analytics et rapports</li>
                  <li>• Déploiement production</li>
                  <li>• Monitoring et maintenance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Alert>
          <Rocket className="h-4 w-4" />
          <AlertDescription>
            <strong>Prochaines étapes :</strong> Le frontend est maintenant complet avec toutes les fonctionnalités d'abonnement simulées. 
            Vous pouvez tester tous les scénarios d'utilisation avant de passer à l'implémentation du backend.
          </AlertDescription>
        </Alert>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choisissez votre plan
              </h2>
              <p className="text-gray-600">
                Toutes vos données seront conservées et immédiatement disponibles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {MockDataService.getSubscriptionPlans().map(plan => (
                <div 
                  key={plan.id}
                  className={`border rounded-lg p-4 ${plan.recommended ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <div className="text-2xl font-bold text-blue-600">
                      {plan.price.toLocaleString()} {plan.currency}
                    </div>
                    <div className="text-sm text-gray-600">/mois</div>
                  </div>
                  
                  <ul className="space-y-2 text-sm mb-4">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading}
                    className="w-full"
                    variant={plan.recommended ? "default" : "outline"}
                  >
                    {upgrading ? 'Traitement...' : `Choisir ${plan.name}`}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowUpgradeModal(false)}
                disabled={upgrading}
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
