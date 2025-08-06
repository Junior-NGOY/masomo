import FeaturePageLayout from "@/components/FeaturePageLayout"
import { Shield } from "lucide-react"

export default function SecurityPage() {
  return (
    <FeaturePageLayout
      icon={Shield}
      title="Sécurité & Accès"
      description="Contrôle d'accès basé sur les rôles avec chiffrement des données et sauvegardes sécurisées"
      longDescription="Protégez vos données sensibles avec notre système de sécurité militaire. Authentification multi-facteurs, chiffrement bout-en-bout et conformité aux standards internationaux pour une tranquillité d'esprit totale."
      imagePath="/images/features/security.svg"
      benefits={[
        "Authentification multi-facteurs (2FA/MFA) pour tous les utilisateurs",
        "Chiffrement AES-256 de toutes les données sensibles",
        "Contrôle d'accès granulaire basé sur les rôles",
        "Sauvegardes automatiques chiffrées et redondantes",
        "Audit trails complets et conformité RGPD",
        "Surveillance en temps réel des tentatives d'intrusion"
      ]}
      features={[
        "Authentification multi-facteurs",
        "Chiffrement bout-en-bout",
        "Gestion des rôles et permissions",
        "Sauvegardes automatiques sécurisées",
        "Logs d'audit complets",
        "Détection d'intrusion temps réel",
        "Conformité RGPD et ISO 27001",
        "Récupération de données d'urgence"
      ]}
      useCases={[
        {
          title: "Accès sécurisé multiniveau",
          description: "Contrôle précis des autorisations par rôle",
          example: "Un enseignant n'accède qu'aux données de ses classes, un parent uniquement aux infos de ses enfants, et seule la direction voit les données financières."
        },
        {
          title: "Protection des données sensibles",
          description: "Chiffrement et sauvegarde automatique",
          example: "Toutes les données sont chiffrées en temps réel, sauvegardées sur 3 sites différents et peuvent être récupérées en moins de 30 minutes."
        },
        {
          title: "Conformité réglementaire",
          description: "Respect des normes internationales de sécurité",
          example: "Le système génère automatiquement les rapports de conformité RGPD et maintient les logs d'audit requis par la réglementation."
        }
      ]}
      testimonial={{
        text: "Depuis 3 ans, zéro incident de sécurité. Les parents ont confiance et nous respectons toutes les exigences réglementaires sans effort supplémentaire.",
        author: "Ir. Patrick Kambale",
        school: "Responsable IT, Université Catholique de Bukavu"
      }}
    />
  )
}
