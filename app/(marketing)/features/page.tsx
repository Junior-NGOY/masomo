import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Users, GraduationCap, MessageSquare, DollarSign, ClipboardList, Bus, BarChart2, BookOpen, CalendarDays, FileText, Bell, Shield } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Users,
    title: "Gestion des Étudiants",
    description: "Système complet d'information étudiant pour gérer les inscriptions, profils et dossiers académiques",
    href: "/features/student-management",
    color: "bg-blue-500"
  },
  {
    icon: GraduationCap,
    title: "Gestion Académique",
    description: "Planification curriculaire, examens, notation et génération de bulletins dans un système unifié",
    href: "/features/academic-management",
    color: "bg-green-500"
  },
  {
    icon: MessageSquare,
    title: "Hub de Communication",
    description: "Système de messagerie intégré avec notifications multi-canaux pour une communication scolaire fluide",
    href: "/features/communication",
    color: "bg-purple-500"
  },
  {
    icon: DollarSign,
    title: "Gestion Financière",
    description: "Système complet de gestion des frais avec paiements en ligne, facturation et rapports financiers",
    href: "/features/finance",
    color: "bg-emerald-500"
  },
  {
    icon: ClipboardList,
    title: "Gestion du Personnel",
    description: "Outils efficaces pour gérer les dossiers du personnel, présences, évaluations et paie",
    href: "/features/staff-management",
    color: "bg-orange-500"
  },
  {
    icon: Bus,
    title: "Gestion du Transport",
    description: "Suivi transport en temps réel, gestion des itinéraires et notifications automatisées",
    href: "/features/transport",
    color: "bg-yellow-500"
  },
  {
    icon: BarChart2,
    title: "Analytics & Rapports",
    description: "Outils d'analyse puissants pour des décisions basées sur les données avec rapports personnalisables",
    href: "/features/analytics",
    color: "bg-indigo-500"
  },
  {
    icon: BookOpen,
    title: "Gestion des Ressources",
    description: "Système de bibliothèque numérique, suivi d'inventaire et planification des installations",
    href: "/features/resources",
    color: "bg-pink-500"
  },
  {
    icon: CalendarDays,
    title: "Système de Présence",
    description: "Suivi automatisé des présences pour étudiants et personnel avec notifications instantanées",
    href: "/features/attendance",
    color: "bg-cyan-500"
  },
  {
    icon: FileText,
    title: "Portail d'Examens",
    description: "Système complet de gestion des examens de la planification à la publication des résultats",
    href: "/features/examinations",
    color: "bg-red-500"
  },
  {
    icon: Bell,
    title: "Tableau d'Annonces",
    description: "Tableau d'annonces numérique pour communiqués, événements et mises à jour importantes",
    href: "/features/announcements",
    color: "bg-teal-500"
  },
  {
    icon: Shield,
    title: "Sécurité & Accès",
    description: "Contrôle d'accès basé sur les rôles avec chiffrement des données et sauvegardes sécurisées",
    href: "/features/security",
    color: "bg-slate-500"
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Toutes les fonctionnalités dont{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              votre école a besoin
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Découvrez notre suite complète d'outils conçus spécifiquement pour 
            les établissements scolaires africains. De la maternelle à l'université.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
              asChild
            >
              <Link href="/register">
                Essayer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              asChild
            >
              <Link href="/demo">Voir la démo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                      asChild
                    >
                      <Link href={feature.href}>
                        En savoir plus
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à révolutionner votre gestion scolaire ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez plus de 500 écoles qui font déjà confiance à Masomo Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
              asChild
            >
              <Link href="/register">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8"
              asChild
            >
              <Link href="/contact">Contactez-nous</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
