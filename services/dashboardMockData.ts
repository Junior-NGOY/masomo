// Service de données fictives pour le dashboard
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  totalParents: number;
  activeClasses: number;
  pendingFees: number;
  monthlyRevenue: number;
}

export interface RecentActivity {
  id: string;
  type: 'enrollment' | 'payment' | 'grade' | 'attendance';
  message: string;
  timestamp: Date;
  user: string;
}

export interface ClassPerformance {
  className: string;
  students: number;
  averageGrade: number;
  attendance: number;
}

export interface MonthlyData {
  month: string;
  students: number;
  revenue: number;
  expenses: number;
}

export interface TopPerformer {
  id: string;
  name: string;
  className: string;
  grade: number;
  avatar: string;
}

export class DashboardMockDataService {
  static getDashboardStats(): DashboardStats {
    return {
      totalStudents: 0,
      totalTeachers: 0,
      totalClasses: 0,
      totalSubjects: 0,
      totalParents: 0,
      activeClasses: 0,
      pendingFees: 0,
      monthlyRevenue: 0
    };
  }

  static getRecentActivities(): RecentActivity[] {
    return [];
  }

  static getClassPerformance(): ClassPerformance[] {
    return [];
  }

  static getMonthlyData(): MonthlyData[] {
    return [];
  }

  static getTopPerformers(): TopPerformer[] {
    return [];
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  static formatNumber(number: number): string {
    return new Intl.NumberFormat('fr-FR').format(number);
  }

  static getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Il y a ${days}j`;
    }
  }
}
