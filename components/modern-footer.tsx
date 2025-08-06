import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ModernFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Masomo Pro
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                La plateforme de gestion scolaire la plus complète pour les écoles africaines. 
                Gérez vos établissements avec efficacité et modernité.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Solution Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Solutions</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/features/student-management" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Gestion des Étudiants
                  </Link>
                </li>
                <li>
                  <Link href="/features/academic-management" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Gestion Académique
                  </Link>
                </li>
                <li>
                  <Link href="/features/finance" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Gestion Financière
                  </Link>
                </li>
                <li>
                  <Link href="/features/communication" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Communication
                  </Link>
                </li>
                <li>
                  <Link href="/features/analytics" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Analytics & Rapports
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                    Voir toutes les fonctionnalités →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Ressources</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/webinars" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Webinaires
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Études de cas
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-gray-300 hover:text-white transition-colors text-sm">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300 text-sm">contact@masomopro.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300 text-sm">+243 123 456 789</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300 text-sm">Kinshasa, RDC</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h5 className="font-medium text-white">Newsletter</h5>
                <p className="text-gray-300 text-sm">
                  Restez informé des dernières actualités et mises à jour
                </p>
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Votre email"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 Masomo Pro. Tous droits réservés.
              </p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Confidentialité
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Conditions
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Cookies
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Fait avec</span>
              <span className="text-red-500">❤️</span>
              <span className="text-gray-400 text-sm">pour l'Afrique</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
