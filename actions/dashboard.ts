"use server";
import axios from "axios";

const BASE_API_URL = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000") + "/api/v1";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  maxRedirects: 0
});

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  students: number;
}

export interface ClassPerformance {
  className: string;
  averageGrade: number;
  studentCount: number;
}

export interface UpcomingClass {
  id: string;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  className: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  totalParents: number;
  activeClasses: number;
  pendingFees: number;
  monthlyRevenue: number;
  monthlyData: MonthlyData[];
  classPerformance: ClassPerformance[];
  academicPerformance: {
      averageGrade: number;
      passRate: number;
      attendanceRate: number;
  };
  upcomingClasses: UpcomingClass[];
}

export async function getDashboardStats(schoolId?: string): Promise<DashboardStats> {
  try {
    const params = schoolId ? { schoolId } : {};
    const response = await api.get("/dashboard/stats", { params });
    return response.data;
  } catch (error: any) {
    // Handle connection errors gracefully without triggering error overlays
    if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET' || error.message?.includes('socket hang up')) {
      console.warn("Dashboard stats unavailable: Backend server is likely down or unreachable.");
    } else {
      console.error("Error fetching dashboard stats:", error.message);
    }
    
    // Return zeroed stats on error
    return {
      totalStudents: 0,
      totalTeachers: 0,
      totalClasses: 0,
      totalSubjects: 0,
      totalParents: 0,
      activeClasses: 0,
      pendingFees: 0,
      monthlyRevenue: 0,
      monthlyData: [],
      classPerformance: [],
      academicPerformance: {
          averageGrade: 0,
          passRate: 0,
          attendanceRate: 0,
      },
      upcomingClasses: [],
    };
  }
}
