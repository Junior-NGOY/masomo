import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  Award,
  GraduationCap,
  ArrowLeft,
  ExternalLink
} from "lucide-react";

export default function AcademicIndexPage() {
  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/overview">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Système Académique</h1>
          <p className="text-gray-600 mt-1">Gestion des notes et horaires des élèves</p>
        </div>
      </div>

      {/* Cartes d'accès rapide */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Notes des élèves */}
        <Link href="/dashboard/students/grades">
          <Card className="transition-all duration-200 hover:shadow-lg cursor-pointer border-2 hover:border-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                Notes des Élèves
                <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Consulter les notes, moyennes et bulletins des élèves
              </p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">Notes par matière</Badge>
                <Badge variant="secondary" className="text-xs">Moyennes</Badge>
                <Badge variant="secondary" className="text-xs">Bulletins</Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Horaires */}
        <Link href="/dashboard/students/schedule">
          <Card className="transition-all duration-200 hover:shadow-lg cursor-pointer border-2 hover:border-green-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                Horaires de Cours
                <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Consulter les emplois du temps et plannings des classes
              </p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">Planning hebdo</Badge>
                <Badge variant="secondary" className="text-xs">Cours du jour</Badge>
                <Badge variant="secondary" className="text-xs">Évaluations</Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Portail complet */}
        <Link href="/demo/academic-system">
          <Card className="transition-all duration-200 hover:shadow-lg cursor-pointer border-2 hover:border-purple-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                Portail Complet
                <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Interface complète avec navigation par onglets
              </p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">Navigation</Badge>
                <Badge variant="secondary" className="text-xs">Vue unifiée</Badge>
                <Badge variant="secondary" className="text-xs">Demo</Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

      </div>

      {/* Informations sur le système */}
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Gestion des Notes
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Consultation des notes par matière</li>
                <li>• Calcul automatique des moyennes</li>
                <li>• Système de notation A+ à F</li>
                <li>• Export Excel des bulletins</li>
                <li>• Suivi par trimestre/semestre</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                Gestion des Horaires
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Emploi du temps hebdomadaire</li>
                <li>• Indication des cours en cours</li>
                <li>• Planning des évaluations</li>
                <li>• Détection de conflits</li>
                <li>• Export des plannings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
