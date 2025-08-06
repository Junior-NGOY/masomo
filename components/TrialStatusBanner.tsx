"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle, CheckCircle, Crown, Calendar, ArrowRight } from 'lucide-react'
import { MockSchool, MockDataService } from '@/services/mockDataService'

type AccountStatus = 'trial' | 'trial_expired' | 'active' | 'suspended' | 'cancelled'

interface TrialStatusProps {
  school: MockSchool
  onUpgrade?: () => void
}

function TrialStatusBanner({ school, onUpgrade }: TrialStatusProps) {
  const [daysLeft, setDaysLeft] = useState(0)
  const [hoursLeft, setHoursLeft] = useState(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const daysRemaining = MockDataService.calculateTrialDaysLeft(school.trial_end_date)
      const hoursRemaining = MockDataService.calculateTrialHoursLeft(school.trial_end_date)
      
      setDaysLeft(daysRemaining)
      setHoursLeft(hoursRemaining)
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000 * 60 * 60) // Update every hour

    return () => clearInterval(interval)
  }, [school.trial_end_date])

  // Composant pour essai actif
  if (school.account_status === 'trial') {
    const isLastWeek = daysLeft <= 7
    const isLastDay = daysLeft <= 1

    return (
      <Card className={`border-2 ${isLastDay ? 'border-red-200 bg-red-50' : isLastWeek ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className={`h-5 w-5 ${isLastDay ? 'text-red-600' : isLastWeek ? 'text-orange-600' : 'text-blue-600'}`} />
              <div>
                <CardTitle className={`text-lg ${isLastDay ? 'text-red-800' : isLastWeek ? 'text-orange-800' : 'text-blue-800'}`}>
                  Essai gratuit en cours
                </CardTitle>
                <CardDescription className={`${isLastDay ? 'text-red-600' : isLastWeek ? 'text-orange-600' : 'text-blue-600'}`}>
                  {daysLeft > 0 ? (
                    `Plus que ${daysLeft} jour${daysLeft > 1 ? 's' : ''} et ${hoursLeft}h`
                  ) : (
                    `Plus que ${hoursLeft} heure${hoursLeft > 1 ? 's' : ''}`
                  )}
                </CardDescription>
              </div>
            </div>
            <Badge variant={isLastDay ? 'destructive' : isLastWeek ? 'secondary' : 'default'}>
              {daysLeft > 0 ? `${daysLeft} jour${daysLeft > 1 ? 's' : ''}` : `${hoursLeft}h`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Accès complet à toutes les fonctionnalités</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Toutes vos données seront conservées</span>
              </div>
            </div>
            <Button 
              onClick={onUpgrade}
              className={`${isLastDay ? 'bg-red-600 hover:bg-red-700' : isLastWeek ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Passer à l'abonnement
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Composant pour essai expiré
  if (school.account_status === 'trial_expired') {
    return (
      <Card className="border-2 border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <CardTitle className="text-lg text-red-800">
                  Essai expiré
                </CardTitle>
                <CardDescription className="text-red-600">
                  Accès en lecture seule uniquement
                </CardDescription>
              </div>
            </div>
            <Badge variant="destructive">
              Expiré
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Vos données sont toujours sécurisées</span>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Vous pouvez consulter vos rapports</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Modifications bloquées jusqu'à l'abonnement</span>
              </div>
            </div>
            <Button 
              onClick={onUpgrade}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              Reprendre l'abonnement - Récupérer mes données
              <Crown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Composant pour abonnement actif
  if (school.account_status === 'active') {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-green-600" />
              <div>
                <CardTitle className="text-lg text-green-800">
                  Abonnement actif
                </CardTitle>
                <CardDescription className="text-green-600">
                  Accès complet à toutes les fonctionnalités
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-green-600">
              Premium
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Toutes vos données d'essai récupérées</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Support prioritaire inclus</span>
              </div>
            </div>
            {school.subscription_end_date && (
              <div className="text-right">
                <div className="text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Expire le {new Date(school.subscription_end_date).toLocaleDateString('fr-FR')}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}

// Composant pour la modal de mise à niveau
export function UpgradeModal({ 
  isOpen, 
  onClose, 
  onUpgrade,
  school 
}: {
  isOpen: boolean
  onClose: () => void
  onUpgrade: (planType: string) => void
  school: MockSchool
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <Crown className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Continuez avec Masomo Pro
          </h2>
          <p className="text-gray-600">
            Toutes vos données d'essai seront conservées et immédiatement disponibles
          </p>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Plan Basic</h3>
              <span className="text-2xl font-bold text-blue-600">25.000 CDF</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Parfait pour les petites écoles
            </p>
            <Button 
              onClick={() => onUpgrade('basic')}
              className="w-full"
              variant="outline"
            >
              Choisir Basic
            </Button>
          </div>

          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Plan Premium</h3>
              <span className="text-2xl font-bold text-blue-600">45.000 CDF</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Recommandé pour la plupart des écoles
            </p>
            <Button 
              onClick={() => onUpgrade('premium')}
              className="w-full"
            >
              Choisir Premium
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Décider plus tard
          </button>
        </div>
      </div>
    </div>
  )
}

// Export du composant avec le nom correct pour l'import
export { TrialStatusBanner }

// Export par défaut pour la compatibilité
export default TrialStatusBanner
