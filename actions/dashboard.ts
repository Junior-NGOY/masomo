"use server";
import axios from "axios";

const BASE_API_URL = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000") + "/api/v1";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

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

export async function getDashboardStats(schoolId?: string): Promise<DashboardStats> {
  try {
    const params = schoolId ? { schoolId } : {};
    const response = await api.get("/dashboard/stats", { params });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
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
    };
  }
}
