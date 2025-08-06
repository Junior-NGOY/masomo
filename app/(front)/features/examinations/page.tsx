import FeaturePageLayout from "@/components/FeaturePageLayout"
import { FileText } from "lucide-react"

export default function ExaminationsPage() {
  return (
    <FeaturePageLayout
      icon={FileText}
      title="Portail d'Examens"
      description="Système complet de gestion des examens de la planification à la publication des résultats"
      longDescription="Digitalisez complètement votre processus d'examens avec notre portail intégré. Création d'épreuves, surveillance en ligne, correction automatique et publication sécurisée des résultats."
      imagePath="/images/features/examinations.svg"
      benefits={[
        "Création d'épreuves avec banque de questions intelligente",
        "Examens en ligne avec surveillance anti-triche",
        "Correction automatique et notation intelligente",
        "Publication sécurisée des résultats avec contrôle d'accès",
        "Statistiques détaillées par matière et par classe",
        "Intégration avec le système de notation général"
      ]}
      features={[
        "Banque de questions par matière",
        "Générateur d'épreuves automatique",
        "Surveillance en ligne temps réel",
        "Correction automatique intelligente",
        "Publication résultats sécurisée",
        "Statistiques et analyses détaillées",
        "Planification automatique des examens",
        "Système anti-plagiat intégré"
      ]}
      useCases={[
        {
          title: "Examens en ligne sécurisés",
          description: "Passage d'examens avec surveillance automatique",
          example: "Les élèves passent leurs examens sur tablette, le système détecte automatiquement les tentatives de triche et bloque l'accès externe."
        },
        {
          title: "Correction automatique",
          description: "Notation instantanée avec feedback détaillé",
          example: "Les QCM sont corrigés instantanément, les questions ouvertes analysées par IA, et les résultats disponibles 30 minutes après l'examen."
        },
        {
          title: "Analyses statistiques",
          description: "Rapport détaillé sur les performances par question",
          example: "Les enseignants voient quelles questions ont posé problème, identifient les lacunes du cours et adaptent leur pédagogie."
        }
      ]}
      testimonial={{
        text: "Nous avons réduit le temps de correction de 90% et éliminé les erreurs humaines. Les résultats sont disponibles le jour même des examens.",
        author: "Prof. Antoine Mulamba",
        school: "Directeur des Études, Université de Kinshasa"
      }}
    />
  )
}
