"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  Bell,
  User,
  Settings,
  ChevronRight,
  GraduationCap,
  Target,
  BarChart3
} from "lucide-react";

interface AcademicNavigationProps {
  userType: 'student' | 'teacher' | 'admin';
  studentName?: string;
  className?: string;
  notifications?: number;
}

export default function AcademicNavigation({ 
  userType, 
  studentName = "Jean Mukendi", 
  className = "6ème Scientifique",
  notifications = 3 
}: AcademicNavigationProps) {
  const pathname = usePathname();

  const studentMenuItems = [
    {
      title: "Mes Notes",
      description: "Consulter mes notes et bulletins",
      href: "/school/student/grades",
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      features: ["Notes par matière", "Bulletins", "Statistiques"]
    },
    {
      title: "Mon Horaire",
      description: "Emploi du temps et planning",
      href: "/school/student/schedule", 
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      features: ["Cours du jour", "Planning semaine", "Évaluations"]
    },
    {
      title: "Mes Présences",
      description: "Historique d'assiduité",
      href: "/school/student/attendance",
      icon: Clock,
      color: "text-orange-600", 
      bgColor: "bg-orange-100",
      features: ["Présences", "Absences", "Retards"]
    },
    {
      title: "Mon Profil",
      description: "Informations personnelles",
      href: "/school/student/profile",
      icon: User,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      features: ["Données perso", "Photo", "Contacts"]
    }
  ];

  const teacherMenuItems = [
    {
      title: "Gestion des Notes",
      description: "Saisir et modifier les notes",
      href: "/school/teacher/grades",
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      features: ["Saisie notes", "Bulletins", "Statistiques"]
    },
    {
      title: "Mon Planning",
      description: "Emploi du temps personnel",
      href: "/school/teacher/schedule",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100", 
      features: ["Mes cours", "Salles", "Conflits"]
    },
    {
      title: "Présences Élèves",
      description: "Gestion des présences",
      href: "/school/teacher/attendance",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      features: ["Appel", "Absences", "Justificatifs"]
    },
    {
      title: "Mes Élèves",
      description: "Liste de mes classes",
      href: "/school/teacher/students",
      icon: GraduationCap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      features: ["Classes", "Fiches élèves", "Notes"]
    }
  ];

  const adminMenuItems = [
    {
      title: "Gestion Académique",
      description: "Vue d'ensemble des notes",
      href: "/school/admin/grades",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      features: ["Toutes notes", "Bulletins", "Analyses"]
    },
    {
      title: "Planning Général",
      description: "Emplois du temps globaux",
      href: "/school/admin/schedule",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      features: ["Tous horaires", "Conflits", "Salles"]
    },
    {
      title: "Enseignants",
      description: "Gestion du corps enseignant",
      href: "/school/admin/teachers",
      icon: User,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      features: ["Professeurs", "Matières", "Charges"]
    },
    {
      title: "Rapports",
      description: "Analyses et statistiques",
      href: "/school/admin/reports",
      icon: FileSpreadsheet,
      color: "text-red-600",
      bgColor: "bg-red-100",
      features: ["Bulletins", "Stats", "Exports"]
    }
  ];

  const getMenuItems = () => {
    switch (userType) {
      case 'student': return studentMenuItems;
      case 'teacher': return teacherMenuItems;
      case 'admin': return adminMenuItems;
      default: return studentMenuItems;
    }
  };

  const getUserTitle = () => {
    switch (userType) {
      case 'student': return `Espace Élève - ${studentName}`;
      case 'teacher': return `Espace Enseignant`;
      case 'admin': return `Administration Académique`;
      default: return 'Espace Académique';
    }
  };

  const getUserSubtitle = () => {
    switch (userType) {
      case 'student': return `Classe: ${className}`;
      case 'teacher': return `Gestion pédagogique`;
      case 'admin': return `Vue d'ensemble de l'établissement`;
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{getUserTitle()}</h1>
        <p className="text-gray-600">{getUserSubtitle()}</p>
        {notifications > 0 && (
          <div className="flex justify-center">
            <Badge variant="destructive" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              {notifications} notification{notifications > 1 ? 's' : ''}
            </Badge>
          </div>
        )}
      </div>

      {/* Statistiques rapides (pour les élèves) */}
      {userType === 'student' && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Moyenne Générale</p>
                  <p className="text-xl font-bold">14.5/20</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rang en Classe</p>
                  <p className="text-xl font-bold">3/28</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Présence</p>
                  <p className="text-xl font-bold">96.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Menu principal */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {getMenuItems().map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <Card className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${item.bgColor}`}>
                      <Icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {item.features.map((feature) => (
                          <Badge 
                            key={feature} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Actions rapides */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Actions Rapides</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exporter mes données
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
