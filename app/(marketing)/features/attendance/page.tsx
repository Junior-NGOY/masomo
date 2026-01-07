import FeaturePageLayout from "@/components/FeaturePageLayout"
import { CalendarDays } from "lucide-react"

export default function AttendancePage() {
  return (
    <FeaturePageLayout
      icon={CalendarDays}
      title="Système de Présence"
      description="Suivi automatisé des présences pour étudiants et personnel avec notifications instantanées"
      longDescription="Révolutionnez le suivi des présences avec notre système intelligent. Pointage automatique, notifications en temps réel et analyses détaillées pour optimiser la fréquentation scolaire."
      imagePath="/images/features/attendance.svg"
      benefits={[
        "Pointage automatique via badges RFID ou reconnaissance faciale",
        "Notifications instantanées aux parents en cas d'absence",
        "Rapports de fréquentation détaillés et analyses",
        "Détection automatique des retards et absences",
        "Intégration avec les systèmes de sécurité",
        "Suivi des présences du personnel enseignant"
      ]}
      features={[
        "Pointage automatique multi-modal",
        "Notifications push instantanées",
        "Détection automatique des retards",
        "Justification d'absences en ligne",
        "Rapports de fréquentation",
        "Alertes d'absentéisme chronique",
        "Intégration système de sécurité",
        "Statistiques détaillées par classe"
      ]}
      useCases={[
        {
          title: "Pointage automatique",
          description: "Système de présence sans intervention manuelle",
          example: "Les élèves passent leur badge à l'entrée, le système enregistre automatiquement leur présence et alerte les parents si l'enfant n'arrive pas à l'heure."
        },
        {
          title: "Surveillance absentéisme",
          description: "Détection précoce des problèmes de fréquentation",
          example: "L'algorithme identifie automatiquement les élèves avec un taux d'absentéisme critique et alerte les conseillers pédagogiques."
        },
        {
          title: "Justifications dématérialisées",
          description: "Gestion numérique des absences justifiées",
          example: "Les parents peuvent justifier une absence via l'application mobile, télécharger un certificat médical et la validation est automatique."
        }
      ]}
      testimonial={{
        text: "Le taux d'absentéisme a chuté de 40% depuis l'installation. Les parents sont informés en temps réel et peuvent réagir immédiatement.",
        author: "Honoré Kapinga",
        school: "Directeur Disciplinaire, Collège Boboto, Kinshasa"
      }}
    />
  )
}
