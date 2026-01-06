"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  ChevronRight,
  GraduationCap,
  Target
} from "lucide-react";
import { UpcomingClass } from "@/actions/dashboard";

interface AcademicQuickAccessProps {
  averageGrade?: number;
  passRate?: number;
  attendanceRate?: number;
  upcomingClasses?: UpcomingClass[];
}

export default function AcademicQuickAccess({
  averageGrade = 0,
  passRate = 0,
  attendanceRate = 0,
  upcomingClasses = []
}: AcademicQuickAccessProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Accès Académique Rapide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 rounded-lg bg-blue-100">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Moyenne</p>
                <p className="text-lg font-bold">{averageGrade}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="p-2 rounded-lg bg-green-100">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Réussite</p>
                <p className="text-lg font-bold">{passRate}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="p-2 rounded-lg bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Présence</p>
                <p className="text-lg font-bold">{attendanceRate}%</p>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/dashboard/students/grades">
              <Card className="transition-all duration-200 hover:shadow-md cursor-pointer border-2 hover:border-blue-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Voir les notes</h3>
                        <p className="text-sm text-gray-600">Consulter les évaluations</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/students/schedule">
              <Card className="transition-all duration-200 hover:shadow-md cursor-pointer border-2 hover:border-green-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Horaire</h3>
                        <p className="text-sm text-gray-600">Planning des cours</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Prochains cours */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Prochains cours (École)</h4>
            <div className="space-y-2">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm font-medium">{cls.subject}</span>
                      <Badge variant="outline" className="text-xs">{cls.startTime}</Badge>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">{cls.teacher}</span>
                      <span className="text-[10px] text-gray-400 block">{cls.className}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 text-center py-2">
                  Aucun cours à venir aujourd'hui
                </div>
              )}
            </div>
          </div>

          {/* Lien vers le portail complet */}
          <div className="pt-3 border-t">
            <Link href="/dashboard/academic">
              <Button variant="outline" className="w-full">
                <GraduationCap className="h-4 w-4 mr-2" />
                Accéder au portail académique complet
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
