import FeaturePageLayout from "@/components/FeaturePageLayout"
import { ClipboardList } from "lucide-react"

export default function StaffManagementPage() {
  return (
    <FeaturePageLayout
      icon={ClipboardList}
      title="Gestion du Personnel"
      description="Outils efficaces pour gérer les dossiers du personnel, présences, évaluations et paie"
      longDescription="Optimisez la gestion de votre équipe pédagogique et administrative avec notre système RH intégré. De l'embauche à la retraite, suivez tous les aspects de la carrière de vos employés."
      imagePath="/images/features/staff-management.svg"
      benefits={[
        "Dossiers personnel numériques complets et sécurisés",
        "Gestion des présences et congés automatisée",
        "Système d'évaluation et de promotion intégré",
        "Calcul automatique des salaires et primes",
        "Gestion des formations et certifications",
        "Rapports RH détaillés et analytiques"
      ]}
      features={[
        "Base de données du personnel centralisée",
        "Gestion des contrats et renouvellements",
        "Système de pointage et présences",
        "Calcul automatique des salaires",
        "Gestion des congés et permissions",
        "Évaluations de performance",
        "Suivi des formations continues",
        "Génération automatique de bulletins de paie"
      ]}
      useCases={[
        {
          title: "Recrutement simplifié",
          description: "Gérez tout le processus de recrutement depuis une interface unique",
          example: "Publiez les offres d'emploi, collectez les candidatures, programmez les entretiens et gérez les contrats d'embauche digitalement."
        },
        {
          title: "Gestion des présences",
          description: "Suivi automatique des présences et calcul des heures",
          example: "Les enseignants pointent via l'application mobile, le système calcule automatiquement les heures supplémentaires et les retards."
        },
        {
          title: "Évaluations périodiques",
          description: "Système d'évaluation standardisé pour tous les employés",
          example: "Évaluations trimestrielles automatisées avec critères personnalisés, feedback 360° et plans de développement individuels."
        }
      ]}
      testimonial={{
        text: "La gestion RH était notre cauchemar administratif. Maintenant, nous économisons 15 heures par semaine et les erreurs de paie ont disparu.",
        author: "Sylvie Kabongo",
        school: "Directrice RH, Université Protestante au Congo, Kinshasa"
      }}
    />
  )
}
