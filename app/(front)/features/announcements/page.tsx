import FeaturePageLayout from "@/components/FeaturePageLayout"
import { Bell } from "lucide-react"

export default function AnnouncementsPage() {
  return (
    <FeaturePageLayout
      icon={Bell}
      title="Tableau d'Annonces"
      description="Tableau d'annonces numérique pour communiqués, événements et mises à jour importantes"
      longDescription="Centralisez toutes vos communications officielles avec notre tableau d'annonces intelligent. Diffusion ciblée, notifications automatiques et gestion des priorités pour une information efficace."
      imagePath="/images/features/announcements.svg"
      benefits={[
        "Diffusion ciblée par audience (élèves, parents, personnel)",
        "Notifications push automatiques selon les priorités",
        "Planification et programmation des annonces",
        "Gestion des accusés de réception et lectures",
        "Archivage automatique avec moteur de recherche",
        "Intégration avec tous les canaux de communication"
      ]}
      features={[
        "Éditeur d'annonces riche et intuitif",
        "Ciblage par groupes et classes",
        "Notifications multi-canaux",
        "Programmation des publications",
        "Gestion des priorités et urgences",
        "Statistiques de lecture détaillées",
        "Archivage automatique organisé",
        "Modération et validation des contenus"
      ]}
      useCases={[
        {
          title: "Annonces d'urgence",
          description: "Diffusion immédiate d'informations critiques",
          example: "En cas de fermeture exceptionnelle, l'annonce est publiée instantanément et tous les parents reçoivent une notification push immédiate."
        },
        {
          title: "Événements scolaires",
          description: "Promotion et organisation des activités",
          example: "La journée portes ouvertes est annoncée avec formulaire d'inscription intégré, rappels automatiques et confirmation de participation."
        },
        {
          title: "Communications officielles",
          description: "Diffusion des décisions administratives importantes",
          example: "Les nouveaux règlements sont publiés avec accusé de réception obligatoire et suivi de lecture pour s'assurer que tous les parents sont informés."
        }
      ]}
      testimonial={{
        text: "Plus aucune information importante ne passe inaperçue. Le taux de lecture des annonces est passé de 30% à 95% grâce aux notifications ciblées.",
        author: "Julienne Makaya",
        school: "Coordinatrice Communication, Institut Technique Commercial de Matadi"
      }}
    />
  )
}
