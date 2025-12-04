import { useState, useEffect } from 'react';

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
}

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/dashboard/stats`);
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard stats');
                }
                const fetchedData = await response.json();
                setStats(fetchedData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
}
