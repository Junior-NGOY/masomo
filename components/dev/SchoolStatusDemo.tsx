// components/dev/SchoolStatusDemo.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MockDataService, MockSchool } from '@/services/mockDataService'
import TrialStatusBanner from '@/components/TrialStatusBanner'
import { Clock, Users, GraduationCap, Building, Calendar, CreditCard } from 'lucide-react'

interface SchoolStatusDemoProps {
  onSchoolChange?: (school: MockSchool) => void
}

export function SchoolStatusDemo({ onSchoolChange }: SchoolStatusDemoProps) {
  const [currentSchool, setCurrentSchool] = useState<MockSchool | null>(null)
  const [loading, setLoading] = useState(false)

  const mockSchools = [
    { id: "school-trial-active", name: "École Primaire Kinshasa", status: "Essai actif (30j)" },
    { id: "school-trial-ending", name: "Lycée Technique Goma", status: "Essai expire bientôt" },
    { id: "school-trial-expired", name: "École Sainte-Marie Lubumbashi", status: "Essai expiré" },
    { id: "school-active-basic", name: "Institut Moderne Bukavu", status: "Abonnement Basic" },
    { id: "school-active-premium", name: "Complexe Scolaire Mbuji-Mayi", status: "Abonnement Premium" }
  ]

  const handleSchoolChange = async (schoolId: string) => {
    setLoading(true)
    try {
      const school = await MockDataService.switchToSchool(schoolId)
      if (school) {
        setCurrentSchool(school)
        onSchoolChange?.(school)
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trial': return 'bg-blue-100 text-blue-800'
      case 'trial_expired': return 'bg-red-100 text-red-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateProgress = (school: MockSchool) => {
    if (school.account_status === 'trial') {
      const totalDays = 30
      const daysLeft = MockDataService.calculateTrialDaysLeft(school.trial_end_date)
      return Math.max(0, ((totalDays - daysLeft) / totalDays) * 100)
    }
    return 0
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Démo - États d'abonnement
        </CardTitle>
        <div className="flex items-center gap-4">
          <Select onValueChange={handleSchoolChange} disabled={loading}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Sélectionnez une école pour tester" />
            </SelectTrigger>
            <SelectContent>
              {mockSchools.map(school => (
                <SelectItem key={school.id} value={school.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{school.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {school.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loading && <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
        </div>
      </CardHeader>

      {currentSchool && (
        <CardContent className="space-y-6">
          {/* Bannière de statut */}
          <TrialStatusBanner school={currentSchool} />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="usage">Utilisation</TabsTrigger>
              <TabsTrigger value="upgrade">Mise à niveau</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Statut</span>
                      <Badge className={getStatusColor(currentSchool.account_status)}>
                        {currentSchool.account_status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">École</span>
                      <span className="font-medium">{currentSchool.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Début essai</span>
                      <span className="text-sm">{formatDate(currentSchool.trial_start_date)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fin essai</span>
                      <span className="text-sm">{formatDate(currentSchool.trial_end_date)}</span>
                    </div>
                    {currentSchool.subscription_plan && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Plan</span>
                        <Badge variant="outline">{currentSchool.subscription_plan}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600">Élèves</span>
                      </div>
                      <span className="font-medium">{currentSchool.students_count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">Enseignants</span>
                      </div>
                      <span className="font-medium">{currentSchool.teachers_count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-gray-600">Classes</span>
                      </div>
                      <span className="font-medium">{currentSchool.classes_count}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Barre de progression de l'essai */}
              {currentSchool.account_status === 'trial' && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Progression de l'essai
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Jours utilisés</span>
                        <span>{30 - MockDataService.calculateTrialDaysLeft(currentSchool.trial_end_date)}/30</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(currentSchool)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 text-center">
                        {MockDataService.calculateTrialDaysLeft(currentSchool.trial_end_date)} jours restants
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications actives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {MockDataService.getTrialNotifications(currentSchool).map((notification, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          notification.type === 'error' ? 'bg-red-50 border-red-400' :
                          notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                          'bg-blue-50 border-blue-400'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm">{notification.message}</p>
                          {notification.action && (
                            <Button size="sm" variant="outline" className="ml-2">
                              {notification.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Utilisation de la plateforme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(() => {
                      const usage = MockDataService.generateUsageStats(currentSchool)
                      return (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{usage.studentsAdded}</div>
                            <div className="text-sm text-gray-600">Élèves ajoutés</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{usage.teachersAdded}</div>
                            <div className="text-sm text-gray-600">Enseignants ajoutés</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{usage.reportsGenerated}</div>
                            <div className="text-sm text-gray-600">Rapports générés</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{usage.parentNotifications}</div>
                            <div className="text-sm text-gray-600">Notifications parents</div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upgrade" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Plans d'abonnement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {MockDataService.getSubscriptionPlans().map(plan => (
                      <Card key={plan.id} className={`relative ${plan.recommended ? 'border-blue-500' : ''}`}>
                        {plan.recommended && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-blue-500">Recommandé</Badge>
                          </div>
                        )}
                        <CardHeader className="text-center">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <div className="text-2xl font-bold">
                            {plan.price.toLocaleString()} {plan.currency}
                            <span className="text-sm font-normal text-gray-600">/mois</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Button 
                            className="w-full mt-4"
                            variant={plan.recommended ? "default" : "outline"}
                            disabled={currentSchool.subscription_plan === plan.id}
                          >
                            {currentSchool.subscription_plan === plan.id ? 'Plan actuel' : 'Choisir ce plan'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}

export default SchoolStatusDemo
