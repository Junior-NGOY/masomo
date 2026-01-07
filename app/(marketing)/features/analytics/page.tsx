import FeaturePageLayout from "@/components/FeaturePageLayout"
import { BarChart2 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <FeaturePageLayout
      icon={BarChart2}
      title="Analytics & Rapports"
      description="Outils d'analyse puissants pour des décisions basées sur les données avec rapports personnalisables"
      longDescription="Transformez vos données scolaires en insights actionables avec notre suite analytique complète. Tableaux de bord interactifs, rapports automatisés et prédictions intelligentes pour optimiser vos performances."
      imagePath="/images/features/analytics.svg"
      benefits={[
        "Tableaux de bord en temps réel pour tous les indicateurs",
        "Rapports automatisés personnalisables par utilisateur",
        "Analyses prédictives pour la réussite scolaire",
        "Comparaisons inter-établissements et benchmarking",
        "Visualisations interactives et exportation de données",
        "Alertes automatiques sur les indicateurs critiques"
      ]}
      features={[
        "Dashboard exécutif en temps réel",
        "Rapports académiques automatisés",
        "Analyses financières détaillées",
        "Suivi des performances enseignants",
        "Statistiques de fréquentation",
        "Prédictions de réussite scolaire",
        "Exportation multi-format (PDF, Excel, CSV)",
        "Alertes et notifications intelligentes"
      ]}
      useCases={[
        {
          title: "Pilotage stratégique",
          description: "Tableaux de bord pour la direction avec KPI essentiels",
          example: "Le directeur consulte chaque matin un dashboard montrant les présences, performances académiques, situation financière et alertes importantes."
        },
        {
          title: "Analyse prédictive",
          description: "Identifiez les élèves à risque avant les échecs",
          example: "L'algorithme analyse les notes, présences et comportements pour prédire quels élèves risquent d'échouer et suggère des interventions."
        },
        {
          title: "Rapports ministériels",
          description: "Génération automatique des rapports officiels",
          example: "Tous les rapports trimestriels pour le ministère de l'éducation sont générés automatiquement avec les données normalisées."
        }
      ]}
      testimonial={{
        text: "Grâce aux analytics, nous avons identifié que 85% des échecs étaient liés à l'absentéisme. Nos interventions ciblées ont réduit le taux d'échec de 60%.",
        author: "Dr. Claudine Mwenze",
        school: "Directrice Pédagogique, Institut Supérieur des Arts et Métiers, Lubumbashi"
      }}
    />
  )
}
