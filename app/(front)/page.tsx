import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, Star, Users, School, DollarSign, Calendar, Shield, Globe, BookOpen, GraduationCap, Award, Clock, CheckCircle, Crown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import DemoVideo from "@/components/DemoVideo"
import PricingSection from "@/components/PricingSection"
import OptimizedHeroCarousel from "@/components/OptimizedHeroCarousel"
import AnimatedSection, { AnimatedCounter } from "@/components/AnimatedSection"
import { generateSEOMetadata, generateSchemaMarkup, StructuredData } from "@/components/SEO"

export const metadata = generateSEOMetadata({
  title: "Plateforme de Gestion Scolaire Moderne",
  description: "Masomo Pro - Solution complète de gestion scolaire avec suivi des élèves, gestion des notes, communication parents-enseignants et bien plus. Essai gratuit disponible.",
  keywords: [
    "gestion scolaire",
    "plateforme éducative",
    "suivi élèves",
    "gestion notes",
    "communication parents",
    "administration scolaire",
    "logiciel école",
    "système éducatif",
    "RDC",
    "Congo"
  ],
  url: "https://masomo-pro.com",
  type: "website"
})

export default function Home() {
  return (
    <>
      {/* Données structurées pour SEO */}
      <StructuredData data={generateSchemaMarkup('WebSite', {})} />
      <StructuredData data={generateSchemaMarkup('Organization', {})} />
      <StructuredData data={generateSchemaMarkup('SoftwareApplication', {})} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slide-up" delay={0}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    🇨🇩 Conçu pour les écoles de la RDC
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                    Gérez votre école avec{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Masomo Pro
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    La solution SaaS complète pour la gestion scolaire en Afrique. 
                    Gérez plusieurs écoles, automatisez les paiements, créez des sites web 
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/demo">
                    <Button 
                      size="lg" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Tester la démo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/school-onboarding">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Commencer gratuitement
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Essai gratuit 30 jours</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Pas de carte de crédit</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Données conservées à vie</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-left" delay={300}>
              <div className="relative">
                <OptimizedHeroCarousel />
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade" delay={0}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <AnimatedCounter value={500} suffix="+" label="Écoles partenaires" />
              <AnimatedCounter value={50000} suffix="+" label="Élèves gérés" />
              <AnimatedCounter value={2000} suffix="+" label="Enseignants actifs" />
              <AnimatedCounter value={98} suffix="%" label="Satisfaction client" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Garantie de continuité des données */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade" delay={0}>
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Vos données sont en sécurité
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Avec Masomo Pro, vous ne perdrez jamais vos données. Notre garantie de continuité 
                vous assure une transition fluide de l'essai à l'abonnement.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection animation="slide-up" delay={0}>
              <Card className="border-0 shadow-lg text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Essai gratuit 30 jours
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Accès complet à toutes les fonctionnalités. Ajoutez vos élèves, 
                    enseignants et configurez votre école.
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">
                    Toutes fonctionnalités incluses
                  </Badge>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={200}>
              <Card className="border-0 shadow-lg text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Conservation garantie
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Toutes vos données d'essai sont automatiquement conservées. 
                    Pas de perte, pas de recommencement.
                  </p>
                  <Badge className="bg-green-100 text-green-800">
                    Zéro perte de données
                  </Badge>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={400}>
              <Card className="border-0 shadow-lg text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Transition fluide
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Passez à l'abonnement en un clic. Récupérez instantanément 
                    toutes vos données et continuez où vous en étiez.
                  </p>
                  <Badge className="bg-purple-100 text-purple-800">
                    Continuité parfaite
                  </Badge>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="fade" delay={600}>
            <div className="mt-12 text-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Comment ça marche ?
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Essai gratuit</h4>
                      <p className="text-sm text-gray-600">
                        Utilisez toutes les fonctionnalités pendant 30 jours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Choisissez votre plan</h4>
                      <p className="text-sm text-gray-600">
                        Sélectionnez l'abonnement qui vous convient
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Continuez</h4>
                      <p className="text-sm text-gray-600">
                        Toutes vos données sont immédiatement disponibles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade" delay={0}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tout ce dont votre école a besoin
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une solution complète adaptée au système éducatif africain, 
                de la maternelle au secondaire avec toutes les options.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection animation="slide-up" delay={0}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow hover-lift">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Gestion Multi-Écoles</CardTitle>
                  <CardDescription>
                    Gérez plusieurs établissements depuis un seul compte. 
                    Maternelle, primaire, secondaire avec toutes les sections.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={100}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow hover-lift">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Gestion Financière</CardTitle>
                  <CardDescription>
                    Paiements des frais scolaires, gestion des tranches, 
                    suivi des impayés et génération automatique de reçus.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={200}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow hover-lift">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Sites Web Automatiques</CardTitle>
                  <CardDescription>
                    Chaque école obtient son site web personnalisable 
                    avec logo, activités, événements et galerie photo.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={300}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow hover-lift">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Gestion Académique</CardTitle>
                  <CardDescription>
                    Notes, bulletins, planning des cours, présences. 
                    Adapté au système éducatif congolais et africain.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={400}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow hover-lift">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Portails Sécurisés</CardTitle>
                  <CardDescription>
                    Accès sécurisé pour directeurs, enseignants, élèves 
                    et parents avec authentification Clerk.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={500}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow hover-lift">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle>Gestion Annuelle</CardTitle>
                  <CardDescription>
                    Archivage automatique des données à chaque fin d'année 
                    scolaire avec historique complet préservé.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Demo Section avec images et vidéos */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Découvrez Masomo Pro en action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explorez notre interface intuitive et nos fonctionnalités avancées 
              à travers ces captures d'écran et vidéos de démonstration.
            </p>
          </div>

          {/* Vidéos de démonstration */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <DemoVideo
              title="Gestion des élèves"
              description="Inscription, profils, suivi académique"
              thumbnail="Voyez comment les écoles peuvent gérer facilement les inscriptions, les profils d'élèves et le suivi académique en temps réel."
              gradient="bg-gradient-to-br from-blue-500 to-purple-600"
            />
            
            <DemoVideo
              title="Gestion financière"
              description="Paiements, frais scolaires, rapports"
              thumbnail="Découvrez comment automatiser les paiements, suivre les frais et générer des rapports financiers détaillés."
              gradient="bg-gradient-to-br from-green-500 to-blue-600"
            />
          </div>

          {/* Captures d'écran de l'application */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 p-4">
                <Image
                  src="/images/demo/dashboard-preview.svg"
                  alt="Tableau de bord Masomo Pro"
                  width={400}
                  height={300}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <h4 className="font-semibold mb-2">Tableau de bord intuitif</h4>
                <p className="text-gray-600 text-sm">
                  Interface moderne avec statistiques en temps réel et navigation simplifiée pour les directeurs d'école.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-blue-100 p-4">
                <Image
                  src="/images/demo/students-management.svg"
                  alt="Gestion des élèves"
                  width={400}
                  height={300}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <h4 className="font-semibold mb-2">Gestion des élèves</h4>
                <p className="text-gray-600 text-sm">
                  Recherche avancée, profils détaillés et suivi académique personnalisé pour chaque élève.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 p-4">
                <Image
                  src="/images/demo/financial-management.svg"
                  alt="Gestion financière"
                  width={400}
                  height={300}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <h4 className="font-semibold mb-2">Analyses financières</h4>
                <p className="text-gray-600 text-sm">
                  Graphiques détaillés, rapports automatisés et prévisions budgétaires pour une gestion optimale.
                </p>
              </div>
            </div>
          </div>

          {/* CTA pour essayer */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à essayer Masomo Pro ?
            </h3>
            <p className="text-gray-600 mb-8">
              Commencez votre essai gratuit de 30 jours dès aujourd'hui. 
              Aucune carte de crédit requise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
                asChild
              >
                <Link href="/school-onboarding">
                  Essai gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                asChild
              >
                <Link href="/contact">
                  Programmer une démo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Education System Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Adapté au système éducatif congolais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Masomo Pro comprend parfaitement le système éducatif de la RDC 
              et s'adapte à tous les niveaux et sections.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👶</span>
                </div>
                <CardTitle className="text-center">Maternelle</CardTitle>
                <CardDescription className="text-center">
                  Gestion des tout-petits avec suivi personnalisé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Suivi développement enfant
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Communication parents
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Activités ludiques
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <CardTitle className="text-center">Primaire</CardTitle>
                <CardDescription className="text-center">
                  De la 1ère à la 6ème année primaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Suivi académique complet
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Évaluations continues
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Bulletins automatiques
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <CardTitle className="text-center">Secondaire</CardTitle>
                <CardDescription className="text-center">
                  Toutes les sections et options disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Section Scientifique
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Section Technique
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Section Pédagogie
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Section Commerciale
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade" delay={0}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ce que disent nos partenaires
              </h2>
              <p className="text-xl text-gray-600">
                Des écoles de toute l'Afrique nous font confiance
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection animation="slide-up" delay={0}>
              <Card className="border-0 shadow-lg hover-lift">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardDescription>
                    "Masomo Pro a révolutionné la gestion de notre école. 
                    Les paiements sont maintenant automatisés et les parents 
                    sont mieux informés."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">MK</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Marie Kabila</p>
                      <p className="text-sm text-gray-600">Directrice, École Primaire Kinshasa</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={200}>
              <Card className="border-0 shadow-lg hover-lift">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardDescription>
                    "L'interface est intuitive et le support technique 
                    est exceptionnel. Nos enseignants l'adorent !"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-green-600">JM</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Jean Mumbere</p>
                      <p className="text-sm text-gray-600">Directeur, Lycée Technique Goma</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={400}>
              <Card className="border-0 shadow-lg hover-lift">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardDescription>
                    "Grâce à Masomo Pro, nous avons réduit nos coûts 
                    administratifs de 60% et amélioré la satisfaction des parents."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-purple-600">AN</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Antoinette Ngoy</p>
                      <p className="text-sm text-gray-600">Directrice, École Sainte-Marie Lubumbashi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              À propos de Masomo Pro
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous révolutionnons l'éducation en Afrique avec une solution complète 
              de gestion scolaire adaptée aux besoins locaux.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Notre mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Masomo Pro est née d'une vision simple : démocratiser l'accès à des outils 
                de gestion scolaire de qualité mondiale pour toutes les écoles africaines. 
                Nous croyons que chaque enfant mérite une éducation excellente, et nous 
                mettons la technologie au service de cette mission.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Spécialement conçue pour le contexte africain, notre plateforme respecte 
                les systèmes éducatifs locaux, les langues nationales et les défis 
                spécifiques des établissements scolaires de la région.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                    <div className="text-gray-600">Écoles partenaires</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                    <div className="text-gray-600">Élèves actifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
                    <div className="text-gray-600">Pays couverts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                    <div className="text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Équipe experte</h4>
              <p className="text-gray-600">
                Une équipe de développeurs et d'experts en éducation africaine 
                dédiée à l'innovation pédagogique.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Sécurité garantie</h4>
              <p className="text-gray-600">
                Vos données sont protégées par les plus hauts standards de sécurité 
                avec hébergement local et conformité RGPD.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Impact local</h4>
              <p className="text-gray-600">
                Conçu par des Africains pour l'Afrique, avec un impact positif 
                sur l'éducation et le développement des communautés locales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contactez-nous
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une question ? Un projet ? Notre équipe est là pour vous accompagner 
              dans votre transformation numérique.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Parlons de votre projet
                </h3>
                <p className="text-gray-600">
                  Que vous soyez une école, un réseau d'établissements ou un ministère, 
                  nous adaptons Masomo Pro à vos besoins spécifiques.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Équipe commerciale</h4>
                    <p className="text-gray-600">
                      Découvrez comment Masomo Pro peut transformer votre établissement.
                    </p>
                    <p className="text-blue-600 font-medium">commercial@masomopro.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Support technique</h4>
                    <p className="text-gray-600">
                      Notre équipe technique vous accompagne 24/7.
                    </p>
                    <p className="text-green-600 font-medium">support@masomopro.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Bureaux régionaux</h4>
                    <p className="text-gray-600">
                      Kinshasa, Lubumbashi, Goma, Bukavu
                    </p>
                    <p className="text-purple-600 font-medium">+243 81 234 5678</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Demande de démonstration</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire et nous vous contacterons dans les 24h.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'établissement *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de votre école"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre d'élèves approximatif
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Moins de 100</option>
                    <option>100 - 500</option>
                    <option>500 - 1000</option>
                    <option>1000 - 2000</option>
                    <option>Plus de 2000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Parlez-nous de vos besoins..."
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Demander une démonstration
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
