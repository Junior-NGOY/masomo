"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardMockDataService } from "@/services/dashboardMockData";
import StatsCard from "@/components/dashboard/StatsCard";
import AcademicQuickAccess from "@/components/dashboard/AcademicQuickAccess";
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Award,
  Target,
  Activity,
  School
} from "lucide-react";

// Composant Progress simple intégré
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
    <div
      className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

export default function OverviewPage() {
  const stats = DashboardMockDataService.getDashboardStats();
  const monthlyData = DashboardMockDataService.getMonthlyData();
  const classPerformance = DashboardMockDataService.getClassPerformance();
  
  // Calculs pour l'overview
  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);
  
  const averageClassSize = Math.round(stats.totalStudents / stats.totalClasses);
  const teacherStudentRatio = Math.round(stats.totalStudents / stats.totalTeachers);
  
  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vue d'Ensemble</h1>
          <p className="text-gray-600 mt-1">Analyse complète de votre établissement</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/students/grades">
            <Button size="sm" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Voir Notes
            </Button>
          </Link>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Système Opérationnel
          </Badge>
        </div>
      </div>

      {/* Métriques Clés */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Revenus Totaux (6 mois)"
          value={DashboardMockDataService.formatCurrency(totalRevenue)}
          description="Janvier - Juin 2025"
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Marge Bénéficiaire"
          value={`${profitMargin}%`}
          description={DashboardMockDataService.formatCurrency(netProfit)}
          icon={Target}
          trend={{ value: 3.2, isPositive: true }}
        />
        <StatsCard
          title="Ratio Enseignant/Élève"
          value={`1:${teacherStudentRatio}`}
          description="Ratio optimal"
          icon={Users}
          className="border-blue-200"
        />
        <StatsCard
          title="Taille Moyenne des Classes"
          value={averageClassSize}
          description="Élèves par classe"
          icon={School}
        />
      </div>

      {/* Widget d'Accès Académique */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <AcademicQuickAccess />
        </div>
        
        <div className="md:col-span-2">
          {/* Indicateurs de Performance */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance Académique */}
            <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Performance Académique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Moyenne Générale</span>
                  <span className="font-medium">85.4%</span>
                </div>
                <Progress value={85.4} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Taux de Réussite</span>
                  <span className="font-medium">92.1%</span>
                </div>
                <Progress value={92.1} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Présence Moyenne</span>
                  <span className="font-medium">91.8%</span>
                </div>
                <Progress value={91.8} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statut des Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Statut des Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classPerformance.slice(0, 4).map((classe, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{classe.className}</p>
                    <p className="text-xs text-gray-500">{classe.students} élèves</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={classe.averageGrade >= 85 ? "text-green-700 border-green-200" : "text-orange-700 border-orange-200"}
                    >
                      {classe.averageGrade}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertes et Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Frais en retard
                </p>
                <p className="text-xs text-yellow-600">
                  15 familles ont des frais en souffrance
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Examens à venir
                </p>
                <p className="text-xs text-blue-600">
                  Examens trimestriels dans 2 semaines
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Système à jour
                </p>
                <p className="text-xs text-green-600">
                  Toutes les données sont synchronisées
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>

      {/* Évolution Mensuelle Détaillée */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution Financière Détaillée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Mois</th>
                  <th className="text-right py-2">Étudiants</th>
                  <th className="text-right py-2">Revenus</th>
                  <th className="text-right py-2">Dépenses</th>
                  <th className="text-right py-2">Bénéfice</th>
                  <th className="text-right py-2">Marge</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((month, index) => {
                  const profit = month.revenue - month.expenses;
                  const margin = ((profit / month.revenue) * 100).toFixed(1);
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{month.month}</td>
                      <td className="text-right py-3">{month.students}</td>
                      <td className="text-right py-3 text-green-600">
                        {DashboardMockDataService.formatCurrency(month.revenue)}
                      </td>
                      <td className="text-right py-3 text-red-600">
                        {DashboardMockDataService.formatCurrency(month.expenses)}
                      </td>
                      <td className="text-right py-3 font-medium">
                        {DashboardMockDataService.formatCurrency(profit)}
                      </td>
                      <td className="text-right py-3">
                        <Badge variant="outline" className="text-xs">
                          {margin}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
