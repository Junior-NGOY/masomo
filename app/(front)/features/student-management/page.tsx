import FeaturePageLayout from "@/components/FeaturePageLayout"
import { Users } from "lucide-react"

export default function StudentManagementPage() {
  return (
    <FeaturePageLayout
      icon={Users}
      title="Gestion des Étudiants"
      description="Système complet d'information étudiant pour gérer les inscriptions, profils et dossiers académiques"
      longDescription="Notre système de gestion des étudiants révolutionne la façon dont les écoles gèrent les informations des élèves. De l'inscription à l'obtention du diplôme, suivez chaque étape du parcours académique avec une interface intuitive et des outils puissants."
      imagePath="/images/features/student-management.svg"
      benefits={[
        "Inscription et réinscription automatisées avec formulaires personnalisables",
        "Profils étudiants complets avec photos, contacts et informations médicales",
        "Suivi des performances académiques en temps réel",
        "Gestion des transferts et des changements de classe simplifiée",
        "Rapports détaillés sur les cohortes et statistiques étudiantes",
        "Intégration avec les systèmes de paiement et de communication"
      ]}
      features={[
        "Base de données centralisée des étudiants",
        "Formulaires d'inscription personnalisables",
        "Gestion des classes et des groupes",
        "Suivi des présences intégré",
        "Historique académique complet",
        "Génération automatique de cartes étudiantes",
        "Système de notifications aux parents",
        "Rapports et statistiques avancés"
      ]}
      useCases={[
        {
          title: "Inscription en ligne",
          description: "Simplifiez le processus d'inscription avec des formulaires numériques",
          example: "Les parents peuvent inscrire leurs enfants depuis chez eux, télécharger les documents requis et payer les frais d'inscription en ligne."
        },
        {
          title: "Suivi des performances",
          description: "Monitorer les progrès académiques de chaque étudiant",
          example: "Les enseignants peuvent voir instantanément l'historique des notes, les tendances de performance et identifier les élèves ayant besoin d'aide."
        },
        {
          title: "Gestion des transferts",
          description: "Traiter les changements d'école et de classe efficacement",
          example: "En cas de déménagement, les dossiers peuvent être transférés numériquement vers la nouvelle école en quelques clics."
        }
      ]}
      testimonial={{
        text: "Masomo Pro a transformé notre processus d'inscription. Nous avons économisé 70% du temps administratif et éliminé les erreurs de saisie.",
        author: "Marie Kasongo",
        school: "Directrice, École Primaire Sainte-Marie, Kinshasa"
      }}
    />
  )
}
