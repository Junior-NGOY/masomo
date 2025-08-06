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
      totalStudents: 1248,
      totalTeachers: 89,
      totalClasses: 24,
      totalSubjects: 18,
      totalParents: 1156,
      activeClasses: 22,
      pendingFees: 125000,
      monthlyRevenue: 2450000
    };
  }

  static getRecentActivities(): RecentActivity[] {
    return [
      {
        id: '1',
        type: 'enrollment',
        message: 'Nouveau étudiant inscrit en 6ème A',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        user: 'Marie Kabila'
      },
      {
        id: '2',
        type: 'payment',
        message: 'Paiement de frais scolaires reçu',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        user: 'Jean Mukendi'
      },
      {
        id: '3',
        type: 'grade',
        message: 'Notes publiées pour le cours de Mathématiques',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        user: 'Prof. Nsilu'
      },
      {
        id: '4',
        type: 'attendance',
        message: 'Présence marquée pour la classe 5ème B',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        user: 'Prof. Kambale'
      },
      {
        id: '5',
        type: 'enrollment',
        message: 'Transfert d\'étudiant approuvé',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
        user: 'Admin École'
      }
    ];
  }

  static getClassPerformance(): ClassPerformance[] {
    return [
      { className: '6ème A', students: 45, averageGrade: 85.2, attendance: 92 },
      { className: '6ème B', students: 42, averageGrade: 82.8, attendance: 89 },
      { className: '5ème A', students: 48, averageGrade: 88.1, attendance: 94 },
      { className: '5ème B', students: 44, averageGrade: 83.5, attendance: 87 },
      { className: '4ème A', students: 41, averageGrade: 86.7, attendance: 91 },
      { className: '4ème B', students: 39, averageGrade: 84.3, attendance: 88 }
    ];
  }

  static getMonthlyData(): MonthlyData[] {
    return [
      { month: 'Jan', students: 1180, revenue: 2200000, expenses: 1800000 },
      { month: 'Fév', students: 1195, revenue: 2280000, expenses: 1850000 },
      { month: 'Mar', students: 1210, revenue: 2350000, expenses: 1900000 },
      { month: 'Avr', students: 1225, revenue: 2380000, expenses: 1920000 },
      { month: 'Mai', students: 1235, revenue: 2420000, expenses: 1950000 },
      { month: 'Jun', students: 1248, revenue: 2450000, expenses: 1980000 }
    ];
  }

  static getTopPerformers(): TopPerformer[] {
    return [
      {
        id: '1',
        name: 'Grace Mbuyi',
        className: '6ème A',
        grade: 95.8,
        avatar: '/avatars/student1.jpg'
      },
      {
        id: '2',
        name: 'Patrick Tshisekedi',
        className: '5ème A',
        grade: 94.2,
        avatar: '/avatars/student2.jpg'
      },
      {
        id: '3',
        name: 'Sarah Kanza',
        className: '6ème B',
        grade: 93.1,
        avatar: '/avatars/student3.jpg'
      },
      {
        id: '4',
        name: 'Michel Kabamba',
        className: '4ème A',
        grade: 92.7,
        avatar: '/avatars/student4.jpg'
      },
      {
        id: '5',
        name: 'Esther Lukusa',
        className: '5ème B',
        grade: 91.9,
        avatar: '/avatars/student5.jpg'
      }
    ];
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
