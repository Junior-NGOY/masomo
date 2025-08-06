// services/subscriptionService.ts
import { useState, useEffect } from 'react'
import { MockSchool, MockDataService, MockSubscriptionPlan } from './mockDataService'

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  features: string[]
  maxStudents: number
  maxTeachers: number
  maxSchools: number
}

export class SubscriptionService {
  
  /**
   * Vérifie le statut du compte et met à jour si nécessaire
   */
  static async checkAccountStatus(schoolId: string): Promise<MockSchool> {
    const school = await this.getSchool(schoolId)
    
    if (school.account_status === 'trial') {
      const now = new Date()
      if (now > school.trial_end_date) {
        // Essai expiré, basculer en lecture seule
        await this.updateSchoolStatus(schoolId, 'trial_expired')
        school.account_status = 'trial_expired'
      }
    }
    
    return school
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
   * Vérifie si une opération d'écriture est autorisée
   */
  static canPerformWriteOperation(school: MockSchool): boolean {
    return school.account_status === 'trial' || school.account_status === 'active'
  }
  
  /**
   * Vérifie si une opération de lecture est autorisée
   */
  static canPerformReadOperation(school: MockSchool): boolean {
    // Lecture autorisée pour tous les statuts sauf cancelled
    return school.account_status !== 'cancelled'
  }
  
  /**
   * Passe d'un essai à un abonnement payant
   */
  static async upgradeFromTrialToPaid(
    schoolId: string, 
    planType: 'basic' | 'premium' | 'enterprise',
    paymentMethod: any
  ): Promise<{success: boolean, message: string, subscription?: any}> {
    
    try {
      // 1. Vérifier que l'école existe et est en essai ou essai expiré
      const school = await this.getSchool(schoolId)
      if (!['trial', 'trial_expired'].includes(school.account_status)) {
        return {
          success: false,
          message: 'Cette école n\'est pas éligible pour une mise à niveau'
        }
      }
      
      // 2. Créer l'abonnement avec le fournisseur de paiement
      const subscription = await this.createSubscription(schoolId, planType, paymentMethod)
      
      // 3. Mettre à jour le statut de l'école
      await this.updateSchoolStatus(schoolId, 'active')
      
      // 4. Enregistrer les détails de l'abonnement
      await this.saveSubscriptionDetails(schoolId, subscription)
      
      // 5. Débloquer toutes les fonctionnalités
      await this.unlockAllFeatures(schoolId)
      
      // 6. Envoyer un email de bienvenue
      await this.sendWelcomeEmail(schoolId)
      
      // 7. CRUCIAL: Aucune suppression de données
      // Toutes les données d'essai restent intactes
      
      return {
        success: true,
        message: 'Abonnement activé avec succès! Toutes vos données sont disponibles.',
        subscription
      }
      
    } catch (error) {
      console.error('Erreur lors de la mise à niveau:', error)
      return {
        success: false,
        message: 'Erreur lors de l\'activation de l\'abonnement. Veuillez réessayer.'
      }
    }
  }
  
  /**
   * Réactive un abonnement expiré
   */
  static async reactivateExpiredTrial(
    schoolId: string,
    planType: 'basic' | 'premium' | 'enterprise',
    paymentMethod: any
  ): Promise<{success: boolean, message: string}> {
    
    try {
      const school = await this.getSchool(schoolId)
      
      if (school.account_status !== 'trial_expired') {
        return {
          success: false,
          message: 'Cette école n\'a pas d\'essai expiré à réactiver'
        }
      }
      
      // Même processus que upgrade, mais avec un message différent
      const result = await this.upgradeFromTrialToPaid(schoolId, planType, paymentMethod)
      
      if (result.success) {
        return {
          success: true,
          message: 'Abonnement réactivé! Vous pouvez maintenant accéder à toutes vos données.'
        }
      }
      
      return result
      
    } catch (error) {
      console.error('Erreur lors de la réactivation:', error)
      return {
        success: false,
        message: 'Erreur lors de la réactivation. Veuillez réessayer.'
      }
    }
  }
  
  /**
   * Obtient les plans d'abonnement disponibles
   */
  static getAvailablePlans(): SubscriptionPlan[] {
    return [
      {
        id: 'basic',
        name: 'Plan Basic',
        price: 25000,
        currency: 'CDF',
        features: [
          'Jusqu\'à 500 élèves',
          'Gestion des notes',
          'Communication parents',
          'Rapports de base',
          'Support par email'
        ],
        maxStudents: 500,
        maxTeachers: 50,
        maxSchools: 1
      },
      {
        id: 'premium',
        name: 'Plan Premium',
        price: 45000,
        currency: 'CDF',
        features: [
          'Jusqu\'à 1500 élèves',
          'Toutes les fonctionnalités Basic',
          'Gestion financière avancée',
          'Rapports détaillés',
          'Site web personnalisé',
          'Support prioritaire'
        ],
        maxStudents: 1500,
        maxTeachers: 150,
        maxSchools: 3
      },
      {
        id: 'enterprise',
        name: 'Plan Enterprise',
        price: 75000,
        currency: 'CDF',
        features: [
          'Élèves illimités',
          'Toutes les fonctionnalités Premium',
          'Multi-écoles illimité',
          'API personnalisée',
          'Formation sur site',
          'Support 24/7'
        ],
        maxStudents: -1, // Illimité
        maxTeachers: -1, // Illimité
        maxSchools: -1   // Illimité
      }
    ]
  }
  
  /**
   * Méthodes privées (implémentation dépendante de votre DB)
   */
  private static async getSchool(schoolId: string): Promise<MockSchool> {
    // Implémentation avec votre base de données
    // Retourne les données de l'école
    throw new Error('À implémenter avec votre base de données')
  }
  
  private static async updateSchoolStatus(schoolId: string, status: MockSchool['account_status']): Promise<void> {
    // Mettre à jour le statut dans la base de données
    throw new Error('À implémenter avec votre base de données')
  }
  
  private static async createSubscription(schoolId: string, planType: string, paymentMethod: any): Promise<any> {
    // Créer l'abonnement avec votre fournisseur de paiement (Stripe, PayPal, etc.)
    throw new Error('À implémenter avec votre fournisseur de paiement')
  }
  
  private static async saveSubscriptionDetails(schoolId: string, subscription: any): Promise<void> {
    // Sauvegarder les détails de l'abonnement
    throw new Error('À implémenter avec votre base de données')
  }
  
  private static async unlockAllFeatures(schoolId: string): Promise<void> {
    // Débloquer toutes les fonctionnalités
    // Généralement, cela se fait via le statut du compte
    console.log(`Fonctionnalités débloquées pour l'école ${schoolId}`)
  }
  
  private static async sendWelcomeEmail(schoolId: string): Promise<void> {
    // Envoyer un email de bienvenue
    throw new Error('À implémenter avec votre service d\'email')
  }
}

// Hooks React pour utiliser le service
export function useSubscriptionStatus(schoolId: string) {
  const [school, setSchool] = useState<MockSchool | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const updatedSchool = await SubscriptionService.checkAccountStatus(schoolId)
        setSchool(updatedSchool)
      } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkStatus()
  }, [schoolId])
  
  return { school, loading }
}

// Middleware pour les routes protégées
export function withSubscriptionCheck(handler: any) {
  return async (req: any, res: any) => {
    try {
      const schoolId = req.user?.schoolId // Adapté à votre système d'auth
      const school = await SubscriptionService.checkAccountStatus(schoolId)
      
      // Vérifier si l'opération est autorisée
      const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
      
      if (isWriteOperation && !SubscriptionService.canPerformWriteOperation(school)) {
        return res.status(403).json({
          error: 'Abonnement requis',
          message: 'Votre essai a expiré. Veuillez vous abonner pour continuer.',
          accountStatus: school.account_status
        })
      }
      
      if (!SubscriptionService.canPerformReadOperation(school)) {
        return res.status(403).json({
          error: 'Accès refusé',
          message: 'Compte suspendu. Contactez le support.',
          accountStatus: school.account_status
        })
      }
      
      // Ajouter les infos de l'école à la requête
      req.school = school
      
      return handler(req, res)
      
    } catch (error) {
      console.error('Erreur du middleware de vérification:', error)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }
}
