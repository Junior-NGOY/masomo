# Transition Essai Gratuit → Abonnement Payant

## 🎯 Objectif
Assurer une transition fluide et transparente des données lors du passage de l'essai gratuit à l'abonnement payant.

## 📋 Stratégie de continuité des données

### 1. **Conservation totale des données**
- ✅ Toutes les données de l'essai sont **conservées définitivement**
- ✅ Aucune perte d'information lors du passage à l'abonnement
- ✅ Continuité parfaite de l'expérience utilisateur

### 2. **Statuts de compte**
```typescript
enum AccountStatus {
  TRIAL = 'trial',           // Essai gratuit actif (30 jours)
  TRIAL_EXPIRED = 'trial_expired', // Essai expiré, accès lecture seule
  ACTIVE = 'active',         // Abonnement payant actif
  SUSPENDED = 'suspended',   // Abonnement suspendu (impayé)
  CANCELLED = 'cancelled'    // Abonnement annulé
}
```

### 3. **Limitations par statut**

#### **TRIAL (Essai gratuit - 30 jours)**
- ✅ Accès complet à toutes les fonctionnalités
- ✅ Ajout illimité d'élèves, enseignants, classes
- ✅ Toutes les fonctionnalités de base et avancées
- ⚠️ Bannière discrète rappelant l'essai
- ⚠️ Emails de rappel à J-7, J-3, J-1

#### **TRIAL_EXPIRED (Essai expiré)**
- ✅ **Accès en lecture seule** aux données
- ✅ Consultation des rapports existants
- ✅ Export des données importantes
- ❌ Pas de nouvelles inscriptions d'élèves
- ❌ Pas de modification des données
- ❌ Pas d'ajout de nouvelles classes
- 🔥 **Bannière proéminente** : "Votre essai a expiré - Abonnez-vous pour continuer"

#### **ACTIVE (Abonnement payant)**
- ✅ **Toutes les données de l'essai récupérées**
- ✅ Accès complet à toutes les fonctionnalités
- ✅ Nouvelles fonctionnalités premium
- ✅ Support prioritaire
- ✅ Sauvegardes automatiques quotidiennes

## 🔧 Implémentation technique

### 1. **Structure de base de données**
```sql
-- Table des écoles
CREATE TABLE schools (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  account_status VARCHAR(50) DEFAULT 'trial',
  trial_start_date TIMESTAMP,
  trial_end_date TIMESTAMP,
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des abonnements
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  school_id UUID REFERENCES schools(id),
  plan_type VARCHAR(50) NOT NULL, -- 'basic', 'premium', 'enterprise'
  status VARCHAR(50) NOT NULL,    -- 'active', 'cancelled', 'past_due'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. **Middleware de vérification**
```typescript
// middleware/checkAccountStatus.ts
export function checkAccountStatus(req: NextRequest) {
  const school = getCurrentSchool(req);
  
  switch (school.account_status) {
    case 'trial':
      if (new Date() > school.trial_end_date) {
        // Basculer automatiquement vers trial_expired
        updateSchoolStatus(school.id, 'trial_expired');
        return redirectToUpgrade();
      }
      break;
      
    case 'trial_expired':
      // Accès lecture seule uniquement
      if (isWriteOperation(req)) {
        return showUpgradeModal();
      }
      break;
      
    case 'active':
      // Accès complet
      break;
  }
}
```

### 3. **Processus de mise à niveau**
```typescript
// services/upgradeService.ts
export async function upgradeFromTrialToPaid(schoolId: string, planType: string) {
  try {
    // 1. Créer l'abonnement
    const subscription = await createSubscription(schoolId, planType);
    
    // 2. Mettre à jour le statut de l'école
    await updateSchoolStatus(schoolId, 'active');
    
    // 3. Débloquer toutes les fonctionnalités
    await unlockAllFeatures(schoolId);
    
    // 4. Envoyer email de confirmation
    await sendWelcomeEmail(schoolId);
    
    // 5. ✅ AUCUNE SUPPRESSION DE DONNÉES
    // Toutes les données existantes restent intactes
    
    return { success: true, message: 'Mise à niveau réussie' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 📧 Communication avec l'utilisateur

### **Emails de rappel d'essai**
- **J-7** : "Plus que 7 jours d'essai gratuit"
- **J-3** : "Votre essai se termine dans 3 jours"
- **J-1** : "Dernière chance - Votre essai se termine demain"
- **J+1** : "Votre essai a expiré - Récupérez vos données"

### **Messages dans l'interface**
```typescript
// components/TrialStatusBanner.tsx
export function TrialStatusBanner({ school }: { school: School }) {
  const daysLeft = calculateDaysLeft(school.trial_end_date);
  
  if (school.account_status === 'trial') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800">
              Plus que {daysLeft} jours d'essai gratuit
            </span>
          </div>
          <Button variant="outline" size="sm">
            Passer à l'abonnement
          </Button>
        </div>
      </div>
    );
  }
  
  if (school.account_status === 'trial_expired') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">
              Votre essai a expiré - Accès en lecture seule
            </span>
          </div>
          <Button className="bg-red-600 hover:bg-red-700" size="sm">
            Reprendre l'abonnement
          </Button>
        </div>
      </div>
    );
  }
  
  return null;
}
```

## 🎯 Avantages de cette approche

### **Pour l'utilisateur**
- ✅ **Sécurité** : Aucune perte de données
- ✅ **Confiance** : Expérience transparente
- ✅ **Continuité** : Pas de rupture dans l'utilisation
- ✅ **Flexibilité** : Temps de décision après expiration

### **Pour le business**
- ✅ **Conversion** : Facilite le passage à l'abonnement
- ✅ **Rétention** : Les utilisateurs ne perdent pas leur travail
- ✅ **Satisfaction** : Expérience utilisateur positive
- ✅ **Réactivation** : Possibilité de revenir même après expiration

## 🚀 Recommandations

1. **Implémentez cette logique dès le début** pour éviter les complications
2. **Communiquez clairement** cette politique aux utilisateurs
3. **Testez thoroughly** les transitions de statut
4. **Prévoyez des sauvegardes** automatiques pendant l'essai
5. **Offrez une période de grâce** de 7 jours après expiration

Cette approche garantit une expérience utilisateur exceptionnelle et maximise les chances de conversion ! 🎉
