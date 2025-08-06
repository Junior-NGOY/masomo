import FeaturePageLayout from "@/components/FeaturePageLayout"
import { DollarSign } from "lucide-react"

export default function FinancePage() {
  return (
    <FeaturePageLayout
      icon={DollarSign}
      title="Gestion Financière"
      description="Système complet de gestion des frais avec paiements en ligne, facturation et rapports financiers"
      longDescription="Simplifiez la gestion financière de votre école avec notre système intégré. De la facturation aux paiements en ligne, en passant par la comptabilité, tout est automatisé et sécurisé."
      imagePath="/images/features/finance.svg"
      benefits={[
        "Facturation automatique des frais scolaires par tranches",
        "Paiements en ligne sécurisés (Mobile Money, cartes bancaires)",
        "Suivi des impayés avec relances automatiques",
        "Comptabilité intégrée avec rapports financiers",
        "Gestion des bourses et réductions",
        "Intégration avec les systèmes bancaires locaux"
      ]}
      features={[
        "Facturation automatisée par tranches",
        "Paiements mobile money (M-Pesa, Orange Money)",
        "Gestion des impayés et relances",
        "Rapports financiers détaillés",
        "Comptabilité générale intégrée",
        "Gestion des bourses et réductions",
        "Reçus numériques automatiques",
        "Tableau de bord financier en temps réel"
      ]}
      useCases={[
        {
          title: "Paiements échelonnés",
          description: "Facilitez les paiements pour les familles avec des tranches flexibles",
          example: "Les parents peuvent payer les frais scolaires en 3 tranches avec des échéances personnalisées et recevoir des rappels automatiques."
        },
        {
          title: "Mobile Money intégré",
          description: "Acceptez les paiements via tous les services locaux",
          example: "Les parents paient directement via Vodacom M-Pesa ou Orange Money, avec confirmation instantanée et mise à jour automatique des comptes."
        },
        {
          title: "Suivi des impayés",
          description: "Gérez efficacement les retards de paiement",
          example: "Le système identifie automatiquement les impayés, envoie des relances graduelles et bloque l'accès aux services si nécessaire."
        }
      ]}
      testimonial={{
        text: "Notre taux de recouvrement a augmenté de 40% grâce aux paiements mobile money et aux relances automatiques. Les parents apprécient la flexibilité.",
        author: "Emmanuel Tshisekedi",
        school: "Administrateur, Complexe Scolaire Bosangani, Kisangani"
      }}
    />
  )
}
