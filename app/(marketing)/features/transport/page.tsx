import FeaturePageLayout from "@/components/FeaturePageLayout"
import { Bus } from "lucide-react"

export default function TransportPage() {
  return (
    <FeaturePageLayout
      icon={Bus}
      title="Gestion du Transport"
      description="Suivi transport en temps réel, gestion des itinéraires et notifications automatisées"
      longDescription="Sécurisez et optimisez le transport scolaire avec notre système de géolocalisation en temps réel. Parents et administration peuvent suivre les bus et recevoir des notifications automatiques."
      imagePath="/images/features/transport.svg"
      benefits={[
        "Suivi GPS en temps réel de tous les véhicules",
        "Notifications automatiques aux parents (départ, arrivée)",
        "Gestion optimisée des itinéraires et horaires",
        "Système de sécurité avec contrôle d'accès",
        "Maintenance préventive des véhicules",
        "Rapports de performance et consommation"
      ]}
      features={[
        "Localisation GPS en temps réel",
        "Notifications push aux parents",
        "Planification d'itinéraires optimisés",
        "Système de badge pour montée/descente",
        "Gestion de flotte complète",
        "Suivi de maintenance véhicules",
        "Rapports de ponctualité",
        "Alertes de sécurité automatiques"
      ]}
      useCases={[
        {
          title: "Suivi en temps réel",
          description: "Parents et administration suivent les bus en direct",
          example: "Les parents reçoivent une notification quand le bus approche de l'arrêt et peuvent voir sa position exacte sur une carte interactive."
        },
        {
          title: "Sécurité renforcée",
          description: "Système de contrôle d'accès pour les élèves",
          example: "Chaque élève a un badge RFID. Le système alerte automatiquement si un enfant monte dans le mauvais bus ou ne descend pas au bon arrêt."
        },
        {
          title: "Optimisation des coûts",
          description: "Planification intelligente des itinéraires",
          example: "L'algorithme calcule les trajets les plus efficaces, réduit la consommation de carburant de 25% et améliore la ponctualité."
        }
      ]}
      testimonial={{
        text: "Depuis l'installation du système, nous avons éliminé 100% des incidents de transport et les parents sont rassurés. La ponctualité a augmenté de 90%.",
        author: "Paul Nsimba",
        school: "Responsable Transport, École Internationale de Kinshasa"
      }}
    />
  )
}
