"use client";

import * as React from "react";
import WelcomeBanner from "@/components/dashboard/welcome-message";
import DashboardDetails from "@/components/dashboard/dashboard-details";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivities from "@/components/dashboard/RecentActivities";
import ClassPerformanceCard from "@/components/dashboard/ClassPerformanceCard";
import MonthlyStatsChart from "@/components/dashboard/MonthlyStatsChart";
import TopPerformers from "@/components/dashboard/TopPerformers";
import { DashboardMockDataService } from "@/services/dashboardMockData";
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  BookOpen, 
  UsersRound,
  School,
  DollarSign,
  TrendingUp 
} from "lucide-react";

export default function Dashboard() {
  // Données fictives pour le mode démo
  const mockUser = {
    id: "user_demo_123",
    name: "Administrateur Demo",
    email: "demo@masomo.com",
    role: "ADMIN",
    schoolId: "school_demo_123",
    schoolName: "École Demo"
  };

  // Récupération des données fictives
  const stats = DashboardMockDataService.getDashboardStats();
  
  return (
    <div className="flex-1 space-y-6 p-4">
      <WelcomeBanner
        userSchool={mockUser?.schoolName ?? "École Demo"}
        userName={mockUser?.name}
        userRole={mockUser?.role}
      />
      
      {/* Cartes de statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Étudiants"
          value={DashboardMockDataService.formatNumber(stats.totalStudents)}
          description="Inscrits cette année"
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="Enseignants"
          value={stats.totalTeachers}
          description="Personnel enseignant"
          icon={UserCheck}
          trend={{ value: 2.1, isPositive: true }}
        />
        <StatsCard
          title="Classes Actives"
          value={`${stats.activeClasses}/${stats.totalClasses}`}
          description="Classes en cours"
          icon={School}
          trend={{ value: 100, isPositive: true }}
        />
        <StatsCard
          title="Revenus Mensuels"
          value={DashboardMockDataService.formatCurrency(stats.monthlyRevenue)}
          description="Frais scolaires collectés"
          icon={DollarSign}
          trend={{ value: 8.3, isPositive: true }}
        />
      </div>

      {/* Cartes de statistiques secondaires */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Matières"
          value={stats.totalSubjects}
          description="Programmes enseignés"
          icon={BookOpen}
        />
        <StatsCard
          title="Parents"
          value={DashboardMockDataService.formatNumber(stats.totalParents)}
          description="Comptes parents actifs"
          icon={UsersRound}
        />
        <StatsCard
          title="Frais en Attente"
          value={DashboardMockDataService.formatCurrency(stats.pendingFees)}
          description="À collecter ce mois"
          icon={TrendingUp}
          className="border-orange-200"
        />
        <StatsCard
          title="Taux de Présence"
          value="92.4%"
          description="Moyenne générale"
          icon={GraduationCap}
          trend={{ value: 1.8, isPositive: true }}
        />
      </div>

      {/* Graphiques et données détaillées */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthlyStatsChart />
        </div>
        <RecentActivities />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ClassPerformanceCard />
        <TopPerformers />
      </div>

      {/* Composant existant */}
      <DashboardDetails />
    </div>
  );
}
