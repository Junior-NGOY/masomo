import FeaturePageLayout from "@/components/FeaturePageLayout"
import { BookOpen } from "lucide-react"

export default function ResourcesPage() {
  return (
    <FeaturePageLayout
      icon={BookOpen}
      title="Gestion des Ressources"
      description="Système de bibliothèque numérique, suivi d'inventaire et planification des installations"
      longDescription="Optimisez la gestion de toutes vos ressources éducatives avec notre système intégré. Bibliothèque numérique, inventaire matériel, réservation d'espaces - tout centralisé pour une efficacité maximale."
      imagePath="/images/features/resources.svg"
      benefits={[
        "Bibliothèque numérique avec recherche avancée",
        "Inventaire automatisé de tout le matériel scolaire",
        "Système de réservation des salles et équipements",
        "Suivi des prêts et retours automatisé",
        "Gestion des maintenances et réparations",
        "Planification optimisée des ressources"
      ]}
      features={[
        "Catalogue numérique complet",
        "Système de codes-barres/QR codes",
        "Réservation en ligne des ressources",
        "Suivi des prêts et retours",
        "Gestion des maintenances",
        "Inventaire automatisé",
        "Rapports d'utilisation détaillés",
        "Notifications de disponibilité"
      ]}
      useCases={[
        {
          title: "Bibliothèque numérique",
          description: "Catalogage et prêt automatisé des ouvrages",
          example: "Les élèves scannent le QR code des livres pour les emprunter, le système gère automatiquement les retours et envoie des rappels."
        },
        {
          title: "Réservation d'équipements",
          description: "Planification intelligente des ressources partagées",
          example: "Les enseignants réservent projecteurs, laboratoires ou salles informatiques via l'application, évitant les conflits d'usage."
        },
        {
          title: "Maintenance préventive",
          description: "Suivi automatique de l'état des équipements",
          example: "Le système planifie automatiquement les maintenances, commande les pièces de rechange et alerte avant les pannes."
        }
      ]}
      testimonial={{
        text: "Notre bibliothèque est devenue 100% numérique. Les élèves trouvent les livres en 30 secondes au lieu de 10 minutes, et nous avons éliminé les pertes.",
        author: "Bernadette Kasanza",
        school: "Bibliothécaire en Chef, Athénée Royal de Bukavu"
      }}
    />
  )
}
