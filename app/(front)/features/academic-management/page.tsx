import FeaturePageLayout from "@/components/FeaturePageLayout"
import { GraduationCap } from "lucide-react"

export default function AcademicManagementPage() {
  return (
    <FeaturePageLayout
      icon={GraduationCap}
      title="Gestion Académique"
      description="Planification curriculaire, examens, notation et génération de bulletins dans un système unifié"
      longDescription="Centralisez toute la gestion académique de votre école avec notre système complet. De la planification des cours à la génération des bulletins, tout est automatisé et synchronisé pour une efficacité maximale."
      imagePath="/images/features/academic-management.svg"
      benefits={[
        "Planification automatique des emplois du temps et des salles",
        "Système de notation flexible adapté aux différents niveaux",
        "Génération automatique de bulletins personnalisés",
        "Suivi des programmes scolaires et des objectifs pédagogiques",
        "Évaluation continue et examens intégrés",
        "Rapports de performance par classe et par matière"
      ]}
      features={[
        "Gestionnaire de curriculum et programmes",
        "Système de notation multi-critères",
        "Génération automatique de bulletins",
        "Calendrier académique intégré",
        "Suivi des objectifs pédagogiques",
        "Évaluations et examens en ligne",
        "Rapports de performance détaillés",
        "Historique académique complet"
      ]}
      useCases={[
        {
          title: "Planification curriculaire",
          description: "Organisez vos programmes scolaires selon les standards nationaux",
          example: "Le système adapte automatiquement les programmes aux exigences du ministère de l'éducation congolais et génère les plannings trimestriels."
        },
        {
          title: "Notation et évaluation",
          description: "Système de notation flexible pour tous les niveaux",
          example: "Les enseignants peuvent utiliser différents barèmes (sur 20, lettres, compétences) et le système calcule automatiquement les moyennes."
        },
        {
          title: "Bulletins automatisés",
          description: "Génération instantanée de bulletins personnalisés",
          example: "En fin de trimestre, tous les bulletins sont générés automatiquement avec logos, signatures et commentaires personnalisés."
        }
      ]}
      testimonial={{
        text: "La gestion académique n'a jamais été aussi simple. Nous avons divisé par 3 le temps de préparation des bulletins.",
        author: "Jean-Claude Mbuyi",
        school: "Directeur Pédagogique, Lycée Technique de Lubumbashi"
      }}
    />
  )
}
