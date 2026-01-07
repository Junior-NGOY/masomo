import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Heart, Globe, Award, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-4">
              Notre mission
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Transformer l'éducation{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                en Afrique
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Masomo Pro est né de la conviction que chaque enfant africain 
              mérite une éducation de qualité, gérée avec des outils modernes 
              et adaptés à notre contexte.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Notre histoire
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Tout a commencé en 2023 lorsque notre équipe a visité plusieurs écoles 
                  à Kinshasa, Lubumbashi et Goma. Nous avons constaté que les directeurs 
                  passaient plus de temps sur la paperasse que sur l'éducation.
                </p>
                <p>
                  Les frais scolaires étaient gérés manuellement, les bulletins créés 
                  sur Excel, et la communication avec les parents se faisait par téléphone. 
                  Il fallait une solution moderne, accessible et adaptée.
                </p>
                <p>
                  C'est ainsi qu'est né Masomo Pro : une plateforme qui comprend 
                  les spécificités du système éducatif congolais et africain, 
                  tout en offrant la puissance de la technologie moderne.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-2xl">
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-gray-600">Écoles partenaires</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <div className="text-2xl font-bold text-green-600">50K+</div>
                    <div className="text-sm text-gray-600">Élèves</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl">
                    <div className="text-2xl font-bold text-purple-600">10</div>
                    <div className="text-sm text-gray-600">Pays africains</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-2xl">
                    <div className="text-2xl font-bold text-orange-600">98%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos valeurs
            </h2>
            <p className="text-xl text-gray-600">
              Ce qui guide notre travail au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Accessibilité</CardTitle>
                <CardDescription>
                  Rendre la technologie éducative accessible à toutes les écoles africaines, 
                  quels que soient leur taille ou leur budget.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Adaptation</CardTitle>
                <CardDescription>
                  Comprendre et respecter les spécificités culturelles et éducatives 
                  de chaque pays africain où nous intervenons.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Excellence</CardTitle>
                <CardDescription>
                  Fournir des outils de qualité internationale tout en restant 
                  simples à utiliser et parfaitement adaptés au contexte local.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre mission pour l'Afrique
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous croyons qu'une meilleure gestion scolaire conduit à une meilleure éducation, 
              et qu'une meilleure éducation transforme l'Afrique.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Autonomiser les éducateurs
              </h3>
              <p className="text-gray-600 text-sm">
                Donner aux directeurs et enseignants les outils pour se concentrer 
                sur l'enseignement plutôt que sur l'administration.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connecter les communautés
              </h3>
              <p className="text-gray-600 text-sm">
                Améliorer la communication entre les écoles, les parents et les élèves 
                pour une meilleure collaboration.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Améliorer les résultats
              </h3>
              <p className="text-gray-600 text-sm">
                Utiliser la data pour identifier les domaines d'amélioration 
                et optimiser les performances scolaires.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Démocratiser l'éducation
              </h3>
              <p className="text-gray-600 text-sm">
                Rendre l'éducation de qualité accessible à tous, 
                indépendamment de la localisation ou du statut socio-économique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre équipe
            </h2>
            <p className="text-xl text-gray-600">
              Une équipe passionnée par l'éducation et la technologie
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">JN</span>
                </div>
                <CardTitle>Junior NGOY</CardTitle>
                <CardDescription>CEO & Fondateur</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">
                  Passionné par l'éducation et la technologie, Junior a créé Masomo Pro 
                  pour révolutionner la gestion scolaire en Afrique.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">MK</span>
                </div>
                <CardTitle>Marie Kabila</CardTitle>
                <CardDescription>Directrice Pédagogique</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">
                  Ex-directrice d'école, Marie apporte son expertise du terrain 
                  pour adapter nos solutions aux réalités éducatives africaines.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">PM</span>
                </div>
                <CardTitle>Paul Mumbere</CardTitle>
                <CardDescription>CTO</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">
                  Expert en développement logiciel, Paul supervise l'architecture 
                  technique de Masomo Pro et son évolution continue.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre impact
            </h2>
            <p className="text-xl text-gray-600">
              Les changements que nous apportons aux écoles africaines
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">60%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Réduction des coûts administratifs
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Nos écoles partenaires ont réduit leurs coûts administratifs 
                    de 60% en moyenne grâce à l'automatisation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">75%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Amélioration de la communication
                  </h3>
                  <p className="text-gray-600 text-sm">
                    75% des parents déclarent être mieux informés sur 
                    la scolarité de leurs enfants.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">90%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Satisfaction des directeurs
                  </h3>
                  <p className="text-gray-600 text-sm">
                    90% des directeurs recommandent Masomo Pro 
                    à leurs collègues et partenaires.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Témoignage
              </h3>
              <p className="text-gray-700 italic mb-4">
                "Depuis que nous utilisons Masomo Pro, notre école fonctionne 
                comme une entreprise moderne. Les parents sont satisfaits, 
                les enseignants sont plus productifs, et nous pouvons nous 
                concentrer sur ce qui compte vraiment : l'éducation."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">DM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Directeur Mutombo</p>
                  <p className="text-sm text-gray-600">École Primaire de Kinshasa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Rejoignez notre mission
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Ensemble, transformons l'éducation africaine. 
            Commencez dès aujourd'hui avec Masomo Pro.
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
              <Link href="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
