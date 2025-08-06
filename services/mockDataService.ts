// services/mockDataService.ts
import { useState, useEffect } from 'react'

export interface MockSchool {
  id: string
  name: string
  account_status: 'trial' | 'trial_expired' | 'active' | 'suspended' | 'cancelled'
  trial_start_date: Date
  trial_end_date: Date
  subscription_start_date?: Date
  subscription_end_date?: Date
  subscription_plan?: 'basic' | 'premium' | 'enterprise'
  students_count: number
  teachers_count: number
  classes_count: number
}

export interface MockSubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  features: string[]
  maxStudents: number
  maxTeachers: number
  maxSchools: number
  recommended?: boolean
}

export class MockDataService {
  
  // Données fictives d'écoles avec différents statuts
  private static schools: MockSchool[] = [
    {
      id: "school-trial-active",
      name: "École Primaire Kinshasa",
      account_status: "trial",
      trial_start_date: new Date("2025-01-18"),
      trial_end_date: new Date("2025-02-17"), // 30 jours
      students_count: 245,
      teachers_count: 18,
      classes_count: 12
    },
    {
      id: "school-trial-ending",
      name: "Lycée Technique Goma",
      account_status: "trial",
      trial_start_date: new Date("2025-01-10"),
      trial_end_date: new Date("2025-01-20"), // Expire bientôt
      students_count: 420,
      teachers_count: 28,
      classes_count: 20
    },
    {
      id: "school-trial-expired",
      name: "École Sainte-Marie Lubumbashi",
      account_status: "trial_expired",
      trial_start_date: new Date("2024-12-15"),
      trial_end_date: new Date("2025-01-15"), // Expiré
      students_count: 180,
      teachers_count: 15,
      classes_count: 8
    },
    {
      id: "school-active-basic",
      name: "Institut Moderne Bukavu",
      account_status: "active",
      trial_start_date: new Date("2024-11-01"),
      trial_end_date: new Date("2024-12-01"),
      subscription_start_date: new Date("2024-12-01"),
      subscription_end_date: new Date("2025-12-01"),
      subscription_plan: "basic",
      students_count: 350,
      teachers_count: 22,
      classes_count: 16
    },
    {
      id: "school-active-premium",
      name: "Complexe Scolaire Mbuji-Mayi",
      account_status: "active",
      trial_start_date: new Date("2024-10-01"),
      trial_end_date: new Date("2024-11-01"),
      subscription_start_date: new Date("2024-11-01"),
      subscription_end_date: new Date("2025-11-01"),
      subscription_plan: "premium",
      students_count: 850,
      teachers_count: 45,
      classes_count: 35
    }
  ]

  // Plans d'abonnement
  private static plans: MockSubscriptionPlan[] = [
    {
      id: "basic",
      name: "Plan Basic",
      price: 25000,
      currency: "CDF",
      features: [
        "Jusqu'à 500 élèves",
        "Gestion des notes et bulletins",
        "Communication parents-enseignants",
        "Rapports de base",
        "Support par email",
        "Sauvegarde quotidienne"
      ],
      maxStudents: 500,
      maxTeachers: 50,
      maxSchools: 1
    },
    {
      id: "premium",
      name: "Plan Premium",
      price: 45000,
      currency: "CDF",
      features: [
        "Jusqu'à 1500 élèves",
        "Toutes les fonctionnalités Basic",
        "Gestion financière avancée",
        "Rapports détaillés et analytics",
        "Site web personnalisé",
        "API d'intégration",
        "Support prioritaire 24/7"
      ],
      maxStudents: 1500,
      maxTeachers: 150,
      maxSchools: 3,
      recommended: true
    },
    {
      id: "enterprise",
      name: "Plan Enterprise",
      price: 75000,
      currency: "CDF",
      features: [
        "Élèves illimités",
        "Toutes les fonctionnalités Premium",
        "Multi-écoles illimité",
        "Personnalisation complète",
        "Formation sur site",
        "API personnalisée",
        "Support dédié 24/7"
      ],
      maxStudents: -1,
      maxTeachers: -1,
      maxSchools: -1
    }
  ]

  /**
   * Simule la récupération d'une école par ID
   */
  static async getSchool(schoolId: string): Promise<MockSchool | null> {
    // Simule une latence réseau
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return this.schools.find(school => school.id === schoolId) || null
  }

  /**
   * Simule la récupération de l'école courante (première pour la démo)
   */
  static async getCurrentSchool(): Promise<MockSchool> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.schools[0] // École en essai actif par défaut
  }

  /**
   * Simule le changement d'école pour tester différents statuts
   */
  static async switchToSchool(schoolId: string): Promise<MockSchool | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.schools.find(school => school.id === schoolId) || null
  }

  /**
   * Calcule les jours restants d'essai
   */
  static calculateTrialDaysLeft(trialEndDate: Date): number {
    const now = new Date()
    const timeDiff = trialEndDate.getTime() - now.getTime()
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    return Math.max(0, daysLeft)
  }

  /**
   * Calcule les heures restantes d'essai
   */
  static calculateTrialHoursLeft(trialEndDate: Date): number {
    const now = new Date()
    const timeDiff = trialEndDate.getTime() - now.getTime()
    const hoursLeft = Math.ceil(timeDiff / (1000 * 60 * 60))
    return Math.max(0, hoursLeft)
  }

  /**
   * Vérifie si une opération d'écriture est autorisée
   */
  static canPerformWriteOperation(school: MockSchool): boolean {
    return school.account_status === 'trial' || school.account_status === 'active'
  }

  /**
   * Obtient tous les plans d'abonnement
   */
  static getSubscriptionPlans(): MockSubscriptionPlan[] {
    return this.plans
  }

  /**
   * Simule une mise à niveau d'abonnement
   */
  static async upgradeSubscription(
    schoolId: string, 
    planId: string
  ): Promise<{success: boolean, message: string}> {
    // Simule le traitement
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Trouve l'école
    const schoolIndex = this.schools.findIndex(s => s.id === schoolId)
    if (schoolIndex === -1) {
      return { success: false, message: "École non trouvée" }
    }

    // Trouve le plan
    const plan = this.plans.find(p => p.id === planId)
    if (!plan) {
      return { success: false, message: "Plan non trouvé" }
    }

    // Simule une chance d'échec de paiement (10%)
    if (Math.random() < 0.1) {
      return { success: false, message: "Erreur de paiement. Veuillez réessayer." }
    }

    // Met à jour l'école
    this.schools[schoolIndex] = {
      ...this.schools[schoolIndex],
      account_status: 'active',
      subscription_start_date: new Date(),
      subscription_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
      subscription_plan: planId as any
    }

    return { 
      success: true, 
      message: `Abonnement ${plan.name} activé avec succès! Toutes vos données sont maintenant disponibles.` 
    }
  }

  /**
   * Simule l'annulation d'un abonnement
   */
  static async cancelSubscription(schoolId: string): Promise<{success: boolean, message: string}> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const schoolIndex = this.schools.findIndex(s => s.id === schoolId)
    if (schoolIndex === -1) {
      return { success: false, message: "École non trouvée" }
    }

    this.schools[schoolIndex] = {
      ...this.schools[schoolIndex],
      account_status: 'trial_expired'
    }

    return { 
      success: true, 
      message: "Abonnement annulé. Vos données restent accessibles en lecture seule." 
    }
  }

  /**
   * Génère des données d'utilisation fictives
   */
  static generateUsageStats(school: MockSchool) {
    return {
      studentsAdded: Math.floor(school.students_count * 0.8),
      teachersAdded: Math.floor(school.teachers_count * 0.9),
      classesCreated: school.classes_count,
      reportsGenerated: Math.floor(Math.random() * 20) + 5,
      parentNotifications: Math.floor(Math.random() * 100) + 20,
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }
  }

  /**
   * Simule les notifications d'essai
   */
  static getTrialNotifications(school: MockSchool): Array<{
    type: 'info' | 'warning' | 'error'
    message: string
    action?: string
  }> {
    const daysLeft = this.calculateTrialDaysLeft(school.trial_end_date)
    const notifications = []

    if (school.account_status === 'trial') {
      if (daysLeft <= 1) {
        notifications.push({
          type: 'error' as const,
          message: `Votre essai expire ${daysLeft === 0 ? 'aujourd\'hui' : 'demain'} ! Toutes vos données seront conservées.`,
          action: 'Passer à l\'abonnement'
        })
      } else if (daysLeft <= 3) {
        notifications.push({
          type: 'warning' as const,
          message: `Plus que ${daysLeft} jours d'essai gratuit. Préparez votre transition !`,
          action: 'Voir les plans'
        })
      } else if (daysLeft <= 7) {
        notifications.push({
          type: 'info' as const,
          message: `${daysLeft} jours restants dans votre essai gratuit.`,
          action: 'Découvrir les plans'
        })
      }
    }

    if (school.account_status === 'trial_expired') {
      notifications.push({
        type: 'error' as const,
        message: 'Votre essai a expiré. Vos données sont sécurisées et vous attendent !',
        action: 'Réactiver maintenant'
      })
    }

    return notifications
  }
}

// Hook React pour utiliser le service
export function useMockSchool(schoolId?: string) {
  const [school, setSchool] = useState<MockSchool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true)
        const schoolData = schoolId 
          ? await MockDataService.getSchool(schoolId)
          : await MockDataService.getCurrentSchool()
        
        setSchool(schoolData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchSchool()
  }, [schoolId])

  return { school, loading, error, setSchool }
}

// Hook pour la mise à niveau
export function useUpgrade() {
  const [upgrading, setUpgrading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upgrade = async (schoolId: string, planId: string) => {
    setUpgrading(true)
    setError(null)
    
    try {
      const result = await MockDataService.upgradeSubscription(schoolId, planId)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return { success: false, message: 'Erreur lors de la mise à niveau' }
    } finally {
      setUpgrading(false)
    }
  }

  return { upgrade, upgrading, error }
}
