import FeaturePageLayout from "@/components/FeaturePageLayout"
import { MessageSquare } from "lucide-react"

export default function CommunicationPage() {
  return (
    <FeaturePageLayout
      icon={MessageSquare}
      title="Hub de Communication"
      description="Système de messagerie intégré avec notifications multi-canaux pour une communication scolaire fluide"
      longDescription="Révolutionnez la communication dans votre école avec notre hub centralisé. Connectez administration, enseignants, parents et élèves à travers une plateforme unique et sécurisée."
      imagePath="/images/features/communication.svg"
      benefits={[
        "Messagerie instantanée entre tous les acteurs de l'école",
        "Notifications push et SMS pour les urgences",
        "Canaux de communication organisés par classe/matière",
        "Partage de documents et ressources pédagogiques",
        "Historique des communications accessible",
        "Traduction automatique pour les familles multilingues"
      ]}
      features={[
        "Messagerie interne sécurisée",
        "Notifications multi-canaux (SMS, email, push)",
        "Groupes de discussion par classe",
        "Partage de fichiers et documents",
        "Calendrier des événements partagé",
        "Sondages et votes en ligne",
        "Système d'annonces ciblées",
        "Modération automatique des contenus"
      ]}
      useCases={[
        {
          title: "Communication parent-enseignant",
          description: "Facilitez les échanges entre parents et équipe pédagogique",
          example: "Les parents peuvent discuter directement avec les enseignants, programmer des rendez-vous et recevoir des mises à jour sur les progrès de leurs enfants."
        },
        {
          title: "Annonces d'urgence",
          description: "Diffusez rapidement les informations importantes",
          example: "En cas de fermeture d'école ou d'événement spécial, tous les parents reçoivent instantanément l'information par SMS et notification."
        },
        {
          title: "Collaboration pédagogique",
          description: "Renforcez la collaboration entre enseignants",
          example: "Les enseignants partagent des ressources, coordonnent les projets interdisciplinaires et planifient les activités communes."
        }
      ]}
      testimonial={{
        text: "Fini les malentendus ! La communication avec les parents est maintenant claire et traçable. Nous avons réduit de 80% les conflits liés aux malentendus.",
        author: "Agnès Mukendi",
        school: "Directrice, Institut Technique Immaculée Conception, Goma"
      }}
    />
  )
}
