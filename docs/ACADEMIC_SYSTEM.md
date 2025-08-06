# Système de Gestion Académique - Documentation Technique

## Vue d'ensemble

Le système de gestion académique permet aux élèves de consulter leurs notes, horaires et évaluations de manière complète et interactive. Il comprend plusieurs modules interconnectés pour une expérience utilisateur optimale.

## Architecture

### Services Principaux

#### 1. GradesService (`/services/gradesService.ts`)
- **Objectif**: Gestion complète des notes et évaluations
- **Fonctionnalités**:
  - Tracking des notes par matière et type d'évaluation
  - Calcul automatique des moyennes (trimestre/semestre)
  - Conversion pourcentage vers note lettre (A+ à F)
  - Génération de bulletins et rapports
  - Export Excel des données académiques

#### 2. ScheduleService (`/services/scheduleService.ts`)
- **Objectif**: Gestion des emplois du temps et planifications
- **Fonctionnalités**:
  - Génération d'horaires hebdomadaires
  - Détection de conflits de planning
  - Gestion des évaluations programmées
  - Support des créneaux horaires flexibles
  - Export des plannings

### Composants Interface

#### 1. StudentGradesPage (`/components/StudentGradesPage.tsx`)
- **Interface principale** pour la consultation des notes
- **Onglets disponibles**:
  - Vue d'ensemble (moyennes, statistiques)
  - Par matière (détail des notes)
  - Détails complets (toutes les évaluations)
- **Fonctionnalités**:
  - Filtrage par période/matière/type
  - Recherche en temps réel
  - Export des données
  - Visualisation colorée des performances

#### 2. StudentSchedulePage (`/components/StudentSchedulePage.tsx`)
- **Interface principale** pour la consultation des horaires
- **Onglets disponibles**:
  - Aujourd'hui (cours du jour)
  - Semaine (planning complet)
  - À venir (prochains cours)
  - Évaluations (examens programmés)
- **Fonctionnalités**:
  - Indication des cours en cours
  - Navigation par semaine
  - Alertes pour les évaluations
  - Export des horaires

#### 3. AcademicNavigation (`/components/AcademicNavigation.tsx`)
- **Menu de navigation** adaptatif selon le type d'utilisateur
- **Support multi-rôles**: Élève, Enseignant, Administration
- **Statistiques rapides** et notifications
- **Actions rapides** d'export et paramétrage

## Types de Données

### Évaluations Supportées
```typescript
type EvaluationType = 
  | 'DEVOIR'           // Devoirs en classe
  | 'INTERROGATION'    // Interrogations écrites
  | 'EXAMEN'          // Examens trimestriels/semestriels
  | 'TRAVAIL_PRATIQUE' // TP et manipulations
  | 'PARTICIPATION'    // Participation orale
  | 'PROJET';         // Projets et exposés
```

### Système de Notation
```typescript
// Conversion automatique pourcentage → note lettre
90-100% → A+ (Excellent)
85-89%  → A  (Très bien)
80-84%  → A- (Bien+)
75-79%  → B+ (Bien)
70-74%  → B  (Assez bien)
65-69%  → B- (Assez bien-)
60-64%  → C+ (Passable+)
55-59%  → C  (Passable)
50-54%  → C- (Passable-)
45-49%  → D+ (Insuffisant+)
40-44%  → D  (Insuffisant)
0-39%   → F  (Échec)
```

### Périodes Académiques
```typescript
type AcademicPeriod = 
  | 'TRIMESTRE_1' | 'TRIMESTRE_2' | 'TRIMESTRE_3'  // Système trimestre
  | 'SEMESTRE_1' | 'SEMESTRE_2';                   // Système semestre
```

## Fonctionnalités Avancées

### 1. Export de Données
- **Format Excel** avec formatage professionnel
- **Métadonnées** incluses (élève, classe, période)
- **Horodatage** automatique
- **Colonnes configurables** selon le contexte

### 2. Recherche et Filtrage
- **Recherche textuelle** en temps réel
- **Filtres multiples** (période, matière, type)
- **Tri dynamique** des résultats
- **Persistance** des préférences utilisateur

### 3. Visualisation des Performances
- **Codes couleur** pour les notes (vert: bon, orange: moyen, rouge: faible)
- **Indicateurs visuels** de progression
- **Graphiques** de tendance (à implémenter)
- **Comparaisons** avec la moyenne de classe

### 4. Gestion du Temps Réel
- **Mise à jour automatique** de l'heure
- **Indication des cours en cours** (badge animé)
- **Notification** des prochains cours
- **Alertes** pour les évaluations imminentes

## Intégration avec l'Existant

### Services Compatibles
- **ExportService**: Réutilise le système d'export Excel existant
- **AuthService**: Compatible avec l'authentification multi-modale
- **QRCodeService**: Intégration possible pour signature d'examens

### API Backend (à développer)
```typescript
// Endpoints suggérés
GET /api/students/{id}/grades      // Notes de l'élève
GET /api/students/{id}/schedule    // Horaire de l'élève
GET /api/classes/{id}/evaluations  // Évaluations de la classe
POST /api/grades                   // Saisie de notes (enseignants)
PUT /api/schedule/{id}             // Modification d'horaire
```

## Configuration et Déploiement

### Variables d'Environnement
```env
# Configuration académique
ACADEMIC_YEAR=2024-2025
SCHOOL_SYSTEM=TRIMESTRE  # ou SEMESTRE
DEFAULT_LOCALE=fr-FR
EXPORT_FORMAT=XLSX

# Paramètres de notation
PASSING_GRADE=50
EXCELLENCE_THRESHOLD=85
WARNING_THRESHOLD=40
```

### Dépendances Requises
```json
{
  "dependencies": {
    "lucide-react": "^0.400.0",    // Icônes
    "date-fns": "^2.30.0",         // Gestion des dates
    "uuid": "^9.0.0",              // Génération d'IDs
    "xlsx": "^0.18.5"              // Export Excel
  }
}
```

## Guide d'Utilisation

### Pour les Élèves
1. **Accéder à l'espace académique** via le menu principal
2. **Consulter les notes** dans l'onglet "Mes Notes"
3. **Vérifier l'horaire** dans l'onglet "Mon Horaire"
4. **Exporter les données** via les boutons dédiés

### Pour les Enseignants
1. **Saisir les notes** via l'interface dédiée
2. **Gérer les plannings** de cours et évaluations
3. **Suivre les présences** et générer des rapports
4. **Consulter les statistiques** de classe

### Pour l'Administration
1. **Vue d'ensemble** des performances générales
2. **Gestion des plannings** globaux
3. **Rapports détaillés** et analyses
4. **Configuration** du système de notation

## Roadmap et Améliorations

### Phase 2 (à venir)
- [ ] Interface enseignant pour saisie de notes
- [ ] Système de notifications push
- [ ] Génération automatique de bulletins PDF
- [ ] Graphiques de performance avancés
- [ ] Module de communication parents-école

### Phase 3 (future)
- [ ] Application mobile dédiée
- [ ] Intégration avec systèmes externes (LMS)
- [ ] Analytics et IA pour prédiction de performance
- [ ] Système de recommandations personnalisées

## Support et Maintenance

### Logs et Debugging
- **Console.log** pour le développement
- **Error boundaries** React pour la production
- **Monitoring** des performances à implémenter

### Tests
- **Tests unitaires** pour les services
- **Tests d'intégration** pour les composants
- **Tests E2E** pour les workflows utilisateur

---

*Dernière mise à jour: Janvier 2025*
*Version: 1.0.0*
