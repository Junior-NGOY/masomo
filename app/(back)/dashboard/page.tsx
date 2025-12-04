import * as React from "react";
import WelcomeBanner from "@/components/dashboard/welcome-message";
import DashboardDetails from "@/components/dashboard/dashboard-details";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivities from "@/components/dashboard/RecentActivities";
import ClassPerformanceCard from "@/components/dashboard/ClassPerformanceCard";
import MonthlyStatsChart from "@/components/dashboard/MonthlyStatsChart";
import TopPerformers from "@/components/dashboard/TopPerformers";
import { DashboardMockDataService } from "@/services/dashboardMockData";
import { getDashboardStats } from "@/actions/dashboard";
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

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // Données fictives pour le mode démo (User)
  const mockUser = {
    id: "user_demo_123",
    name: "Administrateur",
    email: "admin@masomo.pro",
    role: "ADMIN",
    schoolId: "school_demo_123",
    schoolName: "Masomo Pro School"
  };

  // Récupération des données réelles
  const stats = await getDashboardStats();
  
  // Helper functions for formatting
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-CD').format(num);
  };
  
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
          value={formatNumber(stats.totalStudents)}
          description="Inscrits cette année"
          icon={Users}
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="Enseignants"
          value={formatNumber(stats.totalTeachers)}
          description="Personnel enseignant"
          icon={UserCheck}
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="Classes Actives"
          value={`${stats.activeClasses}/${stats.totalClasses}`}
          description="Classes en cours"
          icon={School}
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="Revenus Mensuels"
          value={formatCurrency(stats.monthlyRevenue)}
          description="Frais scolaires collectés"
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      {/* Cartes de statistiques secondaires */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Matières"
          value={formatNumber(stats.totalSubjects)}
          description="Programmes enseignés"
          icon={BookOpen}
        />
        <StatsCard
          title="Parents"
          value={formatNumber(stats.totalParents)}
          description="Comptes parents actifs"
          icon={UsersRound}
        />
        <StatsCard
          title="Frais en Attente"
          value={formatCurrency(stats.pendingFees)}
          description="À collecter ce mois"
          icon={TrendingUp}
          className="border-orange-200"
        />
        <StatsCard
          title="Taux de Présence"
          value="0%"

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

      {/* Composant existant - Commented out to avoid duplicate/mock data */}
      {/* <DashboardDetails /> */}
    </div>
  );
}
